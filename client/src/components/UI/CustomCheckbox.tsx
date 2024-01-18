import React, { useEffect, useState } from "react";
import { Privelege } from "../../types/Privelege";

const CustomCheckbox: React.FC<{
  content: Privelege[];
  nameForIds: string;
  onChange: (priveleges: number[]) => void;
  initValues?: number[];
}> = ({ content, nameForIds, initValues = [], onChange }) => {
  const [checkedState, setCheckedState] = useState(
    new Array(content.length).fill(false)
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: number
  ) => {
    const { value } = e.target;
    handleIdsSelection(+value);
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  useEffect(() => {
    onChange(selectedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedState]);

  const handleIdsSelection = (id: number) => {
    const isIncluded = selectedIds.includes(id);
    if (isIncluded) {
      const filtered = selectedIds.filter((item) => item !== id);
      setSelectedIds(filtered);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <>
      <ul className="w-fit mt-2">
        {content.map((item, index) => (
          <li
            className="w-fit flex items-center py-1 mb-2 gap-2"
            key={item.privelegeId}
          >
            <input
              className="flex-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              type="checkbox"
              id={`${nameForIds}-checkbox-${index}`}
              name={item.title}
              value={item.privelegeId}
              checked={initValues?.includes(item.privelegeId)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleCheckboxChange(e, index)
              }
            />
            <label htmlFor={`${nameForIds}-checkbox-${index}`}>
              <p className="first-letter:capitalize">{item.title}</p>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CustomCheckbox;
