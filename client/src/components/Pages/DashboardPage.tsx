import { nanoid } from "nanoid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/shadcn/accordion";
import { Card } from "@/components/UI/shadcn/card";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
    <>
      <Helmet>
        <title>Панель управления | {import.meta.env.VITE_MAIN_TITLE}</title>
        <meta
          name="description"
          content="Панель управления сайтом (доступ запрещен для рядовых пользователей)."
        />
      </Helmet>
      <div className="m-4">
        {isMenuPage ? (
          <Card className="mx-auto max-w-lg p-4">
            <p className="mb-4 text-center text-lg font-medium">
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
          <div className="mx-auto max-w-lg translate-x-off-screen-right transform animate-slide-in">
            <Outlet />
          </div>
        )}
      </div>
    </>
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
