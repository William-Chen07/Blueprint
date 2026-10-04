"use client";

import { useState } from "react";
import type { ProjectTask } from "@/lib/github";

export default function ProjectTaskBoard({ tasks }: { tasks: ProjectTask[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const progress = Math.round((completed.length / tasks.length) * 100);

  function toggleTask(title: string) {
    setCompleted((current) =>
      current.includes(title)
        ? current.filter((task) => task !== title)
        : [...current, title],
    );
  }

  return (
    <div className="bg-[#f3eee2] p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#214dce]">
            TASK DASHBOARD
          </p>
          <h2 className="mt-2 font-serif text-3xl italic">Make progress one task at a time.</h2>
        </div>
        <p className="font-mono text-sm text-[#214dce]">{progress}% complete</p>
      </div>
      <div className="mt-5 h-2 bg-[#d8d4c7]">
        <div className="h-full bg-[#214dce] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-6 grid gap-3">
        {tasks.map((task) => {
          const isComplete = completed.includes(task.title);
          return (
            <label
              key={task.title}
              className={`flex cursor-pointer gap-3 border bg-[#fffdf5] p-4 transition-colors ${
                isComplete ? "border-[#214dce] opacity-70" : "border-[#d8d4c7]"
              }`}
            >
              <input
                type="checkbox"
                checked={isComplete}
                onChange={() => toggleTask(task.title)}
                className="mt-1 size-4 accent-[#214dce]"
              />
              <span className="min-w-0 flex-1">
                <span className={`block text-sm ${isComplete ? "line-through" : ""}`}>{task.title}</span>
                <span className="mt-1 block font-mono text-[10px] text-[#6d6a60]">
                  {task.skill} · {task.milestone}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
