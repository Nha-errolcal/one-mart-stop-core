import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

const AboutSystem = () => {
  const [expandedVersion, setExpandedVersion] = useState(null);

  const toggleVersion = (version) => {
    setExpandedVersion(expandedVersion === version ? null : version);
  };

  const versions = [
    {
      version: "1.0.0",
      details: [
        "បង្កើត CRUD សម្រាប់ Product, Customer, Employee",
        "បង្កើតលក់ POS និង Category",
        "បង្កើត Order detail និង Dashboard",
      ],
    },
    {
      version: "2.0.0",
      details: [
        "ប្ដូរ UI ទាំងមូល",
        "បន្ថែម Report តាមសាខានៅ Dashboard",
        "User (សម្រាប់ Super Admin) អាច បង្កើត, កែប្រែ, លុប, មើល សិទ្ធិ និង តួនាទី",
        "បន្ថែម Search និង Filter នៅលើទំព័រ Product, Customer, Employee",
        "បន្ថែម កំណត់ត្រា Order តាមសាខា និងកាលបរិច្ឆេទនៅលើទំព័រ Order",
      ],
    },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Info size={28} className="text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">អំពីប្រព័ន្ធ</h2>
      </div>

      {/* Objective */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          គោលបំណងនៃប្រព័ន្ធ
        </h3>
        <p className="text-gray-600 leading-relaxed">
          គ្រប់គ្រង Mart តាមសាខា និងការលក់របស់ Mart,
          ជាមួយការគ្រប់គ្រងអ្នកប្រើប្រាស់។
        </p>
      </div>

      {/* Versions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          ប្រវត្តិ Version
        </h3>
        {versions.map((v, index) => (
          <div key={index} className="mb-3 border border-gray-200 rounded-lg">
            <button
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg focus:outline-none"
              onClick={() => toggleVersion(v.version)}
            >
              <span className="font-medium text-gray-800">
                Version {v.version}
              </span>
              {expandedVersion === v.version ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {expandedVersion === v.version && (
              <ul className="px-6 py-3 text-gray-600 bg-white border-t border-gray-200 list-disc list-inside space-y-1">
                {v.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSystem;
