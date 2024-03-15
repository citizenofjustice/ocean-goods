import { Link } from "react-router-dom";
import { Button } from "@/components/UI/shadcn/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-[65vh] px-6">
      <div className="text-center space-y-2">
        <p className="text-3xl">ОШИБКА 404</p>
        <p>Страница, которую вы ищете, не существует</p>
      </div>
      <Button variant="outline">
        <Link to="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
