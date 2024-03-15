import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/shadcn/select";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { Input } from "@/components/UI/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/UI/shadcn/button";

import axios from "@/api/axios";
import { useStore } from "@/store/root-store-context";
import { ButtonLoading } from "@/components/UI/ButtonLoading";
import ConfirmActionAlert from "@/components/UI/ConfirmActionAlert";

import telegramIcon from "@/assets/images/telegram.svg";
import whatsAppIcon from "@/assets/images/whatsapp.svg";
import viberIcon from "@/assets/images/viber.svg";
import phoneIcon from "@/assets/images/phonecall.svg";

interface ContactOption {
  value: string;
  content: React.ReactNode;
}

const contactOptions: ContactOption[] = [
  {
    value: "telegram",
    content: (
      <span className="flex gap-2">
        <img className="w-6 h-6" src={telegramIcon} /> Телегарам
      </span>
    ),
  },
  {
    value: "whatsppp",
    content: (
      <span className="flex gap-2">
        <img className="w-6 h-6" src={whatsAppIcon} /> WhatsApp
      </span>
    ),
  },
  {
    value: "viber",
    content: (
      <span className="flex gap-2">
        <img className="w-6 h-6" src={viberIcon} /> Viber
      </span>
    ),
  },
  {
    value: "phone",
    content: (
      <span className="flex gap-2">
        <img className="w-6 h-6" src={phoneIcon} /> Звонок по телефону
      </span>
    ),
  },
];

const CartCustomerDataForm: React.FC<{
  onOrderSend: () => void;
  onPreviousPage: () => void;
}> = observer(({ onOrderSend, onPreviousPage }) => {
  const { cart, alert } = useStore();
  const { cartItems } = cart;
  const [isPending, setIsPending] = useState(false);

  const zodCustomerForm = z.object({
    customerName: z
      .string()
      .min(2, { message: "Введенное имя не может быть короче 2 символов" }),
    customerPhone: z
      .string()
      .min(6, { message: "Номер телефона слишком короткий" }),
    customerEmail: z.string().optional(),
    contactMethod: z.string(),
  });

  const form = useForm<z.infer<typeof zodCustomerForm>>({
    resolver: zodResolver(zodCustomerForm),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      contactMethod: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof zodCustomerForm>) => {
    try {
      setIsPending(true);
      const fData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        fData.append(key, value);
      }
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
        form.reset();
        cart.clearCart();
        onOrderSend();
      }
      setIsPending(false);
    } catch (error) {
      // display error alert if request failed
      if (error instanceof AxiosError) {
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
      } else
        alert.setPopup({
          message: "При оформлении заказа произошла неизвестная ошибка",
          type: "error",
        });
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        Чтобы завершить оформление введите контактные данные:
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel htmlFor="customerName">Имя заказчика:</FormLabel>
                <FormControl>
                  <Input
                    id="customerName"
                    placeholder="Введите имя"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contactMethod">
                  Предпочитаемый способ связи:
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger id="contactMethod">
                      <SelectValue placeholder="Выберите способ связи" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    {contactOptions.map((item: ContactOption, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.content}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel htmlFor="customerPhone">Телефонный номер:</FormLabel>
                <FormControl>
                  <Input
                    id="customerPhone"
                    placeholder="Введите номер телефона"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel htmlFor="customerEmail">
                  Электронная почта:
                </FormLabel>
                <FormControl>
                  <Input
                    id="customerEmail"
                    placeholder="не обязательное поле"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isPending ? (
            <ButtonLoading />
          ) : (
            <ConfirmActionAlert
              question="Вы уверены что хотите оформить заказ?"
              message="Проверьте указанные контактные данные на правильность."
              onConfirm={form.handleSubmit(onSubmit)}
            >
              <Button type="button">Заказать</Button>
            </ConfirmActionAlert>
          )}
          <Button onClick={onPreviousPage} variant="outline">
            Отмена
          </Button>
        </form>
      </Form>
    </div>
  );
});

export default CartCustomerDataForm;
