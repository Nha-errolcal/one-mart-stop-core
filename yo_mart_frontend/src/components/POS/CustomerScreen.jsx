import React, { useEffect, useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import logo from "@/assets/image/logo.png";

const CustomerScreen = () => {
  // Local state for live updates
  const [cartList, setCartList] = useState([]);
  const [objSummary, setObjSummary] = useState({});
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Subscribe to cart changes
    const unsubCart = useOrderStore.subscribe(
      (state) => state.cartList,
      (newCart) => setCartList(newCart),
    );

    // Subscribe to summary changes
    const unsubSummary = useOrderStore.subscribe(
      (state) => state.objSummary,
      (newSummary) => setObjSummary(newSummary),
    );

    // Update clock every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      );
    }, 1000);

    // Cleanup on unmount
    return () => {
      unsubCart();
      unsubSummary();
      clearInterval(interval);
    };
  }, []);

  const findTotalUSD = (item) => {
    let total = Number(item.cart_qty) * Number(item.product_out);
    if (item.discount && Number(item.discount) !== 0) {
      total -= (total * Number(item.discount)) / 100;
    }
    return total.toFixed(2);
  };

  const khrTotal = () => {
    const val = objSummary?.total_price_discount_KHR || 0;
    return typeof val === "number" ? val.toLocaleString() : val;
  };

  return (
    <div
      style={{
        width: "80mm",
        padding: 10,
        fontFamily: "'Courier New', monospace",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <img
          src={
            "https://t3.ftcdn.net/jpg/04/64/84/48/360_F_464844845_KtkWjjA3cPqj2SdEdG3pFjnXxuX680yi.jpg"
          }
          alt="logo"
          style={{ width: 100 }}
        />
        <div style={{ fontWeight: "bold" }}>ម៉ាតវ៉ាន់ស្តុប ខេអេច</div>
        <div style={{ fontSize: 10, color: "#555" }}>POS System</div>
        <div style={{ borderBottom: "1px dashed #000", margin: "6px 0" }} />
      </div>

      {/* Clock */}
      <div style={{ fontSize: 10, marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>កាលបរិច្ឆេទ:</span>
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Items */}
      <table
        style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>មុខទំនិញ</th>
            <th style={{ textAlign: "center" }}>ចំ</th>
            <th style={{ textAlign: "right" }}>តម្លៃ$</th>
            <th style={{ textAlign: "right" }}>Dis%</th>
            <th style={{ textAlign: "right" }}>សរុប$</th>
          </tr>
        </thead>
        <tbody>
          {cartList.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td style={{ textAlign: "center" }}>{item.cart_qty}</td>
              <td style={{ textAlign: "right" }}>
                {Number(item.product_out).toFixed(2)}
              </td>
              <td style={{ textAlign: "right" }}>{item.discount || 0}%</td>
              <td style={{ textAlign: "right" }}>{findTotalUSD(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderBottom: "1px dashed #000", margin: "6px 0" }} />

      {/* Totals */}
      <div style={{ fontSize: 11 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>ចំនួនសរុប:</span>
          <span>{objSummary.total_qty || 0} មុខ</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>បញ្ចុះតម្លៃ:</span>
          <span>${objSummary.save_discount?.toFixed(2) || 0}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          <span>សរុប USD:</span>
          <span>${objSummary.total_price_discount_USD?.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          <span>សរុប KHR:</span>
          <span>៛{khrTotal()}</span>
        </div>

        {objSummary.paid_amount > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>បានទូទាត់:</span>
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
              <span>អាប់:</span>
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

        {objSummary.payment_method && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <span>វិធីទូទាត់:</span>
            <span>{objSummary.payment_method}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px dashed #000",
          marginTop: 8,
          textAlign: "center",
          paddingTop: 6,
        }}
      >
        <p style={{ fontWeight: 600 }}>អរគុណសម្រាប់ការបញ្ជាទិញ!</p>
        <p style={{ fontSize: 10, color: "#666" }}>
          Thank you for your purchase!
        </p>
      </div>
    </div>
  );
};

export default CustomerScreen;
