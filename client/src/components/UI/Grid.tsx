/**
 * Componnent for splitting catalogue into divided grid
 * @param xCount - amount of columns
 * @param yCount - amount of rows
 * @returns
 */
const Grid: React.FC<{
  xCount: string;
  yCount: string;
  children: React.ReactNode;
}> = ({ xCount, yCount, children }) => {
  return (
    <div className={`grid grid-cols-${xCount} grid-rows-${yCount} gap-2`}>
      {children}
    </div>
  );
};

export default Grid;
