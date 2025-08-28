import React from 'react';
import { Package, Heart, Star, Calendar, TrendingUp, Award, ShoppingBag } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    totalOrders: number;
    totalSpent: number;
    wishlistItems: number;
    reviewsGiven: number;
    memberSince: string;
    averageOrderValue: number;
    loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      icon: Package,
      label: 'Commandes',
      value: stats.totalOrders,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      icon: TrendingUp,
      label: 'Total dépensé',
      value: `€${stats.totalSpent.toFixed(2)}`,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      icon: ShoppingBag,
      label: 'Panier moyen',
      value: `€${stats.averageOrderValue.toFixed(2)}`,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      icon: Heart,
      label: 'Favoris',
      value: stats.wishlistItems,
      color: 'pink',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      icon: Star,
      label: 'Avis donnés',
      value: stats.reviewsGiven,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      icon: Award,
      label: 'Niveau fidélité',
      value: stats.loyaltyTier,
      color: 'indigo',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Statistiques du compte
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`${item.bgColor} border ${item.borderColor} rounded-xl p-4 text-center hover:shadow-md transition-all duration-300 hover:scale-105`}
            >
              <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {typeof item.value === 'number' && item.value > 999 
                  ? item.value.toLocaleString() 
                  : item.value
                }
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Loyalty Progress */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-primary-800 dark:text-primary-300">
            Progression fidélité
          </h4>
          <span className="text-sm text-primary-600 dark:text-primary-400">
            Niveau {stats.loyaltyTier}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-primary-200 dark:bg-primary-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (stats.totalSpent / getNextTierThreshold(stats.loyaltyTier)) * 100)}%` 
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-primary-600 dark:text-primary-400 mt-2">
            <span>€{stats.totalSpent.toFixed(0)}</span>
            <span>€{getNextTierThreshold(stats.loyaltyTier)}</span>
          </div>
        </div>
        
        <p className="text-sm text-primary-700 dark:text-primary-300 mt-3">
          {stats.loyaltyTier === 'Platinum' 
            ? 'Félicitations ! Vous avez atteint le niveau maximum.'
            : `Plus que €${(getNextTierThreshold(stats.loyaltyTier) - stats.totalSpent).toFixed(2)} pour atteindre le niveau ${getNextTier(stats.loyaltyTier)}`
          }
        </p>
      </div>
    </div>
  );
}

function getNextTierThreshold(currentTier: string): number {
  switch (currentTier) {
    case 'Bronze': return 200;
    case 'Silver': return 500;
    case 'Gold': return 1000;
    case 'Platinum': return 1000;
    default: return 200;
  }
}

function getNextTier(currentTier: string): string {
  switch (currentTier) {
    case 'Bronze': return 'Silver';
    case 'Silver': return 'Gold';
    case 'Gold': return 'Platinum';
    case 'Platinum': return 'Platinum';
    default: return 'Silver';
  }
}