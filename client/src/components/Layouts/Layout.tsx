import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="my-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
