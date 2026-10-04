"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  FileImage,
  Lightbulb,
  MessageCircle,
  Paperclip,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { isProjectDashboard } from "@/lib/project-dashboard";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ProjectContext = {
  idea: string;
  experience: "starting" | "building" | "experienced";
  skills: string;
  hoursPerWeek: number;
};

type ImageAttachment = {
  name: string;
  mimeType: string;
  data: string;
};

type Conversation = {
  id: string;
  title: string;
  project: ProjectContext;
  messages: ChatMessage[];
};

const starters = [
  {
    title: "What do you want to make?",
    description: "A useful tool, a game, a better everyday experience?",
    icon: Lightbulb,
    idea: "I want to make a campus spending tracker that helps students see where their money goes and set a weekly budget.",
  },
  {
    title: "Start with a what if...",
    description: "You don't need a finished idea. A curious question is enough.",
    icon: Sparkles,
    idea: "What if neighbors could easily share extra food, tools, and things they no longer need?",
  },
  {
    title: "Let's find your first move.",
    description: "We'll figure out the scope, tools, and skills together.",
    icon: ArrowRight,
    idea: "I want to build a simple website, but I need help choosing a useful idea and figuring out where to start.",
  },
];

const experienceOptions: Array<{
  value: ProjectContext["experience"];
  label: string;
}> = [
  { value: "starting", label: "Just starting" },
  { value: "building", label: "Built a few things" },
  { value: "experienced", label: "Experienced" },
];

const initialAssistantMessage: ChatMessage = {
  role: "assistant",
  content: "Your idea starts here. Tell me what you want to make, or pick a prompt to get the conversation moving.",
};

function imageToAttachment(file: File): Promise<ImageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Couldn't read that image. Try another file."));
        return;
      }
      const data = result.split(",")[1];
      if (!data) {
        reject(new Error("Couldn't read that image. Try another file."));
        return;
      }
      resolve({ name: file.name, mimeType: file.type, data });
    };
    reader.onerror = () => reject(new Error("Couldn't read that image. Try another file."));
    reader.readAsDataURL(file);
  });
}

