import { ref, watch } from "vue";

import type { CartItem, OrderItems } from "../../interfaces/interfaces";

const cart = ref<CartItem[]>(
  JSON.parse(localStorage.getItem("cart") || "[]")
);
export const useCart = () => {
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const existingItem = cart.value.find((item) => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log("Updated quantity", existingItem);
    } else {
      cart.value.push({ ...product, quantity: 1 });
      console.log("Added new item to cart", cart.value);
    }
    localStorage.setItem("cart", JSON.stringify(cart.value));
    console.log("Added to cart:", cart.value);
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.value.find((item) => item._id === productId);
    if (existingItem) {
      if (existingItem) {
        cart.value = cart.value.filter((item) => item._id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart.value));
      } else {
      }
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.find((item) => item._id === productId);
    localStorage.setItem("cart", JSON.stringify(cart.value));
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      } else {
        localStorage.setItem("cart", JSON.stringify(cart.value));
      }
    }
    console.log(`UpdateQuantity: ${productId}, Qty ${quantity}`);
  };

  const cartTotal = (): number => {
    return Number(
      cart.value
        .reduce((acc, item) => acc + item.price * item.quantity, 0)
        .toFixed(2)
    );
  };

  const cartTotalIndividualProduct = (productId: string) => {
    const item = cart.value.find((item) => item._id === productId);
    return item ? item.price * item.quantity : 0;
  };

  const salesTax = (): number => {
    const taxRates = 0.25;
    return Math.round(cartTotal() * taxRates * 100) / 100;
  };

  const code = ref<string>("");

  const couponCodeDiscount = (codes: string) => {
   const couponeCodeAccepted = codes === "DISCOUNT";
   return couponeCodeAccepted ? 0.9 : 1;
  }

  const grandTotal = ():number => {
    return Number(((cartTotal() + salesTax()) * couponCodeDiscount(code.value)).toFixed(2));
  }

  const orders = ref<OrderItems[]>(JSON.parse(localStorage.getItem("orders") || "[]"));

  watch(orders, (newOrders) => {
    localStorage.setItem('orders', JSON.stringify(newOrders));
  }, { deep: true })

  const checkOutBuy = () => {
    const newOrder: OrderItems = {
      _id: `order-${orders.value.length + 1}`,
      orderDate: new Date().toISOString(),
      total: cartTotal(),
      orderStatus: "Processing",
      orderNumber: orders.value.length + 1,
      userName: "John Doe",
      orderLine: cart.value.map(item => ({
        product: {
          _id: item._id,
          name: item.name,
          description: '',
          price: item.price,
          imageURL: item.imageURL,
          quantity: item.quantity,
          stock: 0,
          discount: false,
          discountPct: 0,
          isHidden: false,
          _createdBy: '',
        },
        quantity: item.quantity,
      })),
    }
    orders.value.push(newOrder);
    cart.value = [];
    localStorage.setItem("cart", JSON.stringify(cart.value));
    console.log("Order placed:", orders.value);
    localStorage.setItem("orders", JSON.stringify(orders.value));
  }


  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    salesTax,
    code,
    grandTotal,
    cartTotalIndividualProduct,
    checkOutBuy,
    couponCodeDiscount,
    orders,
  };
};
