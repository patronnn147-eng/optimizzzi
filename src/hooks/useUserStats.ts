import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useOrders } from './useOrders';
import { useProducts } from './useProducts';
import { useApp } from '../context/AppContext';

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  reviewsGiven: number;
  memberSince: string;
  lastLogin?: string;
  averageOrderValue: number;
  favoriteCategory?: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export const useUserStats = (userId?: string) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { state } = useApp();
  const { orders } = useOrders(userId);
  const { products } = useProducts();

  useEffect(() => {
    const calculateStats = async () => {
      if (!userId || !state.user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Calculate stats from orders
        const paidOrders = orders.filter(order => order.paymentStatus === 'paid');
        const totalSpent = paidOrders.reduce((sum, order) => sum + order.total, 0);
        const averageOrderValue = paidOrders.length > 0 ? totalSpent / paidOrders.length : 0;

        // Calculate reviews given by this user
        const reviewsGiven = products.reduce((count, product) => 
          count + product.review.filter(review => review.userId === userId).length, 0
        );

        // Determine loyalty tier based on total spent
        let loyaltyTier: UserStats['loyaltyTier'] = 'Bronze';
        if (totalSpent >= 1000) loyaltyTier = 'Platinum';
        else if (totalSpent >= 500) loyaltyTier = 'Gold';
        else if (totalSpent >= 200) loyaltyTier = 'Silver';

        // Find favorite category (most ordered from)
        const categoryCount = new Map<string, number>();
        paidOrders.forEach(order => {
          order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              const count = categoryCount.get(product.categoryId) || 0;
              categoryCount.set(product.categoryId, count + item.quantity);
            }
          });
        });

        let favoriteCategory: string | undefined;
        let maxCount = 0;
        categoryCount.forEach((count, categoryId) => {
          if (count > maxCount) {
            maxCount = count;
            favoriteCategory = categoryId;
          }
        });

        const userStats: UserStats = {
          totalOrders: orders.length,
          totalSpent,
          wishlistItems: state.wishlist.length,
          reviewsGiven,
          memberSince: state.user.createdAt || new Date().toISOString(),
          averageOrderValue,
          favoriteCategory,
          loyaltyTier
        };

        setStats(userStats);
      } catch (err) {
        console.error('Error calculating user stats:', err);
        setError('Failed to calculate user statistics');
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, [userId, orders, products, state.user, state.wishlist]);

  return {
    stats,
    loading,
    error
  };
};