export default function IdeaNotebook() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [experience, setExperience] = useState<ProjectContext["experience"]>("starting");
  const [skills, setSkills] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(4);
  const [attachment, setAttachment] = useState<ImageAttachment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendToMentor(
    text: string,
    project: ProjectContext,
    images: ImageAttachment[] = [],
    conversationId = activeConversationId,
    previousMessages = messages,
  ): Promise<boolean> {
    if (loading || !text.trim()) return false;
    const nextMessages = [...previousMessages, { role: "user" as const, content: text.trim() }];
    setMessages(nextMessages);
    if (conversationId) {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, messages: nextMessages }
            : conversation,
        ),
      );
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((message) => message !== initialAssistantMessage).slice(-12),
          project,
          attachments: images,
        }),
      });
      const result = (await response.json()) as {
        reply?: unknown;
        dashboard?: unknown;
        error?: unknown;
      };
      if (!response.ok) {
        throw new Error(
          typeof result.error === "string" ? result.error : "The mentor couldn't answer right now.",
        );
      }
      if (typeof result.reply !== "string" || result.reply.trim().length === 0) {
        throw new Error("The mentor returned an empty reply. Please try again.");
      }
      const isInitialRequest = previousMessages.every((message) => message.role !== "user");
      if (isInitialRequest) {
        if (!isProjectDashboard(result.dashboard)) {
          throw new Error("The project dashboard was incomplete. Please try again.");
        }
        if (!conversationId) {
          throw new Error("Couldn't open the project dashboard. Please try again.");
        }
        try {
          localStorage.setItem(
            `blueprint-project-dashboard:${conversationId}`,
            JSON.stringify(result.dashboard),
          );
        } catch {
          throw new Error("Couldn't save this dashboard in your browser. Check available storage and retry.");
        }
      }

      const completedMessages = [...nextMessages, { role: "assistant" as const, content: result.reply }];
      setMessages(completedMessages);
      if (conversationId) {
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, messages: completedMessages }
              : conversation,
          ),
        );
      }
      if (isInitialRequest && conversationId) {
        router.push(`/my-workspace/projects/${conversationId}`);
      }
      return true;
    } catch (requestError) {
      setMessages(previousMessages);
      if (conversationId) {
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, messages: previousMessages }
              : conversation,
          ),
        );
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The mentor couldn't answer right now. Try again.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function createBlueprint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (idea.trim().length < 10 || loading) return;

    const project: ProjectContext = {
      idea: idea.trim(),
      experience,
      skills: skills.trim(),
      hoursPerWeek,
    };
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: idea.trim().replace(/\s+/g, " ").slice(0, 44),
      project,
      messages: [initialAssistantMessage],
    };
    setActiveConversationId(conversation.id);
    setConversations((current) => [conversation, ...current]);
    setMessages([initialAssistantMessage]);
    const prompt = `Help me turn this idea into a personalized project blueprint: ${project.idea}`;
    const image = attachment;
    setAttachment(null);
    setIdea("");
    await sendToMentor(
      prompt,
      project,
      image ? [image] : [],
      conversation.id,
      [initialAssistantMessage],
    );
  }

  async function sendFollowUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const active = conversations.find((conversation) => conversation.id === activeConversationId);
    if (!active || !idea.trim()) return;
    const text = idea.trim();
    setIdea("");
    if (!(await sendToMentor(text, active.project))) setIdea(text);
  }

  function startNewConversation() {
    setActiveConversationId(null);
    setMessages([initialAssistantMessage]);
    setIdea("");
    setAttachment(null);
    setError("");
    setExperience("starting");
    setSkills("");
    setHoursPerWeek(4);
  }

  function openConversation(conversation: Conversation) {
    setActiveConversationId(conversation.id);
    setMessages(conversation.messages);
    setIdea("");
    setError("");
  }

  function chooseStarter(starterIdea: string) {
    setIdea(starterIdea);
    composerRef.current?.focus();
  }

  async function attachImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Choose a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }
    try {
      setAttachment(await imageToAttachment(file));
      setError("");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Couldn't read that image.");
    }
  }

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const notes = activeConversation?.project;

  return (
    <main className="notebook-page min-h-[calc(100vh-1rem)] px-3 pb-5 pt-4 text-[#35291f] sm:px-10 sm:pt-4">
      <div className="notebook-wrap mx-auto max-w-[1180px]">
        <WorkspaceHeader />

        <section className="notebook-frame">
          <aside className="notebook-sidebar">
            <div>
              <p className="notebook-eyebrow">YOUR CASE FILE</p>
              <h1 className="notebook-sidebar-title">
                {activeConversation?.title ?? "Untitled blueprint"}
              </h1>
              <button type="button" className="notebook-new-button" onClick={startNewConversation} disabled={loading}>
                <Plus className="size-3.5" /> New conversation
              </button>
            </div>

            <div className="notebook-section">
              <p className="notebook-eyebrow">CONVERSATIONS</p>
              {activeConversation ? (
                <button
                  type="button"
                  onClick={() => openConversation(activeConversation)}
                  disabled={loading}
                  className="notebook-conversation active"
                >
                  <span>{activeConversation.title}</span>
                  <small>Current conversation</small>
                </button>
              ) : (
                <div className="notebook-conversation active">
                  <span>Your first spark</span>
                  <small>Current conversation</small>
                </div>
              )}
              <p className="notebook-sidebar-hint">
                More chats can live inside this project&apos;s case file.
              </p>
            </div>

            <div className="notebook-section notebook-notes">
              <p className="notebook-eyebrow">BLUEPRINT NOTES</p>
              <div className="notebook-progress" aria-hidden="true">
                <span style={{ width: notes ? "100%" : "18%" }} />
              </div>
              <h2>Your plan takes shape here.</h2>
              <ul>
                <li>Project brief</li>
                <li>Suggested tech stack</li>
                <li>Milestones &amp; task recommendations</li>
                <li>Skills you&apos;ll learn</li>
              </ul>
            </div>

            {conversations.length > 1 && (
              <div className="notebook-past-chats">
                <p className="notebook-eyebrow">PAST CHATS</p>
                {conversations
                  .filter((conversation) => conversation.id !== activeConversationId)
                  .slice(0, 4)
                  .map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => openConversation(conversation)}
                      disabled={loading}
                    >
                      {conversation.title}
                    </button>
                  ))}
              </div>
            )}
          </aside>

          <section className="notebook-workspace">
            <header className="notebook-titlebar">
              <p className="notebook-eyebrow">YOUR IDEA, WITH A WAY FORWARD</p>
              <h2>Let&apos;s make the blueprint for your project.</h2>
              <p>Start with a spark. Your project assistant will help turn it into a plan you can build.</p>
            </header>

            <div className="notebook-canvas">
              {!activeConversation ? (
                <div className="notebook-starters" aria-label="Idea prompts">
                  {starters.map((starter, index) => {
                    const Icon = starter.icon;
                    return (
                      <button
                        key={starter.title}
                        type="button"
                        onClick={() => chooseStarter(starter.idea)}
                        className={`notebook-starter starter-${index + 1}`}
                      >
                        <span className="notebook-starter-copy">
                          <span className="notebook-starter-title">{starter.title}</span>
                          <span className="notebook-starter-description">{starter.description}</span>
                        </span>
                        <span className="notebook-starter-icons" aria-hidden="true">
                          <Icon />
                          <MessageCircle />
                          <Paperclip />
                          <ArrowRight />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="notebook-messages" ref={messageListRef} aria-live="polite">
                  {messages
                    .filter((message) => message !== initialAssistantMessage)
                    .map((message, index) => (
                      <article
                        key={`${activeConversationId}-${index}`}
                        className={`notebook-message ${message.role === "user" ? "user" : "mentor"}`}
                      >
                        <p className="notebook-message-label">
                          {message.role === "user" ? "YOUR NOTE" : "YOUR PROJECT ASSISTANT"}
                        </p>
                        <p className="notebook-message-copy">{message.content}</p>
                      </article>
                    ))}
                  {loading && (
                    <div className="notebook-thinking">
                      <span className="notebook-thinking-dot" />
                      Sketching out your blueprint...
                    </div>
                  )}
                  <div />
                </div>
              )}
            </div>

            {error && (
              <p role="alert" className="notebook-error">
                {error}
              </p>
            )}

            {activeConversation ? (
              <form className="notebook-composer followup" onSubmit={sendFollowUp}>
                <textarea
                  ref={composerRef}
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  maxLength={2000}
                  placeholder="Ask a question or add a thought to your project..."
                  aria-label="Message your project assistant"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <div className="notebook-composer-bottom">
                  <span className="notebook-composer-note">
                    <Check className="size-3" /> Your conversation stays with this case file
                  </span>
                  <button type="submit" disabled={loading || !idea.trim()} className="notebook-generate">
                    Send to mentor <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <form className="notebook-builder" onSubmit={createBlueprint}>
                <div className="notebook-composer">
                  <textarea
                    ref={composerRef}
                    required
                    minLength={10}
                    maxLength={1000}
                    value={idea}
                    onChange={(event) => setIdea(event.target.value)}
                    placeholder="I want to build a campus spending tracker that helps students see where their money goes and set a weekly budget."
                    aria-label="Describe your project idea"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  {attachment && (
                    <div className="notebook-attachment">
                      <FileImage className="size-3" />
                      <span>{attachment.name}</span>
                      <button type="button" aria-label="Remove image" onClick={() => setAttachment(null)}>
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                  <div className="notebook-composer-tools">
                    <button
                      type="button"
                      className="notebook-attach"
                      aria-label="Attach an image"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="size-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={attachImage}
                    />
                    <details className="notebook-settings">
                      <summary>
                        <span>{experienceOptions.find((option) => option.value === experience)?.label}</span>
                        <ChevronDown className="size-3" />
                      </summary>
                      <div className="notebook-settings-popover">
                        <label htmlFor="notebook-experience">Your experience</label>
                        <select
                          id="notebook-experience"
                          value={experience}
                          onChange={(event) =>
                            setExperience(event.target.value as ProjectContext["experience"])
                          }
                        >
                          {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="notebook-skills">Tools you already know</label>
                        <input
                          id="notebook-skills"
                          maxLength={300}
                          value={skills}
                          onChange={(event) => setSkills(event.target.value)}
                          placeholder="Python, Figma..."
                        />
                        <label htmlFor="notebook-hours">Time available: {hoursPerWeek} h / week</label>
                        <input
                          id="notebook-hours"
                          type="range"
                          min="1"
                          max="20"
                          value={hoursPerWeek}
                          onChange={(event) => setHoursPerWeek(Number(event.target.value))}
                        />
                      </div>
                    </details>
                  </div>
                </div>
                <div className="notebook-builder-footer">
                  <p>
                    <span>Attach images with +</span>
                    <span className="notebook-footer-separator">·</span>
                    <span>Shift + Enter for a new line</span>
                  </p>
                  <button type="submit" disabled={loading || idea.trim().length < 10} className="notebook-generate">
                    {loading ? "Making your blueprint..." : "Generate my project plan"}
                    {loading ? <span className="notebook-spinner" /> : <ArrowRight className="size-3.5" />}
                  </button>
                  <p className="notebook-disclaimer">
                    Suggested plans are drafts. Review the scope and pace before starting.
                  </p>
                </div>
              </form>
            )}
            <div className="notebook-canvas-help">
              <CircleHelp className="size-3" />
              <span>Your project notes are sent to Gemini to create your personalized blueprint.</span>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
