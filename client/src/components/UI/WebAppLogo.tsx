import { Link } from "react-router-dom";
import Logo from "@/assets/images/Logo.svg";

const WebAppLogo = () => {
  return (
    <Link to="/">
      <div className="logo-filter h-16 w-20">
        <img
          src={Logo}
          className="h-fit w-fit"
          alt="website logo Ocean Goods"
        />
      </div>
    </Link>
  );
};

export default WebAppLogo;
