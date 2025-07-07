import { useState, useRef } from "react";
import { LuCirclePlay, LuCirclePause } from "react-icons/lu";

interface AutoScrollExtProps {
  boardRef: any;
  basketRef: any;
}

function AutoScrollExt({ boardRef, basketRef }: AutoScrollExtProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const stopScrollRef = useRef<(() => void) | null>(null);

  function scrollLoop(
    element: HTMLDivElement,
    totalDelay = 5000,
    stopDistance = 600,
    pauseTime = 2000
  ): () => void {
    let direction: "right" | "left" = "right";
    let animationFrameId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    const scroll = () => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      let start = element.scrollLeft;
      let end = direction === "right" ? maxScroll : 0;
      let totalDistance = Math.abs(end - start);
      let currentTarget = start;

      const animate = () => {
        if (start === end) {
          direction = direction === "right" ? "left" : "right";
          scroll();
          return;
        }

        const nextStop =
          direction === "right"
            ? Math.min(currentTarget + stopDistance, end)
            : Math.max(currentTarget - stopDistance, end);

        const stepDistance = Math.abs(nextStop - start);
        const stepDuration = totalDelay * (stepDistance / totalDistance);
        const stepStartTime = performance.now();

        const step = (currentTime: number) => {
          const elapsed = currentTime - stepStartTime;
          const progress = Math.min(elapsed / stepDuration, 1);
          const position = start + (nextStop - start) * progress;
          element.scrollLeft = position;

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(step);
          } else {
            timeoutId = setTimeout(() => {
              start = nextStop;
              currentTarget = nextStop;
              animate();
            }, pauseTime);
          }
        };

        animationFrameId = requestAnimationFrame(step);
      };

      animate();
    };

    scroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }

  const handleToggle = () => {
    const basketBoard = basketRef.current;

    if (isScrolling) {
      if (stopScrollRef.current) {
        stopScrollRef.current();
        stopScrollRef.current = null;
      }
      setIsScrolling(false);
    } else {
      const linew = basketBoard ? basketBoard.clientWidth : 600;
      const stopFn = scrollLoop(boardRef.current, 5000, linew, 2000);
      stopScrollRef.current = stopFn;
      setIsScrolling(true);
    }
  };

  return (
    <div className="flex flex-col w-56 h-screen text-white bg-zinc-800">
      <div className="flex items-center h-10 px-4 border-b border-zinc-700">
        <h1 className="text-sm font-semibold text-zinc-300">
          🧭 Auto Scroll Panel
        </h1>
      </div>

      <div className="flex flex-col items-start px-4 py-4 gap-3">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            ${
              isScrolling
                ? "bg-red-600 hover:bg-red-500"
                : "bg-green-600 hover:bg-green-500"
            }
          `}
        >
          {isScrolling ? (
            <LuCirclePause size={16} />
          ) : (
            <LuCirclePlay size={16} />
          )}
          {isScrolling ? "Stop Auto Scroll" : "Start Auto Scroll"}
        </button>

        <div className="text-xs text-zinc-400">
          Status:{" "}
          <span className={isScrolling ? "text-green-400" : "text-zinc-400"}>
            {isScrolling ? "Running" : "Stopped"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AutoScrollExt;
