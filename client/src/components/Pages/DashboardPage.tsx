import { Link, Outlet } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
const DashboardPage = () => {
  const { refresh } = useRefreshToken();

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mb-4">Панель управления</h1>
        <br />
        <button onClick={() => refresh()}>refresh</button>
        <br />
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
          <Link className="border border-2 rounded-lg p-2" to="register-user">
            Создание пользователя
          </Link>
        </nav>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardPage;
