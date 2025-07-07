import SIDE_BAR_ICONS from "../utils/SideBarIcons";

interface SidebarItemProps {
  i: number;
  currentColor: string;
  onClick: any;
}

function SidebarItem({ i, currentColor, onClick }: SidebarItemProps) {
  const setBorder = () => {
    return currentColor === "#FFFFFF"
      ? "border-l border-l-white border-r border-r-transparent"
      : "border-l border-l-transparent border-r border-r-transparent";
  };

  return (
    <div className={setBorder()}>
      <a
        href="#"
        className="sidebar-icon group"
        onClick={() => {
          let selected_child = [0, 0, 0, 0, 0];
          selected_child[i] = 1;
          onClick(selected_child, i);
        }}
      >
        <svg
          className="sidebar-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {SIDE_BAR_ICONS[i]}
        </svg>
      </a>
    </div>
  );
}

export default SidebarItem;
