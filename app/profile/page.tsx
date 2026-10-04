"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FormEvent, useMemo, useSyncExternalStore } from "react";

const interests = [
  "Web development",
  "Data science",
  "Design",
  "AI",
  "Cybersecurity",
  "Game development",
];

const skillGroups = [
  {
    label: "Web development",
    skills: ["HTML + CSS", "JavaScript", "TypeScript", "React", "Node.js"],
  },
  {
    label: "Data science",
    skills: ["Python", "R", "Pandas", "NumPy", "Jupyter"],
  },
  {
    label: "Design",
    skills: ["Figma", "User research", "Wireframing", "Prototyping", "UI design"],
  },
  {
    label: "AI",
    skills: ["Python", "TensorFlow", "PyTorch", "Prompt design", "Machine learning"],
  },
  {
    label: "Cybersecurity",
    skills: ["Linux", "Python", "Networking", "Ethical hacking", "Network security"],
  },
  {
    label: "Game development",
    skills: ["C#", "C++", "Unity", "Unreal Engine", "Blender"],
  },
];

const experienceOptions = [
  { value: "starting", label: "Just starting" },
  { value: "building", label: "Built a few things" },
  { value: "experienced", label: "Experienced" },
];

const paceOptions = [
  { value: 2, label: "CASUAL", text: "2 hrs / week" },
  { value: 4, label: "RELAXED", text: "4 hrs / week" },
  { value: 8, label: "FOCUSED", text: "8 hrs / week" },
];

const PROFILE_STORAGE_KEY = "buildfolio-profile-preferences";
const defaultPreferences = {
  interests: [] as string[],
  skills: [] as string[],
  experience: "starting",
  hours: 4,
};

