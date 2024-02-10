/**
 * Component for aligning grid element contents
 * @returns
 */
const GridElement: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-background-100 border-background-200 border-2 rounded-lg">
      {children}
    </div>
  );
};

export default GridElement;
