import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Button } from "./button";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";

export interface BreadcrumbLink {
  to?: string;
  label: string;
}

// const items: BreadcrumbLink[] = [
//   { to: "#", label: "Главная" },
//   { to: "#", label: "Панель управления" },
//   { to: "#", label: "Пользователи" },
//   { label: "Регистрация" },
// ];

const ITEMS_TO_DISPLAY = 3;

const BreadcrumbResponsive: React.FC<{
  items: BreadcrumbLink[];
}> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={items[0].to ? items[0].to : "#"}>{items[0].label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="развернуть меню"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {items.slice(1, -2).map((item, index) => (
                      <DropdownMenuItem key={index}>
                        <Link to={item.to ? item.to : "#"}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="развернуть меню">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Перейти к</DrawerTitle>
                      <DrawerDescription>
                        Выберите страницу для перехода.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {items
                        .slice(1, -ITEMS_TO_DISPLAY + 1)
                        .map((item, index) => (
                          <Link
                            key={index}
                            to={item.to ? item.to : "#"}
                            className="py-1 text-sm"
                          >
                            {item.label}
                          </Link>
                        ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Закрыть</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.to ? (
              <>
                <BreadcrumbLink
                  asChild
                  className="max-w-[5rem] truncate md:max-w-none"
                >
                  <Link to={item.to}>{item.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbList>
                  <BreadcrumbSeparator />
                </BreadcrumbList>
              </>
            ) : (
              <BreadcrumbPage className="max-w-[5rem] truncate md:max-w-none">
                {item.label}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbResponsive;
