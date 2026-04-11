import React, { useEffect, useState } from "react";
import { Sun } from "lucide-react";

const SunCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
      style={{ left: pos.x, top: pos.y }}
    >
      <Sun
        size={28}
        /* Changed to a darker amber color #D97706 */
        className={`text-[#D97706] animate-spin-slow transition-all duration-150 ${
          isClicked
            ? "animate-blink scale-75 opacity-70"
            : "scale-100 opacity-100"
        }`}
        fill="#D97706"
        fillOpacity={0.3}
      />

      {/* Optional: Add a subtle dark glow for better visibility */}
      {isClicked && (
        <div className="absolute inset-0 bg-amber-900/20 blur-xl rounded-full -z-10" />
      )}
    </div>
  );
};

export default SunCursor;
