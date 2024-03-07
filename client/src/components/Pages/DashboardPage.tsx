import { NavLink, Outlet } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

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
      <div className="flex flex-col items-center mt-4 pb-4 m-4 w-fit m-auto">
        <p className="mb-4 font-medium text-lg">Панель управления</p>
        <Menubar className="h-fit">
          {dashboardMenu.map((menuItem: DashboardMenu, index) => (
            <MenubarMenu key={index}>
              <MenubarTrigger>{menuItem.category}</MenubarTrigger>
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
        </Menubar>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardPage;
