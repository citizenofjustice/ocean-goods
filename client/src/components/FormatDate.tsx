const FormatDate: React.FC<{
  createdAt: string;
}> = ({ createdAt }) => {
  const date = new Date(createdAt);
  const dateWithTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;

  return <>{dateWithTime}</>;
};

export default FormatDate;
