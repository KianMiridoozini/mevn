import { reactive, watch } from "vue";

// initialize isLoggedIn from localStorage or default to false
const isLoggedInFromStorage = localStorage.getItem("isLoggedIn") === "true" 
export const state = reactive({
  isLoggeddIn: isLoggedInFromStorage,
  
});

// watch for changes to isLoggeddIn and update localStorage
watch(() => state.isLoggeddIn, (newValue) => {
    localStorage.setItem("isLoggedIn", String(newValue));
});