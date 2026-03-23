import GrowthValue from "./GrowthValue";

const StatusCard = ({ title, value, icon: Icon, growth }) => {
  return (
    <div className="bg-white p-5 shadow-sm border-l-4 border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>

          {growth !== undefined && (
            <div className="mt-2">
              <GrowthValue value={growth} />
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 text-2xl">
          <Icon />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
