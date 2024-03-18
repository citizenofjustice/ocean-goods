import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <Helmet>
        <title>Контакты</title>
        <meta
          name="description"
          content="Контактные данные для связи по вопросам заказов и доставки."
        />
      </Helmet>
      <p>Связаться по вопросам заказа можно по номеру:</p>
      <div>Тел. 8-999-555-35-35</div>
    </div>
  );
};

export default ContactPage;
