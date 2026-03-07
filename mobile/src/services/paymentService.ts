import { supabase } from '../lib/supabase';

export interface PaymentMethod {
    id: string;
    user_id: string;
    card_type: string;       // visa, mastercard, elo, amex, other
    last4: string;
    holder_name: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
    created_at: string;
}

export interface Payment {
    id: string;
    booking_id: string;
    payment_method_id: string | null;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'refunded' | 'failed';
    gateway: string;
    gateway_ref: string | null;
    paid_at: string | null;
    created_at: string;
}

/**
 * Detect card network from card number prefix (BIN).
 */
export function detectCardType(cardNumber: string): string {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num)) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^6(?:011|5)/.test(num)) return 'discover';
    if (/^(?:606282|3841)/.test(num)) return 'hipercard';
    if (/^4011|^4312|^4389|^4514|^4573|^5041|^5066|^5067|^509/.test(num)) return 'elo';
    return 'other';
}

/**
 * Luhn algorithm validation for card numbers.
 */
export function validateCardNumber(cardNumber: string): boolean {
    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(num) || num.length < 13 || num.length > 19) return false;
    let sum = 0;
    let alternate = false;
    for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}

export const paymentService = {
    /**
     * Get all payment methods for a user, default first
     */
    async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data ?? []) as PaymentMethod[];
    },

    /**
     * Add a new payment method (stores masked data only — no real card numbers)
     */
    async addPaymentMethod(params: {
        userId: string;
        cardNumber: string;
        holderName: string;
        expiryMonth: number;
        expiryYear: number;
        setDefault?: boolean;
    }): Promise<PaymentMethod> {
        const cardType = detectCardType(params.cardNumber);
        const last4 = params.cardNumber.replace(/\s/g, '').slice(-4);

        // If setting as default, unset existing default first
        if (params.setDefault) {
            await supabase
                .from('payment_methods')
                .update({ is_default: false })
                .eq('user_id', params.userId)
                .eq('is_default', true);
        }

        const { data, error } = await supabase
            .from('payment_methods')
            .insert({
                user_id: params.userId,
                card_type: cardType,
                last4,
                holder_name: params.holderName.trim(),
                expiry_month: params.expiryMonth,
                expiry_year: params.expiryYear,
                is_default: params.setDefault ?? false,
            })
            .select()
            .single();

        if (error) throw error;
        return data as PaymentMethod;
    },

    /**
     * Set a payment method as the default (unsets all others first)
     */
    async setDefault(userId: string, methodId: string): Promise<void> {
        await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', userId);

        const { error } = await supabase
            .from('payment_methods')
            .update({ is_default: true })
            .eq('id', methodId)
            .eq('user_id', userId);

        if (error) throw error;
    },

    /**
     * Delete a payment method
     */
    async deletePaymentMethod(methodId: string): Promise<void> {
        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', methodId);

        if (error) throw error;
    },

    /**
     * Get the default payment method for a user (null if none)
     */
    async getDefaultMethod(userId: string): Promise<PaymentMethod | null> {
        const { data } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', userId)
            .eq('is_default', true)
            .single();

        return data as PaymentMethod | null;
    },

    /**
     * Create a payment record for a booking (simulated — no real charge)
     */
    async createPayment(params: {
        bookingId: string;
        paymentMethodId: string | null;
        amount: number;
    }): Promise<Payment> {
        const { data, error } = await supabase
            .from('payments')
            .insert({
                booking_id: params.bookingId,
                payment_method_id: params.paymentMethodId,
                amount: params.amount,
                currency: 'BRL',
                status: 'pending',
                gateway: 'simulated',
            })
            .select()
            .single();

        if (error) throw error;
        return data as Payment;
    },

    /**
     * Mark a payment as paid
     */
    async markPaid(paymentId: string): Promise<void> {
        const { error } = await supabase
            .from('payments')
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .eq('id', paymentId);

        if (error) throw error;
    },

    /**
     * Get payment for a booking
     */
    async getPaymentByBooking(bookingId: string): Promise<Payment | null> {
        const { data } = await supabase
            .from('payments')
            .select('*')
            .eq('booking_id', bookingId)
            .single();

        return data as Payment | null;
    },
};
