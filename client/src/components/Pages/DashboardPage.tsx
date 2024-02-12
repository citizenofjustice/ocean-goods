import { NavLink, Outlet } from "react-router-dom";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col items-center mx-2 vsm:mx-4">
        <p className="mb-4 font-medium text-lg">Панель управления</p>
        <nav
          id="dashboard-nav"
          className="grid grid-cols-none vsm:grid-cols-2 sm:grid-flow-col sm:auto-cols-max gap-4 mb-4"
        >
          <NavLink
            className="border border-2 border-background-500 rounded-lg p-2 text-center"
            to="product-types"
          >
            Типы продуктов
          </NavLink>
          <NavLink
            className="border border-2 border-background-500 rounded-lg p-2 text-center"
            to="roles"
          >
            Роли
          </NavLink>
          <NavLink
            className="border border-2 border-background-500 rounded-lg p-2 text-center"
            to="priveleges"
          >
            Привелегии
          </NavLink>
          <NavLink
            className="border border-2 border-background-500 rounded-lg p-2 text-center"
            to="register-user"
          >
            Создание пользователя
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardPage;
