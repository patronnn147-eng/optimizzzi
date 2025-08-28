import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Check, AlertTriangle, Clock } from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'profile_update';
  description: string;
  timestamp: string;
  location?: string;
  device?: string;
}

export default function AccountSecurity() {
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [password, setPassword] = useState('');

  // Mock security events - in production, fetch from backend
  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      description: 'Connexion réussie',
      timestamp: new Date().toISOString(),
      location: 'Paris, France',
      device: 'Chrome sur Windows'
    },
    {
      id: '2',
      type: 'profile_update',
      description: 'Profil mis à jour',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      location: 'Paris, France',
      device: 'Chrome sur Windows'
    }
  ];

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    return {
      score,
      checks,
      strength: score <= 2 ? 'Faible' : score <= 3 ? 'Moyen' : score <= 4 ? 'Fort' : 'Très fort',
      color: score <= 2 ? 'red' : score <= 3 ? 'yellow' : score <= 4 ? 'blue' : 'green'
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'login':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'password_change':
        return <Lock className="w-4 h-4 text-blue-500" />;
      case 'profile_update':
        return <Check className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatEventTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Sécurité du compte
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300">Compte sécurisé</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Toutes les vérifications passées</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Mot de passe fort</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">Dernière modification récente</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-300">Email vérifié</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">Adresse confirmée</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Strength Checker */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Vérificateur de mot de passe
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Testez la force de votre mot de passe
            </label>
            <div className="relative">
              <input
                type={showPasswordStrength ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Entrez un mot de passe pour tester sa force"
              />
              <button
                type="button"
                onClick={() => setShowPasswordStrength(!showPasswordStrength)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordStrength ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {password && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Force du mot de passe:
                </span>
                <span className={`text-sm font-semibold ${
                  passwordStrength.color === 'red' ? 'text-red-600' :
                  passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                  passwordStrength.color === 'blue' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.strength}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.color === 'red' ? 'bg-red-500' :
                    passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                    passwordStrength.color === 'blue' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(passwordStrength.checks).map(([check, passed]) => (
                  <div key={check} className={`flex items-center space-x-2 ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${passed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span>
                      {check === 'length' && '8+ caractères'}
                      {check === 'uppercase' && 'Majuscules'}
                      {check === 'lowercase' && 'Minuscules'}
                      {check === 'numbers' && 'Chiffres'}
                      {check === 'symbols' && 'Symboles'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Activité récente
        </h3>
        
        <div className="space-y-4">
          {securityEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex-shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {event.description}
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <p>{formatEventTime(event.timestamp)}</p>
                  {event.location && (
                    <p>📍 {event.location}</p>
                  )}
                  {event.device && (
                    <p>💻 {event.device}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              Recommandations de sécurité
            </h3>
            <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
              <li>• Utilisez un mot de passe unique et fort</li>
              <li>• Activez l'authentification à deux facteurs</li>
              <li>• Vérifiez régulièrement l'activité de votre compte</li>
              <li>• Ne partagez jamais vos identifiants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}