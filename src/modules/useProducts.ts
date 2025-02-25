import { ref } from "vue";
import type { Product } from "../interfaces/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useProducts = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: Product[] = await response.json();
      products.value = data;
      console.table(products.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };
  return {
    error,
    loading,
    products,
    fetchProducts,
  };
};
