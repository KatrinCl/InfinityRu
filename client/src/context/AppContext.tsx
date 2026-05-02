import { createContext, useContext, useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { AppContextValue, CartItems, Product, User } from "../types";

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
axios.defaults.withCredentials = true;

// Добавляем interceptor для игнорирования 401 на /api/user/isAuth
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Игнорируем 401 на /api/user/isAuth
    if (error.response?.status === 401 && error.config?.url?.includes('/api/user/isAuth')) {
      return Promise.resolve({ data: { success: false } });
    }
    return Promise.reject(error);
  }
);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; user?: User }>(`${backendUrl}/api/user/isAuth`);
      if (data.success && data.user) {
        setUser(data.user);
        setCartItems(data.user.cartData || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      // Если interceptor не сработал, обрабатываем 401
      const err = error as AxiosError<{ message?: string }>;
      if (err.response?.status === 401) {
        setUser(null);
        setCartItems({});
      } else {
        console.warn('User auth check failed:', err.message);
        setUser(null);
        setCartItems({});
      }
    }
  };

  const getProductData = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; products?: Product[]; message?: string }>(`${backendUrl}/api/product/list`);
      if (data.success && data.products) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Не удалось загрузить товары");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getUserCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get<{ success: boolean; cartData?: CartItems }>(`${backendUrl}/api/cart/get`);
      if (data.success) setCartItems(data.cartData || {});
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addToCart = async (itemId: number | string) => {
    const key = String(itemId);
    const cartData: CartItems = structuredClone(cartItems);
    cartData[key] = (cartData[key] || 0) + 1;
    setCartItems(cartData);

    if (user) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const removeFromCart = async (itemId: number | string) => {
    const key = String(itemId);
    const cartData: CartItems = structuredClone(cartItems);

    if ((cartData[key] || 0) > 1) {
      cartData[key] -= 1;
    } else {
      delete cartData[key];
    }

    setCartItems(cartData);

    if (user) {
      try {
        await axios.post(`${backendUrl}/api/cart/remove`, { itemId });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const getCartItemCount = (itemId: number | string) => cartItems[String(itemId)] || 0;

  const getCartCount = () => Object.values(cartItems).reduce((acc, count) => acc + count, 0);

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];
      const itemInfo = products.find((product) => product.id === Number(itemId));
      if (itemInfo && quantity > 0) {
        totalAmount += itemInfo.price * quantity;
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    void fetchUser();
    void getProductData();
  }, []);

  useEffect(() => {
    void getUserCart();
  }, [user]);

  const value: AppContextValue = {
    user,
    setUser,
    cartItems,
    setCartItems,
    products,
    axios,
    fetchUser,
    getProductData,
    getUserCart,
    addToCart,
    removeFromCart,
    getCartItemCount,
    getCartCount,
    getCartAmount,
    backendUrl,
    navigate,
    showUserLogin,
    setShowUserLogin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
