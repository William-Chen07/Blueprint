"use client";

import { type CSSProperties, type ReactNode, useState } from "react";

interface FlashlightBoardProps {
  children: ReactNode;
}

interface FlashlightStyle extends CSSProperties {
  "--flashlight-x": string;
  "--flashlight-y": string;
}

export default function FlashlightBoard({ children }: FlashlightBoardProps) {
  const [position, setPosition] = useState({ x: "50%", y: "30%" });

  return (
    <div
      className="flashlight-board relative min-h-screen overflow-hidden"
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
      {children}
      <div className="flashlight-overlay" aria-hidden="true" />
    </div>
  );
}
