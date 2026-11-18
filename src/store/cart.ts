import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS } from "@/data/products";

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  lastUpdatedAt: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  hasNullPriceItem: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastUpdatedAt: 0,
      addItem: (productId, quantity = 1) => {
        const existsInCatalog = PRODUCTS.some((p) => p.id === productId);
        if (!existsInCatalog || quantity <= 0) return;

        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          const nextItems = existing
            ? state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { productId, quantity }];
          return {
            items: nextItems,
            lastUpdatedAt: Date.now(),
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
          lastUpdatedAt: Date.now(),
        })),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
          lastUpdatedAt: Date.now(),
        }));
      },
      clearCart: () => set({ items: [], lastUpdatedAt: Date.now() }),
      getTotalCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      hasNullPriceItem: () => {
        const currentItems = get().items;
        if (currentItems.length === 0) return true;
        return currentItems.some((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          return !product || product.price === null;
        });
      },
    }),
    {
      name: "bloomcare-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
