"use client";

import { createContext, type CSSProperties, type ReactNode, useContext, useState, useSyncExternalStore } from "react";
import { Lightbulb, Moon } from "lucide-react";

interface FlashlightBoardProps {
  children: ReactNode;
}

interface FlashlightStyle extends CSSProperties {
  "--flashlight-x": string;
  "--flashlight-y": string;
}

type LightingMode = "lamp" | "flashlight";
const LightingContext = createContext<LightingMode>("lamp");

function getSavedLightingMode(): LightingMode {
  if (typeof window !== "undefined") {
    const savedMode = window.localStorage.getItem("buildfolio-lighting");
    if (savedMode === "lamp" || savedMode === "flashlight") {
      return savedMode;
    }
  }
  return "lamp";
}

function subscribeToLightingMode(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function FlashlightBoard({ children }: FlashlightBoardProps) {
  const [position, setPosition] = useState({ x: "50%", y: "30%" });
  const mode = useSyncExternalStore(
    subscribeToLightingMode,
    getSavedLightingMode,
    () => "lamp",
  );

  return (
    <div
      className={`flashlight-board wood-texture relative min-h-screen overflow-hidden lighting-${mode}`}
      style={
        {
          "--flashlight-x": position.x,
          "--flashlight-y": position.y,
        } as FlashlightStyle
      }
      onPointerMove={(event) => {
        setPosition({
          x: `${event.clientX}px`,
          y: `${event.clientY}px`,
        });
      }}
    >
      <LightingContext.Provider value={mode}>{children}</LightingContext.Provider>
      <div className={`lighting-overlay overlay-${mode}`} aria-hidden="true" />
    </div>
  );
}

export function LightingControls() {
  const mode = useContext(LightingContext);

  function changeMode(nextMode: LightingMode) {
    window.localStorage.setItem("buildfolio-lighting", nextMode);
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="lighting-controls" role="group" aria-label="Lighting mode">
      <button type="button" onClick={() => changeMode("lamp")} className={mode === "lamp" ? "active" : ""} aria-pressed={mode === "lamp"}>
        <Lightbulb className="size-3.5" /> Lamp
      </button>
      <button type="button" onClick={() => changeMode("flashlight")} className={mode === "flashlight" ? "active" : ""} aria-pressed={mode === "flashlight"}>
        <Moon className="size-3.5" /> Flashlight
      </button>
    </div>
  );
}
