import { ListBulletIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { MenuItem } from "../../types/MenuItem";
import { nanoid } from "nanoid";
import {
  Cog6ToothIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useOnClickOutside } from "usehooks-ts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/root-store-context";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";

const menuItems: MenuItem[] = [
  {
    id: nanoid(),
    title: "Создать",
    path: "/new-item",
    icon: <PlusIcon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Управление",
    path: "/dashboard",
    icon: <Cog6ToothIcon className="w-6 h-6" />,
  },
  {
    id: nanoid(),
    title: "Заказы",
    path: "/orders",
    icon: <ListBulletIcon className="w-6 h-6" />,
  },
];

const UserDropdownMenu = observer(() => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useOnClickOutside(dropdownRef, () => setIsShown(false));
  const { auth } = useStore();

  useEffect(() => {
    setIsShown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const isLoggedOut = await auth.logoutUser();
    if (isLoggedOut) {
      queryClient.invalidateQueries();
      navigate("/");
    }
  };

  return (
    <>
      <button
        className="flex text-sm bg-primary rounded-full p-2 h-fit"
        type="button"
        onClick={() => setIsShown(true)}
      >
        <span className="sr-only">Открыть меню пользователя</span>
        <UserIcon className="text-secondary h-4 w-4" />
      </button>

      {isShown && (
        <div
          ref={dropdownRef}
          className="absolute top-[2.5rem] left-[-6.5rem] z-10 rounded-lg shadow-lg w-44 bg-primary px-2"
        >
          <div className="divide-y divide-secondary">
            <div className="px-4 py-3 text-sm flex items-center text-secondary">
              <p className="font-medium truncate first-letter:capitalize">
                {auth.authData.user}
              </p>
            </div>
            <ul className="py-2 text-sm text-secondary">
              {menuItems.map((item: MenuItem) => (
                <li className="flex items-center px-4 " key={item.id}>
                  {item.icon}
                  <Link
                    to={item.path}
                    className="block px-2 py-2 hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="py-2 px-4 flex items-center text-secondary hover:text-white">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span
                onClick={handleLogout}
                className="block px-2 py-2 text-sm  hover:cursor-pointer"
              >
                Выйти
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default UserDropdownMenu;
