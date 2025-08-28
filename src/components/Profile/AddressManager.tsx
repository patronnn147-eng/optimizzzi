import React, { useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { userService, DeliveryAddress } from '../../services/userService';

interface AddressManagerProps {
  addresses: DeliveryAddress[];
  onAddressUpdate: (addresses: DeliveryAddress[]) => void;
}

export default function AddressManager({ addresses, onAddressUpdate }: AddressManagerProps) {
  const { state } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<DeliveryAddress>({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.user) return;
    
    setLoading(true);
    
    try {
      let updatedAddresses;
      
      if (editingIndex !== null) {
        // Update existing address
        updatedAddresses = [...addresses];
        updatedAddresses[editingIndex] = formData;
      } else {
        // Add new address
        updatedAddresses = [...addresses, formData];
      }
      
      // Save to backend (for now, just save the primary address)
      if (updatedAddresses.length > 0) {
        await userService.saveDeliveryAddress(state.user.id, updatedAddresses[0]);
      }
      
      onAddressUpdate(updatedAddresses);
      handleCancel();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(addresses[index]);
    setIsAdding(true);
  };

  const handleDelete = async (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      onAddressUpdate(updatedAddresses);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      instructions: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Address Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter une adresse</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingIndex !== null ? 'Modifier l\'adresse' : 'Ajouter une nouvelle adresse'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse complète
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="123 Rue de la Paix, Apt 4B"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="75001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pays
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="France">France</option>
                  <option value="Belgium">Belgique</option>
                  <option value="Switzerland">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructions de livraison (optionnel)
              </label>
              <textarea
                rows={3}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Sonnez à la porte, laissez devant, etc."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ajouter une URL d'image
            </h3>
            <div className="space-y-4">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleUrlSubmit}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.map((address, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Adresse {index + 1}
                    {index === 0 && (
                      <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full">
                        Principale
                      </span>
                    )}
                  </h4>
                  <div className="text-gray-600 dark:text-gray-300">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.postalCode}</p>
                    <p>{address.country}</p>
                    {address.instructions && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Instructions: {address.instructions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {addresses.length > 1 && (
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}