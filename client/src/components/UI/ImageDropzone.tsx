import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/shadcn/form";
import { Control } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";
import { Card } from "@/components/UI/shadcn/card";
import { Input } from "@/components/UI/shadcn/input";
import { Button } from "@/components/UI/shadcn/button";

import { zodCatalogItemForm } from "@/lib/zodCatalogItemForm";

const ImageDropzone: React.FC<{
  control: Control<z.infer<typeof zodCatalogItemForm>>;
  fieldReset: () => void;
}> = ({ control, fieldReset }) => {
  return (
    <>
      <FormField
        control={control}
        name="mainImage"
        render={({ field }) => (
          <FormItem className="relative">
            <FormLabel htmlFor="fileInput" onClick={(e) => e.preventDefault()}>
              Изображение:
            </FormLabel>
            <FormControl>
              <>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                  id="fileInput"
                  className="hidden"
                  multiple
                />
              </>
            </FormControl>
            <Card className="flex h-[100%] h-[140px] w-[100%] justify-center">
              <label
                htmlFor="fileInput"
                className="w-full hover:cursor-pointer"
              >
                <span className="flex h-[100%] w-[100%] flex-col items-center justify-center py-2">
                  {field.value ? (
                    <img
                      className="max-h-[100%] max-w-[100%] rounded"
                      loading="lazy"
                      src={
                        typeof field.value === "string"
                          ? `${import.meta.env.VITE_SERVER_URL}${field.value}`
                          : URL.createObjectURL(field.value)
                      }
                    />
                  ) : (
                    <div className="flex grow flex-col items-center justify-center">
                      <UploadCloud strokeWidth={0.95} className="h-10 w-10" />
                      <p className="mb-2 px-4 text-center">
                        <span className="text-sm font-medium">
                          Нажмите чтобы загрузить файл
                        </span>
                      </p>
                    </div>
                  )}
                </span>
              </label>
              <Button
                onClick={fieldReset}
                variant="ghost"
                type="button"
                className="absolute right-1 top-9 p-1"
              >
                <X className="h-6 w-6" />
              </Button>
            </Card>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ImageDropzone;
