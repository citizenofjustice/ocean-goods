import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

const ImageDropzone: React.FC<{
  id: string;
  type: string;
  name: string;
  previewImage: File | string | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}> = ({ id, type, name, previewImage, onInputChange, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageRemoval = () => {
    if (fileInputRef.current?.value) fileInputRef.current.value = "";
    onRemove();
  };

  const labelClass =
    "flex flex-col items-center justify-center w-full border border-accent-700 border-dashed rounded-lg cursor-pointer bg-background-50";
  return (
    <div className="flex flex-col w-full">
      <p className="block mb-2 font-medium">Изображение</p>
      <label
        htmlFor={id}
        className={`${previewImage && "hidden"} ${labelClass}`}
      >
        <div className="flex flex-col items-center justify-center h-44">
          <CloudArrowUpIcon className="w-10 h-10 text-text-500" />
          <p className="mb-2 px-4 text-center text-text-500">
            <span className="font-semibold">Нажмите чтобы загрузить файл</span>
          </p>
        </div>
        <input
          id={id}
          ref={fileInputRef}
          type={type}
          name={name}
          onChange={onInputChange}
          accept="image/*"
          className="hidden"
        />
      </label>
      {previewImage && (
        <div className="flex py-2 h-44">
          <img
            className="h-full"
            src={
              typeof previewImage === "string"
                ? previewImage
                : URL.createObjectURL(previewImage)
            }
          />
          <div
            onClick={handleImageRemoval}
            className="w-6 h-6 hover:cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
