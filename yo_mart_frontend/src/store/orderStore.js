import { create } from "zustand";

export const useOrderStore = create((set, get) => ({
  // ── Orders ──
  orders: [],
  loadingOrders: false,
  currentOrder: [],
  modalVisible: false,

  // ── POS Cart ──
  cartList: [],
  objSummary: {
    save_discount: 0,
    total_price: 0,
    total_price_discount_USD: 0,
    total_price_discount_KHR: 0,
    total_qty: 0,
    remark: null,
    paid_amount: 0,
    customer_id: null,
    payment_method: null,
    order_num: null,
    order_date: null,
  },

  // ── Orders Actions ──
  setOrders: (orders) => set({ orders }),
  setLoadingOrders: (loading) => set({ loadingOrders: loading }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setModalVisible: (visible) => set({ modalVisible: visible }),

  // ── Cart Actions ──
  addToCart: (item) => {
    const cart = [...get().cartList];
    const idx = cart.findIndex((r) => r.id === item.id);
    let noStock = false;

    if (idx === -1) {
      if (item.qty > 0) cart.push({ ...item, cart_qty: 1 });
      else noStock = true;
    } else {
      cart[idx] = { ...cart[idx], cart_qty: cart[idx].cart_qty + 1 };
      if (item.qty < cart[idx].cart_qty) noStock = true;
    }

    if (!noStock) set({ cartList: cart });
    return !noStock;
  },

  increaseCart: (index) => {
    const cart = [...get().cartList];
    cart[index].cart_qty += 1;
    set({ cartList: cart });
  },

  decreaseCart: (index) => {
    const cart = [...get().cartList];
    if (cart[index].cart_qty > 1) cart[index].cart_qty -= 1;
    set({ cartList: cart });
  },

  removeCartItem: (id) => {
    const cart = get().cartList.filter((i) => i.id !== id);
    set({ cartList: cart });
  },

  clearCart: () => {
    set({
      cartList: [],
      objSummary: {
        save_discount: 0,
        total_price: 0,
        total_price_discount_USD: 0,
        total_price_discount_KHR: 0,
        total_qty: 0,
        remark: null,
        paid_amount: 0,
        customer_id: null,
        payment_method: null,
        order_num: null,
        order_date: null,
      },
    });
  },

  calculateSummary: () => {
    const rate = 4000;
    const cart = get().cartList;
    let qty = 0,
      sub = 0,
      orig = 0;

    cart.forEach((item) => {
      qty += item.cart_qty;
      let fp = Number(item.product_out);
      if (item.discount && Number(item.discount) !== 0)
        fp -= (fp * Number(item.discount)) / 100;
      orig += item.cart_qty * Number(item.product_out);
      sub += item.cart_qty * fp;
    });

    set({
      objSummary: {
        ...get().objSummary,
        total_qty: qty,
        sub_total: sub.toFixed(2),
        save_discount: (orig - sub).toFixed(2),
        total: sub.toFixed(2),
        total_price_discount_USD: sub.toFixed(2),
        total_price_discount_KHR: (sub * rate).toLocaleString(),
      },
    });
  },

  setObjSummary: (objSummary) => set({ objSummary }),
}));
