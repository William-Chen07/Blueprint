"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const interests = ["Web development", "Data science", "Design", "AI", "Cybersecurity", "Game development"];
const skills = ["Python", "HTML + CSS", "Figma"];
const experienceOptions = [
  { value: "starting", label: "Just starting" },
  { value: "building", label: "Built a few things" },
  { value: "experienced", label: "Experienced" },
];

export default function ProfilePage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("starting");
  const [hours, setHours] = useState(4);

  function toggle(item: string, setter: (items: string[]) => void, current: string[]) {
    setter(current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  return (
    <main className="wood-texture min-h-screen px-4 py-8 text-[#25221c] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl pb-12">
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#c5b890]">
            STEP 01 OF 02 · MAKE IT YOURS
          </p>
          <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[.95] text-[#eadcb9] sm:text-7xl">
            What would you like to build?
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-relaxed text-[#b9a77e]">
            Tell us where you&apos;re starting. Your recommendations and task explanations will adapt to you.
          </p>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.45fr_.8fr] lg:items-start">
            <section className="bg-[#eadfbd] p-5 shadow-[7px_9px_0_rgba(0,0,0,.38)] sm:p-6">
              <fieldset>
                <legend className="font-sans text-xl font-bold">1. Pick your interests</legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {interests.map((interest) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggle(interest, setSelectedInterests, selectedInterests)}
                        className={`rounded-md px-4 py-2 font-mono text-[10px] transition-colors ${
                          active ? "bg-[#76301e] text-[#fff4d6]" : "bg-[#d5c8a3] hover:bg-[#c6b78d]"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="font-sans text-xl font-bold">2. Your experience</legend>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  {experienceOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="experience"
                        value={option.value}
                        checked={experience === option.value}
                        onChange={() => setExperience(option.value)}
                        className="accent-[#25221c]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[#6b604b]">
                  {experience === "starting"
                    ? "New to tech? We’ll include setup steps and explain the vocabulary."
                    : experience === "building"
                      ? "You’ve got the basics. We’ll add useful stretch goals."
                      : "You’re ready for ambitious builds and deeper technical choices."}
                </p>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="font-sans text-xl font-bold">3. Skills you already have</legend>
                <div className="mt-4 flex flex-wrap gap-3">
                  {skills.map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggle(skill, setSelectedSkills, selectedSkills)}
                        className={`rounded-md px-4 py-2 font-mono text-[10px] ${
                          active ? "bg-[#76301e] text-[#fff4d6]" : "bg-[#d5c8a3] hover:bg-[#c6b78d]"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
                <label className="mt-4 block text-sm text-[#6b604b]">
                  <span className="sr-only">Add a skill or tool</span>
                  <input
                    type="text"
                    placeholder="Add a language or tool..."
                    className="w-full border-b border-[#9e906e] bg-transparent py-2 outline-none placeholder:text-[#756a54] focus:border-[#76301e]"
                  />
                </label>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="font-sans text-xl font-bold">4. Time you can set aside</legend>
                <div className="mt-4 flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={hours}
                    onChange={(event) => setHours(Number(event.target.value))}
                    className="w-full accent-[#76301e]"
                  />
                  <output className="w-24 font-mono text-xs">{hours} hours / week</output>
                </div>
                <p className="mt-3 text-sm text-[#6b604b]">
                  Suggested pace: {hours <= 3 ? "gentle" : hours <= 7 ? "relaxed" : "focused"}
                </p>
              </fieldset>

              <Link
                href="/projects"
                className="mt-7 inline-flex items-center gap-2 bg-[#76301e] px-5 py-3 text-sm text-[#fff4d6] shadow-[3px_4px_0_rgba(0,0,0,.2)] transition-transform hover:-translate-y-0.5"
              >
                Save &amp; find projects <ArrowRight className="size-4" />
              </Link>
            </section>

            <aside className="rotate-1 bg-[#e0c77e] p-6 shadow-[7px_9px_0_rgba(0,0,0,.38)] sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#554b32]">GOOD TO KNOW</p>
              <h2 className="mt-7 font-serif text-4xl leading-[.98] sm:text-5xl">
                Starting from zero is a valid starting point.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-[#665a3e]">
                You can update these choices anytime. We&apos;ll recommend projects that stretch you without overwhelming you.
              </p>
            </aside>
          </div>
        </div>
    </main>
  );
}