function subscribeToProfile(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredProfile() {
  return window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? "";
}

export default function ProfilePage() {
  const storedProfile = useSyncExternalStore(subscribeToProfile, getStoredProfile, () => "");
  const preferences = useMemo(() => {
    if (!storedProfile) return defaultPreferences;
    try {
      const parsed = JSON.parse(storedProfile);
      return {
        interests: Array.isArray(parsed.interests) ? parsed.interests.filter((item: unknown): item is string => typeof item === "string") : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills.filter((item: unknown): item is string => typeof item === "string") : [],
        experience: typeof parsed.experience === "string" ? parsed.experience : defaultPreferences.experience,
        hours: typeof parsed.hours === "number" ? parsed.hours : defaultPreferences.hours,
      };
    } catch {
      return defaultPreferences;
    }
  }, [storedProfile]);
  const selectedInterests = preferences.interests;
  const selectedSkills = preferences.skills;
  const experience = preferences.experience;
  const hours = preferences.hours;

  function savePreferences(next: typeof defaultPreferences) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    window.localStorage.setItem("buildfolio-interests", JSON.stringify(next.interests));
    window.dispatchEvent(new Event("storage"));
  }

  function toggleInterest(interest: string) {
    savePreferences({
      ...preferences,
      interests: selectedInterests.includes(interest)
        ? selectedInterests.filter((item) => item !== interest)
        : [...selectedInterests, interest],
    });
  }

  function addSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const skillChoice = String(new FormData(event.currentTarget).get("skillChoice") ?? "");
    if (!skillChoice || selectedSkills.includes(skillChoice)) {
      return;
    }
    savePreferences({ ...preferences, skills: [...selectedSkills, skillChoice] });
    event.currentTarget.reset();
  }

  return (
    <main className="wood-texture min-h-screen px-4 py-8 text-[#2b2014] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1344px] pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,856px)_minmax(300px,464px)] lg:items-start">
          <section className="flex flex-col gap-[18px] overflow-hidden rounded-[3px] border border-[#b8a47e] bg-[#f1e6cb] p-5 shadow-[3px_8px_18px_rgba(0,0,0,.38)] sm:p-6">
            <fieldset>
              <legend className="font-sans text-2xl font-bold leading-[1.4] text-[#252a25]">
                1. Pick your interests
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {interests.map((interest, index) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleInterest(interest)}
                      className="flex h-[58px] flex-col items-stretch text-left font-mono text-[13px]"
                    >
                      <span
                        className={`flex h-[17px] w-[82px] items-center rounded-t-[3px] pl-2 text-[10px] ${
                          active ? "bg-[#702b1a] text-[#ebdebd]" : "bg-[#baa885] text-[#2b2014]"
                        }`}
                      >
                        F·00{index + 1}
                      </span>
                      <span
                        className={`flex h-[41px] items-center border border-[#2b2014] pl-3 ${
                          active ? "bg-[#ccb87a]" : "bg-[#ebdebd]"
                        }`}
                      >
                        {active && <Check className="mr-1 size-3" />}
                        {interest}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-sans text-2xl font-bold leading-[1.4] text-[#252a25]">
                2. Your experience
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {experienceOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex h-[46px] cursor-pointer items-center border border-[#2b2014] px-3 font-mono text-[13px] ${
                      experience === option.value ? "bg-[#ccb87a]" : "bg-[#ebdebd]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="experience"
                      value={option.value}
                      checked={experience === option.value}
                      onChange={() => savePreferences({ ...preferences, experience: option.value })}
                      className="sr-only"
                    />
                    <span aria-hidden="true" className="mr-2 text-[12px]">
                      {experience === option.value ? "●" : "○"}
                    </span>
                    {option.label}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-base leading-[1.4] text-[#625747]">
                {experience === "starting"
                  ? "New to tech? We’ll include setup steps and explain the vocabulary."
                  : experience === "building"
                    ? "You’ve got the basics. We’ll add useful stretch goals."
                    : "You’re ready for ambitious builds and deeper technical choices."}
              </p>
            </fieldset>

            <fieldset>
              <legend className="font-sans text-2xl font-bold leading-[1.4] text-[#252a25]">
                3. Skills you already have
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedSkills.map((skill, index) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => savePreferences({ ...preferences, skills: selectedSkills.filter((item) => item !== skill) })}
                    aria-label={`Remove ${skill}`}
                    className="flex h-[58px] flex-col items-stretch text-left font-mono text-[13px]"
                  >
                    <span className="flex h-[17px] w-[82px] items-center rounded-t-[3px] bg-[#702b1a] pl-2 text-[10px] text-[#ebdebd]">
                      S·00{index + 1}
                    </span>
                    <span className="flex h-[41px] items-center border border-[#2b2014] bg-[#ccb87a] pl-3">
                      <Check className="mr-1 size-3" />
                      {skill}
                    </span>
                  </button>
                ))}
              </div>
              <form onSubmit={addSkill} className="mt-3 flex gap-3">
                <label className="flex h-[46px] min-w-0 flex-1 items-center border border-[#8a704d] bg-[#f5ebd1] px-4 font-mono text-[14px]">
                  <span className="mr-2" aria-hidden="true">+</span>
                  <span className="sr-only">Choose a language or tool</span>
                  <span className="relative min-w-0 flex-1">
                    <select
                      name="skillChoice"
                      defaultValue=""
                      className="h-9 w-full cursor-pointer appearance-none border border-[#b8a47e] bg-[#ebdebd] px-3 pr-9 font-mono text-[13px] text-[#2b2014] outline-none transition-colors focus:border-[#702b1a] focus:ring-1 focus:ring-[#702b1a]"
                    >
                      <option value="">Choose a language or tool…</option>
                      {skillGroups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.skills
                            .filter((skill) => !selectedSkills.includes(skill))
                            .map((skill) => <option key={`${group.label}-${skill}`} value={skill}>{skill}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#702b1a]" aria-hidden="true">
                      ▾
                    </span>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={selectedSkills.length >= skillGroups.reduce((total, group) => total + group.skills.length, 0)}
                  className="h-[46px] w-[126px] shrink-0 bg-[#702b1a] font-mono text-[14px] text-[#ebdebd] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add +
                </button>
              </form>
            </fieldset>

            <fieldset>
              <legend className="font-sans text-2xl font-bold leading-[1.4] text-[#252a25]">
                4. Time you can set aside
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {paceOptions.map((option) => {
                  const active = hours === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => savePreferences({ ...preferences, hours: option.value })}
                      aria-pressed={active}
                      className="flex h-[58px] flex-col items-stretch text-left font-mono text-[13px]"
                    >
                      <span className={`flex h-[17px] w-[82px] items-center rounded-t-[3px] pl-2 text-[10px] ${active ? "bg-[#702b1a] text-[#ebdebd]" : "bg-[#baa885] text-[#2b2014]"}`}>
                        {option.label}
                      </span>
                      <span className={`flex h-[41px] items-center border border-[#2b2014] pl-3 ${active ? "bg-[#ccb87a]" : "bg-[#ebdebd]"}`}>
                        {active && <Check className="mr-1 size-3" />}
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-xs text-[#2b2014]">
                Selected: {hours} hours / week · You can adjust your pace anytime.
              </p>
            </fieldset>

            <Link
              href="/projects"
              className="mt-1 inline-flex h-12 w-[220px] items-center justify-center gap-2 rounded-[6px] bg-[#923d29] px-4 text-sm font-bold text-[#f1e6cb] shadow-[3px_4px_0_rgba(0,0,0,.2)] transition-transform hover:-translate-y-0.5"
            >
              Save &amp; find projects <ArrowRight className="size-4" />
            </Link>
          </section>

          <aside className="rounded-[3px] border border-[#b8a47e] bg-[#e8d395] p-6 shadow-[3px_8px_18px_rgba(0,0,0,.38)] sm:p-7">
            <p className="font-mono text-xs text-[#252a25]">GOOD TO KNOW</p>
            <h2 className="mt-6 font-serif text-4xl font-black leading-[1.15] text-[#252a25] sm:text-[44px]">
              Starting from zero is a valid starting point.
            </h2>
            <p className="mt-5 text-base leading-[1.4] text-[#625747]">
              You can update these choices anytime. We&apos;ll recommend projects that stretch you without overwhelming you.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
