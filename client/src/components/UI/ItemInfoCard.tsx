/**
 * Styled catalog item info block
 * @returns
 */
const ItemInfoCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex w-fit whitespace-nowrap my-1 px-1 py-1 border-solid border-2 rounded-lg bg-background-600 border-background-300 text-text-50 text-sm font-medium text-center">
      {children}
    </div>
  );
};

export default ItemInfoCard;
