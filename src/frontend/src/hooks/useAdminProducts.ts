import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductId } from '../backend';

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<ProductId, Error, { name: string; price: bigint; image: string; description: string }>({
    mutationFn: async ({ name, price, image, description }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(name, price, image, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: ProductId; name: string; price: bigint; image: string; description: string }>({
    mutationFn: async ({ id, name, price, image, description }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, name, price, image, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSetProductAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: ProductId; available: boolean }>({
    mutationFn: async ({ id, available }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProductAvailability(id, available);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
