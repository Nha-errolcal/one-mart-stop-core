const GrowthValue = ({ value }) => {
  const isPositive = value >= 0;

  return (
    <span
      className={`flex items-center gap-1 font-bold ${
        isPositive ? "text-green-500" : "text-red-500"
      }`}
    >
      {isPositive ? "▲" : "▼"} {Math.abs(value || 0)}%
    </span>
  );
};
export default GrowthValue;
