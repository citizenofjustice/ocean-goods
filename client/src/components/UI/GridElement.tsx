/**
 * Component for aligning grid element contents
 * @returns
 */
const GridElement: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center border-solid border-2 rounded-lg">
      {children}
    </div>
  );
};

export default GridElement;
