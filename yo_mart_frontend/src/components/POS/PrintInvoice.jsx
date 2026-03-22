import React from "react";
import logo from "../../assets/image/logo.png";
import { formatDate } from "../../store/Configstore";

const PrintInvoice = React.forwardRef((props, ref) => {
  const { objSummary = {}, cart_list = [] } = props;

  const findTotalItemUSD = (item) => {
    let total = Number(item.cart_qty) * Number(item.product_out);
    if (item.discount && Number(item.discount) !== 0) {
      total = total - (total * Number(item.discount)) / 100;
    }
    return total.toFixed(2);
  };

  const findTotalItemKHR = (item) => {
    const exchangeRate = 4000;
    let total = Number(item.cart_qty) * Number(item.product_out);
    if (item.discount && Number(item.discount) !== 0) {
      total = total - (total * Number(item.discount)) / 100;
    }
    return (total * exchangeRate).toLocaleString();
  };

  // Safe KHR total — handles both string and number
  const khrTotal = () => {
    const val = objSummary?.total_price_discount_KHR;
    if (!val) return "0";
    if (typeof val === "number") return val.toLocaleString();
    return String(val); // already formatted string from state
  };

  const usdTotal = () =>
    Number(objSummary?.total_price_discount_USD || 0).toFixed(2);
  const discount = () => Number(objSummary?.save_discount || 0).toFixed(2);

  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        padding: "10px 12px",
        background: "#fff",
        color: "#000",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "11px",
        lineHeight: "1.5",
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <img
          src={logo}
          alt="logo"
          style={{ width: 52, margin: "0 auto 4px" }}
        />
        <div
          style={{ fontWeight: "bold", fontSize: 13 }}
          className="font-battambang"
        >
          ហាងកាហ្វេអាយធីស្មោះស្នេហ៍
        </div>
        <div style={{ fontSize: 10, color: "#555" }}>IT Cafe | POS System</div>
        <div style={{ borderBottom: "1px dashed #000", margin: "6px 0" }} />
      </div>

      {/* ── Order info ── */}
      <div style={{ marginBottom: 6 }}>
        {[
          ["លេខវិក្កយបត្រ", objSummary?.order_num || "—"],
          ["អតិថិជន", objSummary?.customer_id || "Walk-in"],
          ["អ្នកគិតលុយ", "Cashier"],
          [
            "កាលបរិច្ឆេទ",
            formatDate(objSummary?.order_date, "YYYY/MM/DD h:mm A"),
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span className="font-battambang" style={{ color: "#444" }}>
              {label}:
            </span>
            <span style={{ fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ borderBottom: "1px dashed #000", margin: "6px 0" }} />

      {/* ── Items table ── */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #000" }}>
            <th
              style={{ textAlign: "left", padding: "2px 1px" }}
              className="font-battambang"
            >
              មុខទំនិញ
            </th>
            <th
              style={{ textAlign: "right", padding: "2px 1px" }}
              className="font-battambang"
            >
              តម្លៃ
            </th>
            <th
              style={{ textAlign: "center", padding: "2px 1px" }}
              className="font-battambang"
            >
              ចំ
            </th>
            <th style={{ textAlign: "right", padding: "2px 1px" }}>Dis%</th>
            <th style={{ textAlign: "right", padding: "2px 1px" }}>Total$</th>
          </tr>
        </thead>
        <tbody>
          {cart_list.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px dotted #ccc" }}>
              <td
                style={{
                  padding: "3px 1px",
                  maxWidth: 60,
                  wordBreak: "break-word",
                }}
              >
                {item.name}
              </td>
              <td style={{ padding: "3px 1px", textAlign: "right" }}>
                ${Number(item.product_out).toFixed(2)}
              </td>
              <td style={{ padding: "3px 1px", textAlign: "center" }}>
                {item.cart_qty}
              </td>
              <td style={{ padding: "3px 1px", textAlign: "right" }}>
                {item.discount || 0}%
              </td>
              <td
                style={{
                  padding: "3px 1px",
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                ${findTotalItemUSD(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderBottom: "1px dashed #000", margin: "6px 0" }} />

      {/* ── Totals ── */}
      <div style={{ fontSize: 11 }}>
        {[
          ["ចំនួនសរុប", `${objSummary?.total_qty || 0} មុខ`],
          ["បញ្ចុះតម្លៃ", `-$${discount()}`],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1px 0",
            }}
          >
            <span className="font-battambang">{label}:</span>
            <span>{value}</span>
          </div>
        ))}

        <div style={{ borderBottom: "1px dashed #000", margin: "4px 0" }} />

        {/* Grand total USD */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          <span className="font-battambang">សរុប:</span>
          <span>${usdTotal()}</span>
        </div>
        {/* Grand total KHR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 13,
          }}
        >
          <span className="font-battambang">សរុប:</span>
          <span>៛{khrTotal()}</span>
        </div>

        {/* Paid + change */}
        {objSummary?.paid_amount > 0 && (
          <>
            <div style={{ borderBottom: "1px dashed #000", margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="font-battambang">បានទូទាត់:</span>
              <span>${Number(objSummary.paid_amount).toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#16a34a",
                fontWeight: 600,
              }}
            >
              <span className="font-battambang">អាប់:</span>
              <span>
                $
                {(
                  Number(objSummary.paid_amount) -
                  Number(objSummary.total_price_discount_USD || 0)
                ).toFixed(2)}
              </span>
            </div>
          </>
        )}

        {/* Payment method */}
        {objSummary?.payment_method && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <span className="font-battambang">វិធីទូទាត់:</span>
            <span>{objSummary.payment_method}</span>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px dashed #000",
          marginTop: 8,
          paddingTop: 6,
          textAlign: "center",
        }}
      >
        <p
          className="font-battambang"
          style={{ fontWeight: 600, fontSize: 12 }}
        >
          អរគុណសម្រាប់ការបញ្ជាទិញ!
        </p>
        <p style={{ fontSize: 10, color: "#666" }}>
          Thank you for your purchase!
        </p>
        <p style={{ fontSize: 9, color: "#999", marginTop: 2 }}>
          *** POS System ***
        </p>
      </div>
    </div>
  );
});

PrintInvoice.displayName = "PrintInvoice";
export default PrintInvoice;
