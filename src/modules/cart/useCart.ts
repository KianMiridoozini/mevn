import { ref } from "vue";

import type { CartItem } from "../../interfaces/interfaces";

export const useCart = () => {
  const cart = ref<CartItem[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
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

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    salesTax,
    code,
    grandTotal,
    cartTotalIndividualProduct
  };
};
