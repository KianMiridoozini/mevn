<template>
  <div class="p-4 flex">
    <div class="w-2/3">
      <h2 class="text-2xl font-bold mb-4">Order History</h2>
      <p v-if="orders.length === 0"  class="text-center">No orders found</p> <!-- If there are no orders -->
      <div  v-if="orders.length > 0" > <!-- If there are orders -->
        <div v-for="order in orders" :key="order._id" class="mb-8 border-b pb-4"> <!-- Loop through the orders -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="font-semibold">Order ID: {{ order._id }} </p> <!-- Order ID -->
              <p class="text-gray-500">Order Date: {{ new Date(order.orderDate).toLocaleString() }} </p> <!-- Order Date -->
            </div>
            <div>       
              <p class="text-gray-500">
                User: {{ order.userName }} (ID: {{ order.userId }})<!-- Display user information -->
              </p>
              <p class="font-semibold">Order Total: ${{ order.total.toFixed(2) }}</p> <!-- Order Total with .toFixed() -->
              <select   class="border p-1 text-[#181818] rounded" v-model="order.status" @change="updateOrderStatus(order._id, order.status)"> <!-- Order Status -->
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button   class="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-600" @click="archiveOrder(order._id)">Archive</button> <!-- Archive button -->
            </div>
          </div>
          <div>
            <div v-for="item in order.items" :key="item.productId" class="flex items-center mb-4"> <!-- Loop through the order items -->
              <!-- First Column: Image -->
              <div class="w-1/6">
                <img :src="item.imageURL" alt="Product Image" class="w-full h-24 object-cover rounded-lg"> <!-- Product image -->
              </div>
              <!-- Second Column: Title and Description -->
              <div class="w-2/6 px-4">
                <p class="font-semibold"> {{ item.name }} </p> <!-- Product name -->
              </div>
              <!-- Third Column: Quantity -->
              <div class="w-1/6 text-center">
                <p   class="mx-2"> {{ item.quantity }} </p> <!-- Quantity with v-html -->
              </div>
              <!-- Fourth Column: Price -->
              <div class="w-1/6 text-right">
                <p class="font-semibold">$ {{ item.price.toFixed(2) }}</p> <!-- Price with .toFixed() -->
              </div>
              <!-- Fifth Column: Total Price -->
              <div class="w-1/6 text-right">
                <p class="font-semibold">$ {{ (item.price * item.quantity).toFixed(2) }}</p> <!-- Total price with .toFixed() -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 pl-4">
      <h2 class="text-2xl font-bold mb-4">Revenue</h2>
      <p class="text-xl font-semibold">Total Revenue: $ {{ totalRevenue().toFixed(2) }}</p> <!-- Total Revenue with .toFixed() -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrders } from "../../modules/orders/useOrders";

const { orders, updateOrderStatus, archiveOrder, totalRevenue } = useOrders();

</script>

<style scoped>
/* Add your styles here */
</style>
