// src/pages/errors/ForbiddenPage.jsx
import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 font-battambang text-center">
      <ShieldOff size={60} className="text-[#EA4156]" />
      <h1 className="text-2xl font-bold text-gray-700">
        គ្មានសិទ្ធិចូលទំព័រនេះ
      </h1>
      <p className="text-gray-500 text-sm">អ្នកមិនមានសិទ្ធិចូលមើលទំព័រនេះទេ។</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-[#EA4156] text-white rounded-lg text-sm hover:opacity-90 transition"
      >
        ត្រឡប់ទៅទំព័រដើម
      </button>
    </div>
  );
};

export default ForbiddenPage;
