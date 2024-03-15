import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";

import { MenuItem } from "@/types/MenuItem";

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
}> = observer(({ menuItems, onMenuClose, isDesktop = false }) => {
  return (
    <ul id="nav-menu" className={`flex ${isDesktop ? "flex-row" : "flex-col"}`}>
      {menuItems.map((item) => (
        <div key={item.id}>
          <li onClick={onMenuClose} className={isDesktop ? "mx-4" : "m-4"}>
            <NavLink
              to={item.path}
              className="flex flex-row items-center text-primary-800"
            >
              <p className="mr-2">{item.title}</p>
              {item.icon}
            </NavLink>
          </li>
        </div>
      ))}
    </ul>
  );
});

export default MenuList;
