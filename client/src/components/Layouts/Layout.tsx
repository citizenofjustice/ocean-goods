import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="content-scroll main-abs mx-1 my-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
