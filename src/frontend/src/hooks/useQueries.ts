import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Product, Order, UserProfile, OrderId, ProductId, NewOrder } from '../backend';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: ProductId) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProduct(id);
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.length > 0,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<OrderId, Error, NewOrder>({
    mutationFn: async (orderData: NewOrder) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrder(orderId: OrderId) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getOrder(orderId);
      } catch (error) {
        console.error('Error fetching order:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}

export function useGetCustomerOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ['orders', 'customer'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        const principal = identity.getPrincipal();
        return await actor.getCustomerOrders(principal);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
