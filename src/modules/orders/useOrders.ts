// src/modules/orders/useOrders.ts
import { ref } from "vue";
import type { Order } from "../../interfaces/interfaces";

// Load existing orders from localStorage, or initialize as an empty array.
const orders = ref<Order[]>(JSON.parse(localStorage.getItem("orders") || "[]"));

export const useOrders = () => {
  // Adds a new order to the orders list and persists it in localStorage.
  const addOrder = (order: Order) => {
    orders.value.push(order);
    localStorage.setItem("orders", JSON.stringify(orders.value));
  };

  // Updates the status of a specific order (e.g., Processing, Shipped, Delivered).
  const updateOrderStatus = (orderId: string, newStatus: "Processing" | "Shipped" | "Delivered") => {
    const order = orders.value.find((o) => o._id === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem("orders", JSON.stringify(orders.value));
    }
  };

  // Archives (or removes) an order from the orders list.
  const archiveOrder = (orderId: string) => {
    orders.value = orders.value.filter((o) => o._id !== orderId);
    localStorage.setItem("orders", JSON.stringify(orders.value));
  };

  // Optionally, calculate total revenue from all orders.
  const totalRevenue = (): number => {
    return orders.value.reduce((acc, order) => acc + order.total, 0);
  };

  return {
    orders,
    addOrder,
    updateOrderStatus,
    archiveOrder,
    totalRevenue
  };
};
