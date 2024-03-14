import { Link, Outlet, useLocation } from "react-router-dom";
import { Card } from "../UI/card";
import { nanoid } from "nanoid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../UI/accordion";

interface DashboradSubMenu {
  path: string;
  name: string;
}

interface DashboardMenu {
  id: string;
  category: string;
  subCategory: DashboradSubMenu[];
}

const dashboardMenu: DashboardMenu[] = [
  {
    id: nanoid(),
    category: "Тип продуктов",
    subCategory: [{ path: "/dashboard/product-types", name: "Тип продуктов" }],
  },
  {
    id: nanoid(),
    category: "Полномочия пользователей",
    subCategory: [
      { path: "/dashboard/roles", name: "Роли" },
      { path: "/dashboard/priveleges", name: "Привелегии" },
    ],
  },
  {
    id: nanoid(),
    category: "Учетные записи",
    subCategory: [
      { path: "/dashboard/register-user", name: "Создание пользователя" },
    ],
  },
];

const DashboardPage = () => {
  const location = useLocation();
  const isMenuPage = location.pathname === "/dashboard";

  return (
    <div className="m-4">
      {isMenuPage ? (
        <Card className="p-4 mx-auto max-w-lg">
          <p className="mb-4 font-medium text-lg text-center">
            Панель управления
          </p>
          <Accordion type="single" collapsible>
            {dashboardMenu.map((menuItem: DashboardMenu) => (
              <AccordionItem
                className="last:border-0"
                key={menuItem.id}
                value={menuItem.id}
              >
                <AccordionTrigger className="text-start">
                  {menuItem.category}
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {
                    <DashboardSubMenuPage
                      dashboardSubMenu={menuItem.subCategory}
                    />
                  }
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      ) : (
        <div className="mx-auto max-w-lg transform translate-x-off-screen-right animate-slide-in">
          <Outlet />
        </div>
      )}
    </div>
  );
};

const DashboardSubMenuPage: React.FC<{
  dashboardSubMenu: DashboradSubMenu[];
}> = ({ dashboardSubMenu }) => {
  return (
    <>
      {dashboardSubMenu.map((subMenuItem) => (
        <li className="list-none text-base" key={subMenuItem.path}>
          <Link className="p-2" to={subMenuItem.path}>
            {subMenuItem.name}
          </Link>
        </li>
      ))}
    </>
  );
};

export default DashboardPage;
