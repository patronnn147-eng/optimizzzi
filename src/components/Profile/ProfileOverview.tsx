import React from 'react';
import { User, Mail, Phone, Calendar, Shield, Award, TrendingUp } from 'lucide-react';
import { User as UserType } from '../../types';
import ProfileStats from './ProfileStats';
import { useUserStats } from '../../hooks/useUserStats';

interface ProfileOverviewProps {
  user: UserType;
}

export default function ProfileOverview({ user }: ProfileOverviewProps) {
  const { stats, loading } = useUserStats(user.id);

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'Gold':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'Silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    }
  };

  const getLoyaltyTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return '💎';
      case 'Gold':
        return '🥇';
      case 'Silver':
        return '🥈';
      default:
        return '🥉';
    }
  };

  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-start space-x-6">
          <div className="relative">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            
            {/* Loyalty Badge */}
            {stats && (
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getLoyaltyTierColor(stats.loyaltyTier)}`}>
                <span className="mr-1">{getLoyaltyTierIcon(stats.loyaltyTier)}</span>
                {stats.loyaltyTier}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user.fullName}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  Membre depuis {new Date().getFullYear()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">Compte vérifié</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                <Award className="w-4 h-4" />
                <span>Programme fidélité</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span>Historique d'achat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && !loading && (
        <ProfileStats stats={stats} />
      )}

      {/* Account Health */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Santé du compte
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">Sécurité</h4>
            <p className="text-sm text-green-600 dark:text-green-400">Excellent</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Profil</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">Complet</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">Fidélité</h4>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              {stats?.loyaltyTier || 'Bronze'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}