import { useState } from "react";
import SidebarItem from "./SidebarItem";
import Explorer from "./sidebar/Explorer";
import Search from "./sidebar/Search";
import Git from "./sidebar/Git";
import Extensions from "./sidebar/Extensions";
import AutoScrollExt from "./sidebar/AutoScrollExt";
import Settings from "./sidebar/Settings";

const WHITE = "#FFFFFF";
const CURRENTCOLOR = "currentColor";

interface SidebarProps {
  navOpen: boolean;
  setNavOpen: Function;
  selectedFile: string;
  handleFileSelect: any;
  boardRef: any;
  basketRef: any;
}

function Sidebar({
  navOpen,
  setNavOpen,
  selectedFile,
  handleFileSelect,
  boardRef,
  basketRef,
}: SidebarProps) {
  const [selected_parent, setSelected] = useState([1, 0, 0, 0, 0]);
  const elements = [0, 1, 2, 3, 4];

  const handleClickSidebarItem = (selected: number[], i: number) => {
    if (!navOpen) {
      setNavOpen(true);
    } else if (navOpen && selected[i] === selected_parent[i]) {
      setNavOpen(false);
      setSelected([0, 0, 0, 0, 0]);
      return;
    } else if (navOpen && selected[i] !== selected_parent[i]) {
      setNavOpen(true);
    }
    setSelected(selected);
  };

  return (
    <div className="flex flex-row">
      <div className="w-12 h-screen flex flex-col justify-between bg-zinc-700">
        <div className="">
          {elements.map((i) => {
            if (selected_parent[i] === 1)
              return (
                <SidebarItem
                  key={i}
                  i={i}
                  onClick={handleClickSidebarItem}
                  currentColor={WHITE}
                />
              );

            return (
              <SidebarItem
                key={i}
                i={i}
                onClick={handleClickSidebarItem}
                currentColor={CURRENTCOLOR}
              />
            );
          })}
        </div>
        <div className="">
          <SidebarItem
            key={5}
            onClick={handleClickSidebarItem}
            i={5}
            currentColor={CURRENTCOLOR}
          />
        </div>
      </div>
      <div className={navOpen ? "w-56" : "w-0 bg-zinc-800"}>
        {(selected_parent.indexOf(1) === 0 && (
          <Explorer
            selectedFile={selectedFile}
            handleFileSelect={handleFileSelect}
          />
        )) ||
          (selected_parent.indexOf(1) === 1 && <Search />) ||
          (selected_parent.indexOf(1) === 2 && <Git />) ||
          (selected_parent.indexOf(1) === 3 && <Extensions />) ||
          (selected_parent.indexOf(1) === 4 && <AutoScrollExt boardRef={boardRef} basketRef={basketRef} />) ||
          (selected_parent.indexOf(1) === 5 && <Settings />)}
      </div>
    </div>
  );
}

export default Sidebar;
