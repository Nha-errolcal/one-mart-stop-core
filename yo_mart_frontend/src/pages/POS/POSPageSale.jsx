import React, { useEffect, useState } from "react";
import { Input, InputNumber, message, notification, Select } from "antd";
import { request } from "@/store/Configstore";
import MainPage from "@/layouts/auth/MainPage";
import ProductItem from "../../components/POS/ProductItem";
import BillItem from "../../components/POS/BillItem";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../components/POS/PrintInvoice";
import { useOrderStore } from "@/store/orderStore";
import {
  ShoppingCart,
  Search,
  Trash2,
  CreditCard,
  Tag,
  Users,
  Coffee,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

const POSPageSale = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [filter, setFilter] = useState({ search: "", category_id: "" });

  // ── Zustand ──
  const cartList = useOrderStore((s) => s.cartList);
  const objSummary = useOrderStore((s) => s.objSummary);
  const setObjSummary = useOrderStore((s) => s.setObjSummary);
  const addToCart = useOrderStore((s) => s.addToCart);
  const increaseCart = useOrderStore((s) => s.increaseCart);
  const decreaseCart = useOrderStore((s) => s.decreaseCart);
  const removeCartItem = useOrderStore((s) => s.removeCartItem);
  const clearCart = useOrderStore((s) => s.clearCart);
  const calculateSummary = useOrderStore((s) => s.calculateSummary);

  const refInvoice = React.useRef(null);

  useEffect(() => {
    getAll();
    getCategory();
    getCustomer();
    getPaymentMethod();
  }, []);

  // Recalculate whenever cart changes
  useEffect(() => {
    calculateSummary();
  }, [cartList]);

  const getCustomer = async () => {
    try {
      const r = await request("customer", "get");
      if (r) setCustomer(r.getAll);
    } catch (e) {
      message.warning(String(e));
    }
  };

  const getPaymentMethod = async () => {
    try {
      const r = await request("payments", "get");
      if (r) setPaymentMethod(r.data);
    } catch (e) {
      message.warning(String(e));
    }
  };

  const getCategory = async () => {
    try {
      const r = await request("category", "get");
      if (r) setCategoryFilter(r.getAll);
    } catch (e) {
      message.warning(String(e));
    }
  };

  const getAll = async () => {
    try {
      const res = await request("product", "get", { ...filter });
      if (res) {
        if (res.getAll?.length === 1) {
          handleAddToCart(res.getAll[0]);
          setLoading(false);
          return;
        }
        setList(res.getAll);
        setLoading(false);
      }
    } catch (e) {
      message.warning(String(e));
    }
  };

  const onFilter = () => getAll();

  const handleAddToCart = (item) => {
    const success = addToCart(item);
    if (!success) {
      notification.warning({
        message: "អស់ស្តុក",
        description: `ស្តុកនៅសល់: ${item.qty}`,
        placement: "topRight",
      });
    }
  };

  const handleOnIncrease = (item, index) => {
    const cart = cartList;
    if (item.qty < cart[index].cart_qty + 1) {
      notification.warning({
        message: "អស់ស្តុក",
        description: `ស្តុក: ${item.qty}`,
        placement: "topRight",
      });
      return;
    }
    increaseCart(index);
  };

  const handleOnDecrease = (item, index) => {
    decreaseCart(index);
  };

  const handleCheckOut = async () => {
    const order_detail = cartList.map((item) => {
      let total = Number(item.cart_qty) * Number(item.product_out);
      if (item.discount && Number(item.discount) !== 0)
        total = total - (total * Number(item.discount)) / 100;
      return {
        product_id: Number(item.id),
        qty: Number(item.cart_qty),
        price: Number(item.product_out),
        discount: Number(item.discount),
        total,
      };
    });

    try {
      const res = await request("order", "post", {
        customer_id: objSummary.customer_id || null,
        paid_amount: objSummary.paid_amount || 0,
        payment_method: objSummary.payment_method || null,
        remark: objSummary.remark?.trim() || null,
        order_detail,
      });
      if (res?.order) {
        message.success("ការបញ្ជាទិញបានជោគជ័យ!");
        setObjSummary({
          ...objSummary,
          order_num: res.order.order_num,
          order_date: res.order.created_at,
        });
        setTimeout(() => handlePrintInvoice(), 550);
      } else {
        message.warning("ការបញ្ជាទិញមិនបានជោគជ័យ!");
      }
    } catch {
      message.error("មានបញ្ហាក្នុងការបញ្ជាទិញ។");
    }
  };

  const handlePrintInvoice = useReactToPrint({
    contentRef: refInvoice,
    onBeforePrint: React.useCallback(() => Promise.resolve(), []),
    onAfterPrint: React.useCallback(() => {
      clearCart();
    }, []),
    onPrintError: React.useCallback(() => {}, []),
  });

  const cartTotal = parseFloat(objSummary.total_price_discount_USD) || 0;
  const change = parseFloat(objSummary.paid_amount) - cartTotal;

  // ─── Color Tokens ───────────────────────────────────────────────────────────
  const BG_PAGE = "#f0f4f8";
  const BG_CARD = "#ffffff";
  const BG_SURFACE = "#f8fafc";
  const BG_INPUT = "#f1f5f9";
  const BORDER = "#e2e8f0";
  const BLUE = "#2563eb";
  const BLUE_GRAD = "linear-gradient(135deg,#3b82f6,#2563eb)";
  const TEXT_MAIN = "#1e293b";
  const TEXT_DIM = "#64748b";
  const TEXT_MUTED = "#94a3b8";
  const GREEN = "#16a34a";
  const RED = "#dc2626";
  const SHADOW = "0 1px 6px rgba(0,0,0,0.08)";
  const SHADOW_LG = "0 4px 20px rgba(37,99,235,0.15)";

  return (
    <MainPage loading={loading}>
      <div className="hidden">
        <PrintInvoice
          ref={refInvoice}
          objSummary={objSummary}
          cart_list={cartList}
        />
      </div>

      <div
        className="flex gap-3 overflow-hidden rounded-2xl p-3"
        style={{ height: "calc(100vh - 88px)", background: BG_PAGE }}
      >
        {/* ════════ LEFT PANEL ════════ */}
        <div
          className="w-[380px] shrink-0 flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: SHADOW,
          }}
        >
          {/* Header */}
          <div
            className="px-4 pt-4 pb-3 flex items-center justify-between"
            style={{
              borderBottom: `1px solid ${BORDER}`,
              background: BG_SURFACE,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: BLUE_GRAD,
                  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
                }}
              >
                <ShoppingCart size={16} className="text-white" />
              </div>
              <div>
                <p
                  className="font-semibold text-sm font-battambang"
                  style={{ color: TEXT_MAIN }}
                >
                  តម្រូវការ
                </p>
                <p
                  className="text-xs font-battambang"
                  style={{ color: TEXT_DIM }}
                >
                  {objSummary.total_qty} មុខ
                </p>
              </div>
            </div>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full font-battambang"
              style={{
                background: "#dbeafe",
                color: BLUE,
                border: `1px solid #bfdbfe`,
              }}
            >
              {cartList.length} items
            </span>
          </div>

          {/* Customer */}
          <div className="px-3 pt-3">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: BG_SURFACE, border: `1px solid ${BORDER}` }}
            >
              <Users size={14} style={{ color: BLUE }} className="shrink-0" />
              <span
                className="text-xs font-battambang shrink-0"
                style={{ color: TEXT_DIM }}
              >
                អតិថិជន:
              </span>
              <Select
                allowClear
                size="small"
                className="flex-1"
                value={objSummary.customer_id}
                placeholder="ជ្រើសរើស..."
                onChange={(v) =>
                  setObjSummary({ ...objSummary, customer_id: v })
                }
                variant="borderless"
                style={{ color: TEXT_MAIN }}
              >
                {customer.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Cart list */}
          <div className="flex-1 overflow-y-auto px-3 pt-2 min-h-0">
            {cartList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "#f1f5f9",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <Coffee size={26} style={{ color: "#cbd5e1" }} />
                </div>
                <p
                  className="font-battambang text-sm"
                  style={{ color: TEXT_MUTED }}
                >
                  មិនទាន់មានទំនិញ
                </p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr
                    style={{
                      color: TEXT_DIM,
                      borderBottom: `2px solid ${BORDER}`,
                    }}
                  >
                    <th className="text-left py-2 font-battambang font-semibold">
                      មុខទំនិញ
                    </th>
                    <th className="text-center py-2 font-battambang font-semibold">
                      ចំនួន
                    </th>
                    <th className="text-right py-2 font-battambang font-semibold">
                      សរុប
                    </th>
                    <th className="w-6" />
                  </tr>
                </thead>
                <tbody>
                  {cartList.map((item, index) => (
                    <BillItem
                      key={item.id}
                      {...item}
                      index={index}
                      handleOnDescrease={() => handleOnDecrease(item, index)}
                      handleOnIncrease={() => handleOnIncrease(item, index)}
                      handleDeleteRowProduct={() => removeCartItem(item.id)}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary footer */}
          <div
            className="px-3 pb-3 flex flex-col gap-2 pt-3"
            style={{ borderTop: `1px solid ${BORDER}`, background: BG_SURFACE }}
          >
            <div className="flex justify-between items-center text-xs px-1">
              <span
                className="flex items-center gap-1 font-battambang"
                style={{ color: TEXT_DIM }}
              >
                <Tag size={11} /> បញ្ចុះតម្លៃ
              </span>
              <span className="font-bold" style={{ color: GREEN }}>
                -${objSummary.save_discount}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InputNumber
                placeholder="ទឹកប្រាក់"
                className="w-full"
                min={0}
                value={objSummary.paid_amount || null}
                onChange={(v) =>
                  setObjSummary({ ...objSummary, paid_amount: v })
                }
                style={{
                  background: BG_INPUT,
                  borderColor: BORDER,
                  color: TEXT_MAIN,
                }}
              />
              <Select
                placeholder="វិធីទូទាត់"
                className="w-full"
                value={objSummary.payment_method || undefined}
                onChange={(v) => {
                  const sel = paymentMethod.find((pm) => pm.id === v);
                  setObjSummary({
                    ...objSummary,
                    payment_method: sel ? sel.payment_name : "",
                  });
                }}
              >
                {paymentMethod.map((pm) => (
                  <Select.Option key={pm.id} value={pm.id}>
                    {pm.payment_name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Input.TextArea
              placeholder="កត់សម្គាល់..."
              rows={1}
              className="font-battambang text-xs resize-none"
              style={{
                background: BG_INPUT,
                borderColor: BORDER,
                color: TEXT_MAIN,
              }}
              value={objSummary.remark || ""}
              onChange={(e) =>
                setObjSummary({ ...objSummary, remark: e.target.value })
              }
            />

            {/* Total card */}
            <div
              className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: BLUE_GRAD, boxShadow: SHADOW_LG }}
            >
              <div>
                <p
                  className="text-xs font-battambang mb-0.5"
                  style={{ color: "#bfdbfe" }}
                >
                  សរុបទាំងអស់
                </p>
                <p className="text-white text-2xl font-black tracking-tight">
                  ${objSummary.total_price_discount_USD || "0.00"}
                </p>
                <p className="text-xs" style={{ color: "#bfdbfe" }}>
                  ៛ {objSummary.total_price_discount_KHR || "0"}
                </p>
              </div>
              {objSummary.paid_amount > 0 && (
                <div className="text-right">
                  <p
                    className="text-xs font-battambang"
                    style={{ color: "#bfdbfe" }}
                  >
                    អាប់
                  </p>
                  <p
                    className={`text-xl font-black ${change >= 0 ? "text-green-200" : "text-red-200"}`}
                  >
                    ${change.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={clearCart}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-battambang text-sm font-semibold transition-all hover:bg-red-100"
                style={{
                  background: "#fef2f2",
                  color: RED,
                  border: `1px solid #fecaca`,
                }}
              >
                <Trash2 size={13} /> លុបការកម្មង់
              </button>
              <button
                disabled={cartList.length === 0}
                onClick={handleCheckOut}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-battambang text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: cartList.length === 0 ? "#e2e8f0" : BLUE_GRAD,
                  color: cartList.length === 0 ? TEXT_MUTED : "#fff",
                  boxShadow: cartList.length === 0 ? "none" : SHADOW_LG,
                }}
              >
                <CreditCard size={13} /> ទូទាត់ប្រាក់
              </button>
            </div>
          </div>
        </div>

        {/* ════════ RIGHT PANEL ════════ */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden min-w-0">
          <div
            className="rounded-2xl px-3 py-2.5 flex items-center gap-2 shrink-0"
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: SHADOW,
            }}
          >
            <SlidersHorizontal
              size={14}
              style={{ color: BLUE }}
              className="shrink-0"
            />
            <Input
              placeholder="ស្វែងរកផលិតផល..."
              prefix={<Search size={12} style={{ color: TEXT_MUTED }} />}
              value={filter.search}
              onChange={(e) =>
                setFilter((p) => ({ ...p, search: e.target.value }))
              }
              onPressEnter={onFilter}
              allowClear
              variant="borderless"
              className="flex-1 max-w-xs font-battambang text-sm"
              style={{ color: TEXT_MAIN }}
            />
            <div className="w-px h-5" style={{ background: BORDER }} />
            <Select
              placeholder="ប្រភេទទំនិញ"
              className="w-44"
              allowClear
              variant="borderless"
              style={{ color: TEXT_DIM }}
              onChange={(id) =>
                setFilter((p) => ({ ...p, category_id: id ?? "" }))
              }
            >
              {categoryFilter?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
            <button
              onClick={onFilter}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white font-battambang transition-all hover:brightness-110"
              style={{
                background: BLUE_GRAD,
                boxShadow: "0 2px 10px rgba(59,130,246,0.3)",
              }}
            >
              <Zap size={12} /> ស្វែងរក
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-0.5">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
                >
                  <Coffee size={36} style={{ color: "#cbd5e1" }} />
                </div>
                <p
                  className="font-battambang text-sm"
                  style={{ color: TEXT_MUTED }}
                >
                  មិនមានផលិតផល
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {list.map((item, index) => (
                  <ProductItem
                    key={index}
                    {...item}
                    handlAddTocart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainPage>
  );
};

export default POSPageSale;
