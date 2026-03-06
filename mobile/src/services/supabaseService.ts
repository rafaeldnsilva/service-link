import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type BookingStatus = Database['public']['Enums']['booking_status'];

// ============================================
// PROFILE OPERATIONS
// ============================================

export const profileService = {
  /**
   * Fetch a profile by user ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update profile role (client or provider)
   */
  async updateRole(userId: string, role: 'client' | 'provider') {
    return this.updateProfile(userId, { role });
  },

  /**
   * Get all providers
   */
  async getProviders() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'provider');

    if (error) throw error;
    return data;
  },

  /**
   * Get provider by ID with their services and average rating
   */
  async getProviderDetails(providerId: string) {
    const [profileResult, servicesResult, reviewsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', providerId)
        .single(),

      supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId),

      supabase
        .from('reviews')
        .select('rating')
        .eq('provider_id', providerId),
    ]);

    if (profileResult.error) throw profileResult.error;

    const averageRating = reviewsResult.data && reviewsResult.data.length > 0
      ? reviewsResult.data.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewsResult.data.length
      : 0;

    return {
      profile: profileResult.data,
      services: servicesResult.data || [],
      averageRating,
      totalReviews: reviewsResult.data?.length || 0,
    };
  },
};

// ============================================
// SERVICE OPERATIONS
// ============================================

export const serviceService = {
  /**
   * Get all services
   */
  async getAllServices() {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get services by category
   */
  async getServicesByCategory(category: string) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:profiles(*)
      `)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get services by provider
   */
  async getServicesByProvider(providerId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get a single service by ID
   */
  async getService(serviceId: string) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:profiles(*)
      `)
      .eq('id', serviceId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new service (provider only)
   */
  async createService(providerId: string, service: {
    title: string;
    description: string;
    category: string;
    price: number;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('services')
      .insert({
        provider_id: providerId,
        ...service,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a service (provider only)
   */
  async updateService(serviceId: string, updates: Partial<Service>) {
    const { data, error } = await supabase
      .from('services')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a service (provider only)
   */
  async deleteService(serviceId: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
  },

  /**
   * Search services by title or description
   */
  async searchServices(query: string) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        provider:profiles(*)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// ============================================
// BOOKING OPERATIONS
// ============================================

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(booking: {
    client_id: string;
    provider_id: string;
    service_id: string;
    scheduled_at: string;
    total_amount: number;
  }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...booking,
        status: 'pending',
      })
      .select(`
        *,
        service:services(*),
        provider:profiles!bookings_provider_id_fkey(*),
        client:profiles!bookings_client_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get bookings for a client
   */
  async getClientBookings(clientId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*),
        provider:profiles!bookings_provider_id_fkey(*)
      `)
      .eq('client_id', clientId)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get bookings for a provider
   */
  async getProviderBookings(providerId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*),
        client:profiles!bookings_client_id_fkey(*)
      `)
      .eq('provider_id', providerId)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get a single booking by ID
   */
  async getBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*),
        provider:profiles!bookings_provider_id_fkey(*),
        client:profiles!bookings_client_id_fkey(*)
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select(`
        *,
        service:services(*),
        provider:profiles!bookings_provider_id_fkey(*),
        client:profiles!bookings_client_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string) {
    return this.updateBookingStatus(bookingId, 'cancelled');
  },

  /**
   * Accept a booking (provider only)
   */
  async acceptBooking(bookingId: string) {
    return this.updateBookingStatus(bookingId, 'accepted');
  },

  /**
   * Complete a booking
   */
  async completeBooking(bookingId: string) {
    return this.updateBookingStatus(bookingId, 'completed');
  },

  /**
   * Get pending bookings for provider
   */
  async getPendingBookings(providerId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*),
        client:profiles!bookings_client_id_fkey(*)
      `)
      .eq('provider_id', providerId)
      .eq('status', 'pending')
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// ============================================
// REVIEW OPERATIONS
// ============================================

export const reviewService = {
  /**
   * Create a review for a completed booking
   */
  async createReview(review: {
    booking_id: string;
    provider_id: string;
    reviewer_id: string;
    rating: number;
    comment?: string;
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(*),
        provider:profiles!reviews_provider_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get reviews for a provider
   */
  async getProviderReviews(providerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(*),
        booking:bookings(
          service:services(*)
        )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get review by booking ID
   */
  async getReviewByBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  /**
   * Update a review
   */
  async updateReview(reviewId: string, updates: { rating?: number; comment?: string }) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get average rating for a provider
   */
  async getProviderAverageRating(providerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('provider_id', providerId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = data.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = totalRating / data.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: data.length,
    };
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
  bucket: string,
  path: string,
  file: File | Blob,
  contentType: string = 'image/jpeg'
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

/**
 * Get public URL for a storage file
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}
