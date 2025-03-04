import { ref } from "vue";
import type { User } from "../../interfaces/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useUsers = () => {
  const token = ref<string | null>(null);
  const isLoggeddIn = ref<boolean>(false);
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);

  const name = ref<string>("");
  const email = ref<string>("");
  const password = ref<string>("");

  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("lstoken") || "",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.table(errorResponse.error || "Error");
        throw new Error("Failed to login");
      }
      const authResponse = await response.json();
      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      isLoggeddIn.value = true;
      localStorage.setItem("lstoken", authResponse.data.token);
      localStorage.setItem("userIDToken", authResponse.data.userId);
      console.table("User is logged in:", authResponse);
      console.log("Token:", token.value);
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
      isLoggeddIn.value = false;
    }
  };

  // register user
  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const authResponse = await response.json();
      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      localStorage.setItem("lstoken", authResponse.data.token);
      console.table("User is registered:", authResponse);
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    isLoggeddIn.value = false;
    localStorage.removeItem("lstoken");
    localStorage.removeItem("userIDToken");
    console.log("User is logged out");
    }
  return {
    token,
    isLoggeddIn,
    error,
    user,
    name,
    email,
    password,
    fetchToken,
    registerUser,
    logout,
  };
};
