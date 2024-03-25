import { nanoid } from "nanoid";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { List, LogOut, Plus, Settings, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { MenuItem } from "@/types/MenuItem";
import { useStore } from "@/store/root-store-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./shadcn/dropdown-menu";

const menuItems: MenuItem[] = [
  {
    id: nanoid(),
    title: "Создать",
    path: "/new-item",
    icon: <Plus className="h-5 w-5" />,
  },
  {
    id: nanoid(),
    title: "Управление",
    path: "/dashboard",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    id: nanoid(),
    title: "Заказы",
    path: "/orders",
    icon: <List className="h-5 w-5" />,
  },
];

const UserDropdownMenu = observer(() => {
  const [isShown, setIsShown] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      <DropdownMenu open={isShown} onOpenChange={setIsShown}>
        <DropdownMenuTrigger className="flex h-fit rounded-full bg-primary p-2 text-sm">
          <span className="sr-only">Открыть меню пользователя</span>
          <User className="h-4 w-4 text-secondary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          alignOffset={-30}
          className="top-0 bg-primary text-white"
        >
          <DropdownMenuLabel>
            <p className="truncate font-medium first-letter:capitalize">
              {auth.authData.user}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((item: MenuItem) => (
            <Link key={item.id} to={item.path}>
              <DropdownMenuItem className="gap-2 hover:cursor-pointer">
                {item.icon}
                {item.title}
              </DropdownMenuItem>
            </Link>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            role="button"
            onClick={handleLogout}
            className="gap-2 hover:cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});

export default UserDropdownMenu;
