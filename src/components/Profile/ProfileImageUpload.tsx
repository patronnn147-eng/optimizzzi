import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

export default function ProfileImageUpload({ 
  currentImageUrl, 
  onImageChange, 
  className = '' 
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setPreviewUrl(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload to a cloud storage service
      // For now, we'll create a local preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        // In production, upload to cloud storage and get URL
        // onImageChange(uploadedUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <div className="text-white text-center">
            <Camera className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs font-medium">Changer</span>
          </div>
        </div>

        {/* Upload Options */}
        <div className="absolute -bottom-2 -right-2 flex space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors"
            title="Télécharger depuis l'ordinateur"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-600 transition-colors"
            title="Ajouter une URL"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Ajouter une URL d'image
          </h4>
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}