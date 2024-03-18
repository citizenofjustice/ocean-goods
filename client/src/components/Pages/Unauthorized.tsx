import { useNavigate } from "react-router-dom";
import { Button } from "@/components/UI/shadcn/button";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <div className="flex h-[60vh] flex-col items-center justify-center px-6">
        <p className="text-xl font-bold">Нет доступа</p>
        <br />
        <p className="text-center">
          Пользователю с вашими правами не доступна данная страница
        </p>
        <br />
        <Button onClick={goBack} aria-label="Вернуться на прошлую страницу">
          Вернуться назад
        </Button>
      </div>
    </>
  );
};

export default Unauthorized;
