import { Link } from "react-router-dom";
import { Button } from "@/components/UI/shadcn/button";

const NotFoundPage = () => {
  return (
    <div className="flex h-[65vh] flex-col items-center justify-center gap-4 px-6">
      <div className="space-y-2 text-center">
        <p className="text-3xl">ОШИБКА 404</p>
        <p>Страница, которую вы ищете, не существует</p>
      </div>
      <Button variant="outline" aria-label="Вернуться на главную">
        <Link to="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
