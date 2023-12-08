import { useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

const LabeledInputField: React.FC<{
  inputId: string;
  title: string;
  inputType: string;
}> = ({ inputId, title, inputType }) => {
  const isImage: boolean = Boolean(inputType === "file");

  return (
    <div className="bg-gray-200 p-2 rounded-lg">
      <label htmlFor={inputId} className="block mb-2 text-sm font-medium">
        {title}
      </label>
      {isImage ? (
        <div className="flex items-center">
          <Dropzone id={inputId} type={inputType} title={title} />
        </div>
      ) : (
        <input
          type={inputType}
          id={inputId}
          className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={title}
          required
        />
      )}
    </div>
  );
};

export default LabeledInputField;

const Dropzone: React.FC<{
  id: string;
  type: string;
  title: string;
}> = ({ id, type, title }) => {
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
  };
  const labelClass =
    "flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50";
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor={id}
        className={`${previewImage && "hidden"} ${labelClass}`}
      >
        <div className="flex flex-col items-center justify-center h-44">
          <CloudArrowUpIcon className="w-10 h-10 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Нажмите чтобы загрузить</span> или
            перетащите сюда файл
          </p>
        </div>
        <input
          id={id}
          type={type}
          name={title}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
      </label>
      {previewImage && (
        <div className="py-2 h-44">
          <img className="h-full" src={previewImage} />
        </div>
      )}
    </div>
  );
};
