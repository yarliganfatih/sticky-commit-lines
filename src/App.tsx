import { useEffect, useRef, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import LineBoard from "./components/LineBoard";
import { LuGitCommitVertical } from "react-icons/lu";

const App: React.FC = () => {
  const [navOpen, setNavOpen] = useState(true);

  const BASE_URL = import.meta.env.BASE_URL;
  const [selectedFile, setSelectedFile] = useState<string>(
    window.location.pathname.replace(BASE_URL, "") ?? ""
  );
  const handleCurrentFileSideBar = (path: string) => {
    setSelectedFile(path);
    window.history.pushState({}, "", BASE_URL + path);
  };
  useEffect(() => {
    window.addEventListener("popstate", () => {
      const currentFile = window.location.pathname.replace(BASE_URL, "") ?? "";
      setSelectedFile(currentFile);
    });
  }, []);

  const boardRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!boardRef.current || !basketRef.current) return;

      const boardW = basketRef.current.offsetWidth;
      const isScrollingDown = Math.sign(event.deltaY);

      if (isScrollingDown !== 0) {
        boardRef.current.scrollLeft += event.deltaY > 0 ? boardW : -boardW;
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className={"App h-screen " + (navOpen ? "" : "closedNav")}>
      <div className="nav flex flex-row bg-zinc-900 w-screen h-screen fixed">
        <Sidebar
          navOpen={navOpen}
          setNavOpen={setNavOpen}
          selectedFile={selectedFile}
          handleFileSelect={handleCurrentFileSideBar}
          boardRef={boardRef}
          basketRef={basketRef}
        />
      </div>
      <div className="lineBasket" ref={basketRef}>
        <div className="w-6 h-screen text-right">
          <LuGitCommitVertical className="commitIcon ml-3 text-lg" />
          {Array.from({ length: 98 }, (_, i) => i + 1).map((num) => (
            <div className="h-4" key={"lineNum" + num}>
              {num}
            </div>
          ))}
        </div>
      </div>
      <LineBoard selectedFile={selectedFile} boardRef={boardRef}></LineBoard>
    </div>
  );
};

export default App;
