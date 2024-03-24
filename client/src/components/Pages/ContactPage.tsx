import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <Helmet>
        <title>Контакты | {import.meta.env.VITE_MAIN_TITLE}</title>
        <meta
          name="description"
          content="Контактные данные для связи по вопросам заказов и доставки."
        />
      </Helmet>
      <div className="mt-8 max-w-lg space-y-2 text-lg">
        <p>По вопросам связанным с заказом можно связаться по номеру:</p>
        <div>Тел.: {import.meta.env.VITE_CONTACT}</div>
      </div>
    </div>
  );
};

export default ContactPage;
