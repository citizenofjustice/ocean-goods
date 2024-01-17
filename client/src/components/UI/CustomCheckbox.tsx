import { useState } from "react";
import { Privelege } from "../../types/Privelege";
// import CustomRadioButton from "./CustomRadioButton";

// const pr: Privelege[] = [
//   {
//     privelegeId: 1,
//     title: "first",
//   },
//   {
//     privelegeId: 2,
//     title: "second",
//   },
// ];

const CheckboxField: React.FC<{
  content: Privelege[];
  nameForIds?: string;
  onChange: (priveleges: number[]) => void;
}> = ({ content, nameForIds = "priveleges", onChange }) => {
  // const [checkedState, setCheckedState] = useState(
  //   new Array(content.length).fill(false)
  // );
  const [checkedState, setCheckedState] = useState(
    new Array(content.length).fill(false)
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCheckboxChange = (position: number, id: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    handleIdsSelection(id);
    onChange(selectedIds);
    // setSelectedIds([...selectedIds, id]);
  };

  const handleIdsSelection = (id: number) => {
    const isIncluded = selectedIds.includes(id);
    if (isIncluded) {
      const filtered = selectedIds.filter((item) => item !== id);
      setSelectedIds(filtered);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // const handleIdsPush = (id: number, isActive: boolean) => {
  //   if (isActive) {
  //     setSelectedIds([...selectedIds, id]);
  //   } else {
  //     const filteredIds = selectedIds.filter((item) => item !== id);
  //     setSelectedIds(filteredIds);
  //   }
  //   onChange(selectedIds);
  //   // const isIncluded = selectedIds.includes(id);
  //   // console.log(isIncluded, `id-${id}: ${isActive}`);

  //   // setSelectedIds();
  // };

  return (
    <>
      <ul className="w-fit my-4">
        {content.map((item, index) => (
          <li className="w-fit" key={item.privelegeId}>
            {/* <CustomRadioButton buttonData={item} onChange={handleIdsPush} /> */}
            <input
              type="checkbox"
              id={`${nameForIds}-checkbox-${index}`}
              name={item.title}
              value={item.privelegeId}
              checked={checkedState[index]}
              onChange={() => handleCheckboxChange(index, item.privelegeId)}
            />
            <label htmlFor={`${nameForIds}-checkbox-${index}`}>
              {item.title}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CheckboxField;
