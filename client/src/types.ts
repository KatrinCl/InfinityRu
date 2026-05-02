import type { AxiosInstance } from "axios";
import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";

export interface User {
  id: number;
  name: string;
  email: string;
  cartData?: CartItems;
}

export interface Product {
  id: number;
  name: string;
  composition: string;
  weight: number;
  weight1: number;
  weight2: number;
  price: number;
  category: string;
  image: string[];
  popular: boolean;
}

export type CartItems = Record<string, number>;

export interface AppContextValue {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  cartItems: CartItems;
  setCartItems: Dispatch<SetStateAction<CartItems>>;
  products: Product[];
  axios: AxiosInstance;
  fetchUser: () => Promise<void>;
  getProductData: () => Promise<void>;
  getUserCart: () => Promise<void>;
  addToCart: (itemId: number | string) => Promise<void>;
  removeFromCart: (itemId: number | string) => Promise<void>;
  getCartItemCount: (itemId: number | string) => number;
  getCartCount: () => number;
  getCartAmount: () => number;
  backendUrl: string;
  navigate: NavigateFunction;
  showUserLogin: boolean;
  setShowUserLogin: Dispatch<SetStateAction<boolean>>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  user?: User;
  products?: Product[];
  cartData?: CartItems;
  orders?: T[];
}
