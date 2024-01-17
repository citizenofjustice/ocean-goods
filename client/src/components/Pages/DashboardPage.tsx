import { Link, Outlet } from "react-router-dom";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mb-4">Dashboard page</h1>
        <nav className="flex flex-row gap-4 mb-4">
          <Link className="border border-2 rounded-lg p-2" to="product-types">
            Типы продуктов
          </Link>
          <Link className="border border-2 rounded-lg p-2" to="roles">
            Роли
          </Link>
          <Link className="border border-2 rounded-lg p-2" to="priveleges">
            Привелегии
          </Link>
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardPage;
