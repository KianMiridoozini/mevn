import { ref } from "vue";
import type { newProduct, Product } from "../interfaces/interfaces";

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
      console.log(products.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const getTokenAndUserId = (): { token: string, userId: string } => {
    const token = localStorage.getItem("lstoken");
    const userId = localStorage.getItem("userIDToken");
    if (!token) {
      throw new Error("No token found");
    }
    if (!userId) {
      throw new Error("No user id found");
    }
    return { token, userId };
  };
  const validateProduct = (product: newProduct): void => {
    if (!product.name) {
      throw new Error("Product name is required");
    }
  };
  const setDefaultValues = (product: newProduct, userId: string) => {
    return {
      name: product.name,
      description: product.description || "Default description",
      imageURL: product.imageURL || "https://picsum.photos/200/300",
      price: product.price || 100,
      stock: product.stock || 10,
      discount: product.discount || false,
      discountPct: product.discountPct || 0,
      isHidden: product.isHidden || false,
      _createdBy: userId,
    };
  }

  const addProduct = async (product: newProduct): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();
      validateProduct(product);
      const productWithDefaults = setDefaultValues(product, userId);

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(productWithDefaults),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to add product");
      }
      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("Product added:", newProduct);
      await fetchProducts();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };


  const deleteProductFromServer = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });
    if (!response.ok) {
      console.log("Product NOT deleted", id);
      throw new Error("Failed to delete product");
    }
  }

  const removeProductFromState = (id: string): void => {
    products.value = products.value.filter((product) => product._id !== id);
    console.log("Product deleted", id);
  }

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteProductFromServer(id, token);
      console.log("Deleting product with id:", id);
      removeProductFromState(id);

    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  const updateProductOnServer = async (id: string, updatedProduct: Partial<Product>, token: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) {
      throw new Error("No product found");
    }
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    }
    catch {
      return { message: responseText } as unknown as Product;
    }
    // return await response.json();
  }

  const updateProductInState = (id:string, updatedProduct: Product ) => {
    const index = products.value.findIndex((product) => product._id === id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
  }
  const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      const updatedProductResponse = await updateProductOnServer(id, updatedProduct, token);
      updateProductInState(id, updatedProductResponse);
      await fetchProducts();
    }
    catch (err) {
      error.value = (err as Error).message;
    }
  }

  return {
    error,
    loading,
    products,
    fetchProducts,
    deleteProduct,
    addProduct,
    getTokenAndUserId,
    updateProduct
  };
};
