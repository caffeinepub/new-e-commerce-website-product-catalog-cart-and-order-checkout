import type { CartItem } from './CartContext';

const CART_STORAGE_KEY = 'shophub_cart';

export function saveCart(items: CartItem[]): void {
  try {
    const serialized = items.map((item) => ({
      ...item,
      productId: item.productId.toString(),
      price: item.price.toString(),
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

export function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      productId: BigInt(item.productId),
      price: BigInt(item.price),
    }));
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
}

export function clearCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}
