import { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/UI/shadcn/card";
import { observer } from "mobx-react-lite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/shadcn/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";

import imageNotFound from "@/assets/images/ImageNotFound.svg";
import { useStore } from "@/store/root-store-context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import CartAddButton from "@/components/CartAddButton";
import CatalogItemModel from "@/classes/CatalogItemModel";
import ConfirmActionAlert from "@/components/UI/ConfirmActionAlert";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const CatalogItemCard: React.FC<{
  catalogItem: CatalogItemModel;
}> = observer(({ catalogItem }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Calling a custom axios hook
  const axiosPrivate = useAxiosPrivate();
  // Using store context
  const { auth, alert } = useStore();

  // Defining mutation for deleting a product
  const mutation = useMutation({
    // Function to delete a product
    mutationFn: async (productId: number) => {
      const response = await axiosPrivate.delete(`/catalog/${productId}`);
      return response.data;
    },
    // Function to execute on successful deletion
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      alert.setPopup({ message: "Запись успешно удалена", type: "success" });
    },
    // Function to execute on error
    onError: (error) => {
      if (error instanceof AxiosError)
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
    },
  });

  return (
    <Card className="grid max-w-[18rem] content-between vsm:max-w-none">
      <CardHeader className="flex flex-row items-start justify-between px-4 py-3 lg:py-6">
        <p className="flex h-full w-full items-center justify-center text-center  font-medium leading-4 vsm:px-3">
          <Link to={`item/${catalogItem.productId}`}>
            {catalogItem.productName}
          </Link>
        </p>
        {auth.isAuth && (
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Выпадаюшее меню продукта">
              <MoreHorizontal className="w-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="translate-x-[-20%]">
              <DropdownMenuItem
                className="gap-2"
                onClick={() => navigate(`edit-item/${catalogItem.productId}`)}
                aria-label="Редактировать продукт"
              >
                <SquarePen className="h-5 w-5" />
                <p>Изменить</p>
              </DropdownMenuItem>

              <ConfirmActionAlert
                onConfirm={() => mutation.mutate(catalogItem.productId)}
                question="Вы уверены что хотите продолжить?"
                message="Это действие навсегда удалит данную запись."
              >
                <DropdownMenuItem
                  className="gap-2"
                  onSelect={(e) => e.preventDefault()}
                  aria-label="Удалить продукт"
                >
                  <Trash2 className="h-5 w-5" />
                  <p>Удалить</p>
                </DropdownMenuItem>
              </ConfirmActionAlert>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="relative px-4 pb-3 lg:pb-6">
        <Link to={`/item/${catalogItem.productId}`}>
          {catalogItem.mainImage?.path ? (
            <LazyLoadImage
              alt={"Фото продукта"}
              effect="opacity"
              width={catalogItem.mainImage.width}
              height={catalogItem.mainImage.height}
              src={`${import.meta.env.VITE_SERVER_URL}${
                catalogItem.mainImage.path
              }`}
              wrapperProps={{
                style: {
                  width: "100%",
                  height: "100%",
                },
              }}
            />
          ) : (
            <img
              className="rounded"
              width="300px"
              height="300px"
              src={imageNotFound}
              alt="Изображение не найдено"
            />
          )}
        </Link>
        {catalogItem.discount > 0 && (
          <div className="absolute bottom-8 right-8 flex items-center rounded-md bg-red-700 px-2 font-medium text-white">
            - {catalogItem.discount} %
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 px-4 pb-3 lg:pb-6">
        <CartAddButton
          productId={catalogItem.productId}
          catalogItem={catalogItem}
        />
        <span className="text-end font-medium">
          {catalogItem.finalPrice} руб.
        </span>
      </CardFooter>
    </Card>
  );
});

export default CatalogItemCard;
