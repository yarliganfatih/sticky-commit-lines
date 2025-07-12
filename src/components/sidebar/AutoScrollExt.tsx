import { useState, useRef, useEffect } from "react";
import {
  LuCirclePlay,
  LuCirclePause,
  LuRefreshCcw,
  LuArrowBigRight,
} from "react-icons/lu";

interface AutoScrollExtProps {
  boardRef: any;
  basketRef: any;
}

function AutoScrollExt({ boardRef, basketRef }: AutoScrollExtProps) {
  const stopScrollRef = useRef<(() => void) | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [needsRestart, setNeedsRestart] = useState(false);

  const [totalDelay, setTotalDelay] = useState(2000);
  const [pauseTime, setPauseTime] = useState(1000);
  const [hoverPauseEnabled, setHoverPauseEnabled] = useState(false);

  const [isRotated, setIsRotated] = useState(false);
  const directionRef = useRef<"right" | "left">("right");

  function scrollLoop(
    element: HTMLDivElement,
    totalDelay: number,
    stepUnit: number,
    pauseTime: number,
    hoverPauseEnabled: boolean = false,
    onDirectionChange?: (direction: "right" | "left") => void
  ): () => void {
    let direction: "right" | "left" = directionRef.current;
    let isPaused = false;
    let isHovering = false;
    let animationFrameId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (isPaused) {
        isPaused = false;
        scrollStep();
      }
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    function scrollStep() {
      if (isHovering && hoverPauseEnabled) {
        isPaused = true;
        return;
      }

      const maxScroll = element.scrollWidth - element.clientWidth;
      const start = element.scrollLeft;
      let nextTarget = start;

      onDirectionChange?.(direction);
      if (direction === "right") {
        nextTarget = Math.ceil(start / stepUnit) * stepUnit;
        if (nextTarget <= start) nextTarget += stepUnit;
        if (nextTarget >= maxScroll) {
          nextTarget = maxScroll;
          direction = "left";
        }
      } else {
        nextTarget = Math.floor(start / stepUnit) * stepUnit;
        if (nextTarget >= start) nextTarget -= stepUnit;
        if (nextTarget <= 0) {
          nextTarget = 0;
          direction = "right";
        }
      }

      const distance = nextTarget - start;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        if (isHovering && hoverPauseEnabled) {
          isPaused = true;
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / totalDelay, 1);
        element.scrollLeft = start + distance * progress;

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          timeoutId = setTimeout(() => {
            scrollStep();
          }, pauseTime);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }

    scrollStep();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }

  const handleStart = () => {
    const basketBoard = basketRef.current;
    if (!basketBoard) return;
    const width = basketBoard.clientWidth;
    const stopFn = scrollLoop(
      boardRef.current,
      totalDelay,
      width,
      pauseTime,
      hoverPauseEnabled,
      (dir) => {
        directionRef.current = dir;
        setIsRotated(dir === "left");
      }
    );
    stopScrollRef.current = stopFn;
    setIsScrolling(true);
    setNeedsRestart(false);
  };

  const handleStop = () => {
    if (stopScrollRef.current) {
      stopScrollRef.current();
      stopScrollRef.current = null;
    }
    setIsScrolling(false);
  };

  const handleToggle = () => {
    if (isScrolling && !needsRestart) {
      handleStop();
    } else {
      handleStop();
      handleStart();
    }
  };

  useEffect(() => {
    if (isScrolling) {
      setNeedsRestart(true);
    }
  }, [totalDelay, pauseTime, hoverPauseEnabled]);

  return (
    <div className="flex flex-col w-56 h-screen text-white bg-zinc-800 border-r border-zinc-700">
      <div className="flex items-center h-10 px-4 border-b border-zinc-700">
        <h1 className="text-sm font-semibold text-zinc-300">
          🧭 Auto Scroll Panel
        </h1>
      </div>

      <div className="flex flex-col gap-3 px-4 py-4 text-sm">
        <div className="flex flex-col gap-1">
          <label className="text-zinc-400">Total Delay (ms)</label>
          <input
            type="number"
            className="bg-zinc-700 text-white px-2 py-1 rounded text-sm"
            value={totalDelay}
            step="100"
            onChange={(e) => setTotalDelay(Number(e.target.value))}
            min={100}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-zinc-400">Pause Time (ms)</label>
          <input
            type="number"
            className="bg-zinc-700 text-white px-2 py-1 rounded text-sm"
            value={pauseTime}
            step="100"
            onChange={(e) => setPauseTime(Number(e.target.value))}
            min={100}
          />
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-300">
          <button
            onClick={() => setHoverPauseEnabled((prev) => !prev)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 ${
              hoverPauseEnabled ? "bg-green-500" : "bg-zinc-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                hoverPauseEnabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
          <span>Stop on hover</span>
        </div>

        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${
              needsRestart
                ? "bg-blue-600 hover:bg-blue-500"
                : isScrolling
                ? "bg-red-600 hover:bg-red-500"
                : "bg-green-600 hover:bg-green-500"
            }
          `}
        >
          {needsRestart ? (
            <>
              <LuRefreshCcw size={16} />
              Restart Scroll
            </>
          ) : isScrolling ? (
            <>
              <LuCirclePause size={16} />
              Stop Scroll
            </>
          ) : (
            <>
              <LuCirclePlay size={16} />
              Start Scroll
            </>
          )}
        </button>

        <div className="text-xs text-zinc-400 mt-2">
          Status:{" "}
          <span
            className={`${
              needsRestart
                ? "text-blue-400"
                : isScrolling
                ? "text-green-400"
                : "text-zinc-400"
            }`}
          >
            {needsRestart
              ? "Settings changed – restart required"
              : isScrolling
              ? "Running"
              : "Stopped"}
          </span>
        </div>
        {isScrolling && (
          <div className="mt-1 items-center text-xs text-zinc-400">
            <div>Direction:</div>
            <div
              className="mt-2 transition-transform duration-700 ease-in-out"
              style={{
                transform: `rotate(${isRotated ? 180 : 360}deg)`,
              }}
            >
              <LuArrowBigRight size={32} className="text-green-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutoScrollExt;
