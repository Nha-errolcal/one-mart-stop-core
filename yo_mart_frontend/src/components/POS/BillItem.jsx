import { Config } from "@/util/Config";
import { Minus, Plus, X } from "lucide-react";

const BillItem = ({
  index,
  name,
  product_out,
  cart_qty,
  discount,
  image,
  handleOnIncrease,
  handleOnDescrease,
  handleDeleteRowProduct,
}) => {
  const finalPrice = () => {
    let price = Number(product_out);
    if (discount && Number(discount) !== 0) {
      price = price - (price * Number(discount)) / 100;
    }
    return (price * cart_qty).toFixed(2);
  };

  return (
    <tr
      className="transition-colors duration-150 hover:bg-blue-50/60"
      style={{ borderBottom: "1px solid #e2e8f0" }}
    >
      {/* Name + avatar */}
      <td className="py-2 pr-2">
        <div className="flex items-center gap-2">
          {image ? (
            <img
              src={Config.image_path + image}
              alt={name}
              className="w-8 h-8 rounded-lg object-cover shrink-0"
              style={{ border: "1px solid #e2e8f0" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black"
              style={{
                background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                color: "#2563eb",
              }}
            >
              {name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p
              className="font-battambang text-xs font-semibold truncate max-w-[75px]"
              style={{ color: "#1e293b" }}
            >
              {name}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-xs" style={{ color: "#64748b" }}>
                ${Number(product_out).toFixed(2)}
              </p>
              {discount && Number(discount) !== 0 && (
                <span
                  className="text-xs px-1 rounded font-bold"
                  style={{
                    background: "#dcfce7",
                    color: "#16a34a",
                    fontSize: 9,
                  }}
                >
                  -{discount}%
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Qty controls */}
      <td className="py-2 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={handleOnDescrease}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:bg-slate-200"
            style={{
              background: "#f1f5f9",
              color: "#64748b",
              border: "1px solid #e2e8f0",
            }}
            type="button"
          >
            <Minus size={9} />
          </button>
          <span
            className="w-6 text-center text-xs font-bold"
            style={{ color: "#1e293b" }}
          >
            {cart_qty}
          </span>
          <button
            onClick={handleOnIncrease}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              color: "#fff",
              boxShadow: "0 2px 6px rgba(59,130,246,0.35)",
            }}
            type="button"
          >
            <Plus size={9} />
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="py-2 text-right">
        <span className="text-xs font-bold" style={{ color: "#2563eb" }}>
          ${finalPrice()}
        </span>
      </td>

      {/* Delete */}
      <td className="py-2 pl-2">
        <button
          onClick={handleDeleteRowProduct}
          className="w-5 h-5 rounded-md flex items-center justify-center transition-all hover:bg-red-100"
          style={{
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          }}
          type="button"
        >
          <X size={9} />
        </button>
      </td>
    </tr>
  );
};

export default BillItem;
