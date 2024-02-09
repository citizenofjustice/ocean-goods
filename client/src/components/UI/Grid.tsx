import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Componnent for splitting catalogue into divided grid
 * @param xCount - amount of columns
 * @param yCount - amount of rows
 * @returns
 */
const Grid: React.FC<{
  xCount: string;
  yCount?: string;
  children: React.ReactNode;
}> = ({ xCount, yCount, children }) => {
  /* media querys for grid adaptive layout */
  const desktop = useMediaQuery("(min-width: 1024px)");
  const tablet = useMediaQuery("(min-width: 768px)");
  const mobile = useMediaQuery("(min-width: 425px)");
  const smallMobile = useMediaQuery("(min-width: 375px)");
  xCount = tablet ? "3" : xCount;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${
          smallMobile ? xCount : "1"
        }, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${yCount}, minmax(0, 1fr))`,
        gap: mobile ? "1rem" : "1.5rem",
        padding: desktop ? "0 18%" : `${tablet ? "0 6%" : "0"}`,
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
