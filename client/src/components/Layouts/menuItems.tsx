// MenuItems.js
import { nanoid } from "nanoid";
import { BookOpenText, PhoneIncoming } from "lucide-react";

export const menuItems = [
  {
    id: nanoid(),
    title: "Каталог",
    path: "/",
    icon: <BookOpenText className="h-5 w-5" />,
  },
  {
    id: nanoid(),
    title: "Контакты",
    path: "/contact",
    icon: <PhoneIncoming className="h-5 w-5" />,
  },
];
