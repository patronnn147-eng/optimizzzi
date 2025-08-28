import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Lock, 
  Eye, 
  EyeOff,
  CreditCard,
  Package,
  Heart,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { useUserStats } from '../hooks/useUserStats';
import LoadingSpinner from '../components/LoadingSpinner';
import OrderStatusBadge from '../components/OrderStatusBadge';
import ProductCard from '../components/ProductCard';
import ProfileOverview from '../components/Profile/ProfileOverview';
import ProfileImageUpload from '../components/Profile/ProfileImageUpload';
import AddressManager from '../components/Profile/AddressManager';
import AccountSecurity from '../components/Profile/AccountSecurity';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  imageUrl: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const { state, dispatch } = useApp();
  const { user } = state;
  const { orders, loading: ordersLoading } = useOrders(user?.id);
  const { products } = useProducts();
  const { stats: userStats, loading: statsLoading } = useUserStats(user?.id);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    phone: '',
    imageUrl: ''
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [addresses, setAddresses] = useState<any[]>([]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        imageUrl: user.imageUrl || ''
      });
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const validateProfileForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!profileForm.fullName.trim()) {
      errors.fullName = 'Le nom complet est requis';
    }
    
    if (!profileForm.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!profileForm.phone.trim()) {
      errors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.phone)) {
      errors.phone = 'Format de téléphone invalide';
    }
    
    if (profileForm.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(profileForm.imageUrl)) {
      errors.imageUrl = 'URL d\'image invalide';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Update user profile
      await userService.updateUserProfile(user!.id, {
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        imageUrl: profileForm.imageUrl
      });
      
      // Update local state
      dispatch({
        type: 'SET_USER',
        payload: {
          ...user!,
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          imageUrl: profileForm.imageUrl
        }
      });
      
      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      setSuccess('Mot de passe modifié avec succès !');
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setValidationErrors({});
    setError(null);
    
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        imageUrl: user.imageUrl || ''
      });
    }
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const wishlistProducts = products.filter(product => 
    state.wishlist.includes(product.id)
  );

  const recentOrders = orders.slice(0, 5);

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'orders', label: 'Mes commandes', icon: Package },
    { id: 'wishlist', label: 'Liste de souhaits', icon: Heart },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  if (!state.isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Connectez-vous pour accéder à votre profil</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Veuillez vous connecter pour voir et gérer vos informations de profil</p>
            <Link
              to="/signin"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Bonjour, {user.fullName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Gérez votre profil et vos préférences
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <Shield className="w-4 h-4" />
                  <span>Compte vérifié</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">{success}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-8">
            <nav className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <ProfileOverview user={user} />
          )}

          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Historique des commandes
                </h2>
                <Link
                  to="/orders"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Voir tout</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Aucune commande pour l'instant
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Commencez à commander vos produits préférés !
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  >
                    Parcourir les produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Commande #{order.id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <OrderStatusBadge status={order.status} />
                          <p className="text-lg font-bold text-primary-500 mt-1">
                            €{order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Paiement: {order.paymentMethod}
                          </span>
                        </div>
                        <Link
                          to={`/order-confirmation/${order.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          Voir les détails
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Ma liste de souhaits
                </h2>
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Voir tout</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Votre liste de souhaits est vide
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Ajoutez des produits à votre liste de souhaits pour les retrouver facilement
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  >
                    Découvrir les produits
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.slice(0, 6).map((product) => (
                    <ProductCard key={product.id} product={product} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <AddressManager 
              addresses={state.deliveryAddress ? [state.deliveryAddress] : []}
              onAddressUpdate={(newAddresses) => {
                if (newAddresses.length > 0) {
                  dispatch({ type: 'SET_DELIVERY_ADDRESS', payload: newAddresses[0] });
                }
              }}
            />
          )}

          {activeTab === 'settings' && (
            <AccountSecurity />
          )}
        </div>
      </div>
    </div>
  );
}