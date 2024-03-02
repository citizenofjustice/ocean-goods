import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="font-bold text-xl">Нет доступа</p>
        <br />
        <p>Пользователю с вашими правами не доступна данная страница</p>
        <br />
        <Button onClick={goBack}>Вернуться назад</Button>
      </div>
    </>
  );
};

export default Unauthorized;
