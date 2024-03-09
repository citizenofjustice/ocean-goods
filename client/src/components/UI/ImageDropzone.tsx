import { UploadCloud, X } from "lucide-react";
import { Card } from "./card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Button } from "./button";
import { Control } from "react-hook-form";
import { zodCatalogItemForm } from "../../lib/zodCatalogItemForm";
import { z } from "zod";

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
            <Card className="flex w-[100%] h-[100%] justify-center max-h-[140px]">
              <label
                htmlFor="fileInput"
                className="hover:cursor-pointer w-full"
              >
                <span className="py-2 w-[100%] h-[100%] flex flex-col items-center justify-center">
                  {field.value ? (
                    <img
                      className="max-w-[100%] max-h-[100%] rounded"
                      src={
                        typeof field.value === "string"
                          ? import.meta.env.VITE_REACT_SERVER_URL + field.value
                          : URL.createObjectURL(field.value)
                      }
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center grow">
                      <UploadCloud strokeWidth={0.95} className="w-10 h-10" />
                      <p className="mb-2 px-4 text-center">
                        <span className="font-medium text-sm">
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
                className="p-1 absolute top-9 right-1"
              >
                <X className="w-6 h-6" />
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
