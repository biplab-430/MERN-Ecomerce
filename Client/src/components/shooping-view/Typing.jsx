import React, { useEffect, useState } from "react";

function Typing({ text = "", speed = 50 }) { // default empty string
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return; // safeguard

    setDisplayedText(""); // reset on text change
    let index = 0;

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        return;
      }
      setDisplayedText((prev) => prev + text[index]);
      index++;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="text-white">
      {displayedText}
      <span className="animate-pulse">|</span> {/* blinking cursor */}
    </div>
  );
}

export default Typing;
