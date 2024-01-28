const TextCrossed: React.FC<{ children: string }> = ({ children }) => {
  return (
    <span className="relative before:absolute before:content-{''} before:left-0 before:top-[50%] before:right-0 before:border-t-2 before:border-red-300 before:origin-center before:-rotate-12">
      {children}
    </span>
  );
};

export default TextCrossed;
