import { useState } from "react";
import LabeledInputField from "./ui/LabeledInputField";
import FormCard from "./ui/FormCard";
import { CustomerDataInputs } from "../types/form-types";
import { useStore } from "../store/root-store-context";
import { observer } from "mobx-react-lite";
import axios from "../api/axios";
import { ButtonLoading } from "./ui/ButtonLoading";
import { Button } from "./ui/button";

const emptyInitValues: CustomerDataInputs = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  contactMethod: "",
};

const CustomerDataForm: React.FC<{
  onOrderSend: () => void;
}> = observer(({ onOrderSend }) => {
  const [inputValues, setInputValues] =
    useState<CustomerDataInputs>(emptyInitValues);
  const { cart } = useStore();
  const { cartItems } = cart;
  const [isPending, setIsPending] = useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const fData = new FormData(event.currentTarget);
    const orderItems = cartItems.map((item) => {
      const orderItem = {
        productId: item.productId,
        amount: item.amount,
      };
      return orderItem;
    });
    fData.append("orderItems", JSON.stringify(orderItems));
    const response = await axios.post(`/orders`, fData, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 201) {
      setInputValues(emptyInitValues);
      cart.clearCart();
      onOrderSend();
    } else console.log(response);
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        Чтобы завершить оформление введите контактные данные:
      </div>
      <FormCard>
        <form onSubmit={handleOrder} className="flex flex-col gap-4">
          <LabeledInputField
            inputId="customer-name"
            title="Имя"
            name="customerName"
            inputType="text"
            value={inputValues.customerName}
            onInputChange={handleValueChange}
          />
          <LabeledInputField
            inputId="customer-phone"
            title="Телефон"
            name="customerPhone"
            inputType="text"
            value={inputValues.customerPhone}
            onInputChange={handleValueChange}
          />
          <LabeledInputField
            inputId="customer-email"
            title="Эл. почта"
            name="customerEmail"
            inputType="email"
            value={inputValues.customerEmail}
            onInputChange={handleValueChange}
          />
          <LabeledInputField
            inputId="customer-contact-method"
            title="Предпочитаемый способ связи"
            name="contactMethod"
            inputType="text"
            value={inputValues.contactMethod}
            onInputChange={handleValueChange}
          />
          {isPending ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Заказать</Button>
          )}
        </form>
      </FormCard>
    </div>
  );
});

export default CustomerDataForm;
