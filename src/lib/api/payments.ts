import { apiFetch } from './client';
import type { Payment } from '@/lib/types';

export function createPayment(bookingId: string) {
  return apiFetch<{ paymentId: string; transactionId: string; gatewayPageURL: string }>(
    '/payments/create',
    { method: 'POST', body: JSON.stringify({ bookingId }) }
  );
}

export function getMyPayments() {
  return apiFetch<Payment[]>('/payments');
}

export function getPaymentById(id: string) {
  return apiFetch<Payment>(`/payments/${id}`);
}
