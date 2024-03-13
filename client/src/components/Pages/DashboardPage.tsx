import { NavLink, Outlet } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../UI/navigation-menu";

interface NavButton {
  path: string;
  name: string;
}

interface DashboardMenu {
  category: string;
  subCategory: NavButton[];
}

const dashboardMenu: DashboardMenu[] = [
  {
    category: "Тип продуктов",
    subCategory: [{ path: "/dashboard/product-types", name: "Типы продуктов" }],
  },
  {
    category: "Полномочия пользователей",
    subCategory: [
      { path: "/dashboard/roles", name: "Роли" },
      { path: "/dashboard/priveleges", name: "Привелегии" },
    ],
  },
  {
    category: "Учетные записи",
    subCategory: [
      { path: "/dashboard/register-user", name: "Создание пользователя" },
    ],
  },
];

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col items-center mt-4 pb-4 m-4 max-w-lg m-auto">
        <div className="mx-4">
          <p className="mb-4 font-medium text-lg text-center">
            Панель управления
          </p>
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col">
              {dashboardMenu.map((menuItem: DashboardMenu, index) => (
                <NavigationMenuItem key={`menu-item-${index}`}>
                  <NavigationMenuTrigger>
                    {menuItem.category}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-col p-2 space-y-2">
                    {menuItem.subCategory.map(
                      (subNavButton: NavButton, subIndex) => (
                        <NavLink
                          className="w-full"
                          key={`menu-item-${index}-${subIndex}`}
                          to={subNavButton.path}
                        >
                          {subNavButton.name}
                        </NavLink>
                      )
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {/* <Menubar className="h-fit flex flex-col">
            {dashboardMenu.map((menuItem: DashboardMenu, index) => (
              <MenubarMenu key={index}>
                <MenubarTrigger className="w-fit translate-y-[50]">
                  {menuItem.category}
                </MenubarTrigger>
                <MenubarContent>
                  {menuItem.subCategory.map(
                    (subNavButton: NavButton, subIndex) => (
                      <MenubarItem key={subIndex}>
                        <NavLink className="w-full" to={subNavButton.path}>
                          {subNavButton.name}
                        </NavLink>
                      </MenubarItem>
                    )
                  )}
                </MenubarContent>
              </MenubarMenu>
            ))}
          </Menubar> */}
          {}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
