import { Config } from "@/util/Config";
import { ShoppingCart } from "lucide-react";

const ProductItem = ({
  name,
  product_out,
  discount,
  image,
  qty,
  category_name,
  handlAddTocart,
}) => {
  const salePrice = () => {
    if (!discount || Number(discount) === 0) return null;
    return (
      Number(product_out) -
      (Number(product_out) * Number(discount)) / 100
    ).toFixed(2);
  };

  const outOfStock = qty <= 0;
  const discounted = salePrice();
  const lowStock = qty > 0 && qty <= 10;

  return (
    <div
      onClick={!outOfStock ? handlAddTocart : undefined}
      className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200 group"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
        opacity: outOfStock ? 0.55 : 1,
        cursor: outOfStock ? "not-allowed" : "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!outOfStock) {
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.18)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.07)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{ height: 105, background: "#f8fafc" }}
      >
        {image ? (
          <img
            src={Config.image_path + image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-4xl font-black select-none"
              style={{
                color: "#bfdbfe",
                fontFamily: "Georgia, serif",
                letterSpacing: "-2px",
              }}
            >
              {name?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discount && Number(discount) !== 0 && (
          <div
            className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded-lg"
            style={{
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
              fontSize: 11,
            }}
          >
            -{discount}%
          </div>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center font-battambang text-xs font-bold"
            style={{ background: "rgba(241,245,249,0.85)", color: "#dc2626" }}
          >
            អស់ស្តុក
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-3 pt-2 pb-2.5 gap-1">
        {/* Category */}
        <p
          className="text-xs font-battambang truncate"
          style={{ color: "#93c5fd" }}
        >
          {category_name}
        </p>

        {/* Name */}
        <p
          className="text-sm font-bold font-battambang leading-tight truncate"
          style={{ color: "#1e293b" }}
        >
          {name}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          {discounted ? (
            <>
              <span
                className="text-xs line-through"
                style={{ color: "#94a3b8" }}
              >
                ${Number(product_out).toFixed(2)}
              </span>
              <span className="text-sm font-black" style={{ color: "#2563eb" }}>
                ${discounted}
              </span>
            </>
          ) : (
            <span className="text-sm font-black" style={{ color: "#2563eb" }}>
              ${Number(product_out).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock */}
        <p
          className="text-xs font-battambang"
          style={{
            color: outOfStock ? "#dc2626" : lowStock ? "#ea580c" : "#94a3b8",
          }}
        >
          ស្តុក: {qty}
        </p>

        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!outOfStock) handlAddTocart();
          }}
          disabled={outOfStock}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold font-battambang text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: outOfStock
              ? "#e2e8f0"
              : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: outOfStock ? "#94a3b8" : "#fff",
            boxShadow: outOfStock ? "none" : "0 2px 10px rgba(59,130,246,0.3)",
          }}
          type="button"
        >
          <ShoppingCart size={12} />
          បន្ថែម
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
