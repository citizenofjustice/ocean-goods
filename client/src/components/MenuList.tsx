import { NavLink } from "react-router-dom";
import { useLockBodyScroll } from "@uidotdev/usehooks";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { MenuItem } from "../types/MenuItem";

/**
 * Component for rendering menu list
 * @param menuItems - array of menuItem objects
 * @param onMenuClose - optional / callback to menu closing function
 * @param isDesktop - for conditional menu styling
 * @returns
 */
const MenuList: React.FC<{
  menuItems: MenuItem[];
  onMenuClose?: () => void;
  isDesktop?: boolean;
}> = ({ menuItems, onMenuClose, isDesktop = false }) => {
  return (
    <ul id="nav-menu" className={`flex ${isDesktop ? "flex-row" : "flex-col"}`}>
      {/* show only if screen is smaller than desktop */}
      {!isDesktop && (
        <li className="flex py-4">
          <div onClick={onMenuClose} className="basis-1/12 flex justify-start">
            <div className="flex items-center justify-end h-10 w-12 hover:cursor-pointer">
              <CloseMenuIcon />
            </div>
          </div>
        </li>
      )}
      {menuItems.map((item) => (
        <li
          key={item.id}
          onClick={onMenuClose}
          className={isDesktop ? "mx-4" : "m-4"}
        >
          <NavLink to={item.path} className="flex flex-row items-center">
            <p className="mr-2">{item.title}</p>
            {item.icon}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default MenuList;

/**
 * separate component for calling here useLockBodyScroll hook
 * @returns
 */
const CloseMenuIcon = () => {
  useLockBodyScroll(); // disable body scroll
  return <XMarkIcon className="w-6 h-6" />;
};
