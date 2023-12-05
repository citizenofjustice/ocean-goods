/**
 * Styled catalog item info block
 * @returns
 */
const ItemInfoCard: React.FC<{
  children: string;
}> = ({ children }) => {
  return (
    <div className="flex w-fit whitespace-nowrap my-1 px-1 py-1 border-solid border-2 rounded-lg border-sky-200 text-sm text-center">
      {children}
    </div>
  );
};

export default ItemInfoCard;
