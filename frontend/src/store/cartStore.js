import { create } from 'zustand';
import { apiRequest } from '../lib/apiClient';
import { useAuthStore } from './authStore';
import {
  resolveProductId,
  mergeCartItem,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartTotals
} from '../lib/cartCalculations.js';

const useCartStore = create((set, get) => ({
  cart: { items: [], totalPrice: 0 },
  loading: false,
  error: null,

  getCart: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState().accessToken;
      const response = await apiRequest('/api/user/cart', { token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      const msg = error?.message || 'Failed to fetch cart';
      if (msg === 'Unauthorized') {
        set({ error: msg, loading: false });
      } else {
        set({ cart: { items: [], totalPrice: 0 }, loading: false });
      }
    }
  },

  addToCart: async (item) => {
    set({ loading: true, error: null });
    try {
      const currentCart = get().cart;
      const currentItems = currentCart ? [...(currentCart.items || [])] : [];
      const updatedItems = mergeCartItem(currentItems, item);
      const { items: cleanItems, totalPrice } = calculateCartTotals(updatedItems);

      const cartId = currentCart?._id;
      const endpoint = cartId ? `/api/user/cart/${cartId}` : '/api/user/cart';
      const method = cartId ? 'PUT' : 'POST';
      const token = useAuthStore.getState().accessToken;

      const response = await apiRequest(endpoint, { method, body: { items: cleanItems, totalPrice }, token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to add to cart', loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      const currentCart = get().cart;
      const updatedItems = updateCartItemQuantity(currentCart?.items, productId, quantity);
      const { items: cleanItems, totalPrice } = calculateCartTotals(updatedItems);

      const cartId = currentCart?._id;
      const endpoint = cartId ? `/api/user/cart/${cartId}` : '/api/user/cart';
      const method = cartId ? 'PUT' : 'POST';
      const token = useAuthStore.getState().accessToken;

      const response = await apiRequest(endpoint, { method, body: { items: cleanItems, totalPrice }, token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to update quantity', loading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const currentCart = get().cart;
      const updatedItems = removeCartItem(currentCart?.items, productId);
      const { items: cleanItems, totalPrice } = calculateCartTotals(updatedItems);

      const cartId = currentCart?._id;
      const endpoint = cartId ? `/api/user/cart/${cartId}` : '/api/user/cart';
      const method = cartId ? 'PUT' : 'POST';
      const token = useAuthStore.getState().accessToken;

      const response = await apiRequest(endpoint, { method, body: { items: cleanItems, totalPrice }, token });
      set({ cart: response?.cart ?? { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ error: error?.message || 'Failed to remove from cart', loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const cartId = get().cart?._id;
      const token = useAuthStore.getState().accessToken;
      if (cartId) await apiRequest(`/api/user/cart/${cartId}`, { method: 'DELETE', token });
      set({ cart: { items: [], totalPrice: 0 }, loading: false });
    } catch (error) {
      set({ cart: { items: [], totalPrice: 0 }, error: null, loading: false });
    }
  },
}));

export default useCartStore;
