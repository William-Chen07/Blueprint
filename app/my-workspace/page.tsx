import IdeaPlanner from "@/components/idea-planner";
import FlashlightBoard from "@/components/flashlight-board";

export default function MyWorkspacePage() {
  return (
    <main className="wood-texture min-h-screen px-4 py-8 text-[#25221c] sm:px-8 lg:px-12">
      <FlashlightBoard>
        <div className="mx-auto max-w-6xl pb-12">
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#c5b890]">
            YOUR WORKSPACE / IDEA TO ACTION
          </p>
          <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[.95] text-[#eadcb9] sm:text-7xl">
            Let&apos;s make it real.
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-[#b9a77e]">
            Describe what you wish existed. Your AI mentor will map out a tech
            stack, what to learn, and a practical path to your first version.
          </p>
          <IdeaPlanner />
        </div>
      </FlashlightBoard>
    </main>
  );
}
