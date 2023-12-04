import { Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { menuItem } from "./Navbar";

/**
 * Component for rendering menu list
 * @param menuItems - array of menuItem objects
 * @param onMenuClose - callback to menu closing function
 * @returns
 */
const MenuList: React.FC<{
  menuItems: menuItem[];
  onMenuClose: () => void;
}> = ({ menuItems, onMenuClose }) => {
  const handleMenuClose = () => {
    onMenuClose();
  };

  return (
    <ul className="flex flex-col">
      <li
        onClick={handleMenuClose}
        className="flex ml-4 mt-4 mb-4 hover:cursor-pointer"
      >
        <XMarkIcon className="w-6 h-6" />
      </li>
      {menuItems.map((item: menuItem, index: number) => (
        <li key={index} onClick={handleMenuClose} className="m-4">
          <Link to={item.path} className="flex flex-row items-center">
            <p className="mr-2">{item.title}</p>
            {item.icon}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuList;
