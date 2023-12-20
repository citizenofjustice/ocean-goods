import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ImageDropzone: React.FC<{
  id: string;
  type: string;
  name: string;
  previewImage: File | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}> = ({ id, type, name, previewImage, onInputChange, onRemove }) => {
  const labelClass =
    "flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50";
  return (
    <div className="flex flex-col w-full">
      <p className="block mb-2 text-sm font-medium">Изображение</p>
      <label
        htmlFor={id}
        className={`${previewImage && "hidden"} ${labelClass}`}
      >
        <div className="flex flex-col items-center justify-center h-44">
          <CloudArrowUpIcon className="w-10 h-10 text-gray-500" />
          <p className="mb-2 px-4 text-center text-sm text-gray-500">
            <span className="font-semibold">Нажмите чтобы загрузить</span> или
            перетащите сюда файл
          </p>
        </div>
        <input
          id={id}
          type={type}
          name={name}
          onChange={onInputChange}
          accept="image/*"
          className="hidden"
        />
      </label>
      {previewImage && (
        <div className="flex py-2 h-44">
          <img className="h-full" src={URL.createObjectURL(previewImage)} />
          <div onClick={onRemove} className="w-6 h-6 hover:cursor-pointer">
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
