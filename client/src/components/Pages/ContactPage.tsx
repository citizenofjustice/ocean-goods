import { getUserData } from "../../api";

const ContactPage = () => {
  const a = getUserData(1);
  console.log(a);

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <p>Связаться по вопросам заказа можно по номеру:</p>
      <div>Тел. 8-999-555-35-35</div>
    </div>
  );
};

export default ContactPage;
