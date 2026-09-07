'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  FileText,
  Search,
  Check,
  Trash2,
  FolderPlus,
  HardDrive,
  Grid,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  purpose?: string;
  createdAt: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string, asset?: MediaAssetItem) => void;
  allowedTypes?: ('image' | 'video' | 'audio' | 'document')[];
  title?: string;
  purpose?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  allowedTypes = ['image', 'video', 'audio', 'document'],
  title = 'Select Media Asset',
  purpose = 'general',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetItem | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMediaAssets();
    }
  }, [isOpen, selectedFileType, searchQuery]);

  const fetchMediaAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedFileType !== 'all') params.set('fileType', selectedFileType);
      if (searchQuery) params.set('search', searchQuery);
      if (purpose) params.set('purpose', purpose);

      const res = await fetch(`/api/v1/media?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setAssets(json.data.assets || []);
      } else {
        setAssets([]);
      }
    } catch (err: any) {
      console.error('Error fetching media:', err);
      setError('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', purpose);

      const res = await fetch('/api/v1/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to upload media');
      }

      const uploadedAsset: MediaAssetItem = json.data;
      setAssets((prev) => [uploadedAsset, ...prev]);
      setSelectedAsset(uploadedAsset);
      setActiveTab('library');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleDeleteAsset = async (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this file from your library?')) return;

    try {
      const res = await fetch(`/api/v1/media/${assetId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setAssets((prev) => prev.filter((a) => a.id !== assetId));
        if (selectedAsset?.id === assetId) setSelectedAsset(null);
      } else {
        alert(json.message || 'Could not delete asset');
      }
    } catch (err) {
      alert('Failed to delete asset');
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAsset) {
      onSelectMedia(selectedAsset.url, selectedAsset);
      onClose();
    } else if (customUrlInput.trim()) {
      onSelectMedia(customUrlInput.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'library'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            My Media Library
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 py-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Device Upload
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'upload' ? (
            /* Upload Tab */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all flex flex-col items-center justify-center min-h-[300px] ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={allowedTypes.map((t) => `${t}/*`).join(',')}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <p className="text-slate-300 font-medium">Uploading and validating asset...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    Drag and drop your file here
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    Supports JPG, PNG, WEBP, GIF, MP4, MP3, PDF up to 100MB with automatic magic-byte security checks.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg transition-all"
                  >
                    Select File from Device
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Media Gallery Library Tab */
            <div className="flex flex-col gap-4">
              {/* Search & Type Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {['all', 'image', 'video', 'document'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFileType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        selectedFileType === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 font-medium">No media assets found</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Upload your first file using the Device Upload tab above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[380px] overflow-y-auto pr-1">
                  {assets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const isImage = asset.fileType === 'image' || asset.mimeType.startsWith('image/');
                    const isVideo = asset.fileType === 'video' || asset.mimeType.startsWith('video/');

                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer aspect-square bg-slate-950 transition-all ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isImage ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : isVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-indigo-400">
                            <Film className="w-8 h-8 mb-1" />
                            <span className="text-[10px] text-slate-400 px-2 truncate max-w-full">
                              {asset.name}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400">
                            <FileText className="w-8 h-8 mb-1" />
                            <span className="text-[10px] text-slate-400 px-2 truncate max-w-full">
                              {asset.name}
                            </span>
                          </div>
                        )}

                        {/* Selection Overlay Check */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}

                        {/* Delete Button on Hover */}
                        <button
                          onClick={(e) => handleDeleteAsset(asset.id, e)}
                          className="absolute top-2 left-2 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* External URL Fallback Input */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Or specify an external direct media URL:
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              value={customUrlInput}
              onChange={(e) => {
                setCustomUrlInput(e.target.value);
                if (e.target.value) setSelectedAsset(null);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <span className="text-xs text-slate-400">
            {selectedAsset ? `Selected: ${selectedAsset.name}` : customUrlInput ? 'Using Direct URL' : 'No file selected'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedAsset && !customUrlInput.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium shadow-lg transition-all"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
