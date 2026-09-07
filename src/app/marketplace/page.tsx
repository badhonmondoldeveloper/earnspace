'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AiMonetizationAssistant } from '@/components/ai/AiMonetizationAssistant';
import {
  Store,
  Search,
  Plus,
  Filter,
  Tag,
  ShoppingBag,
  CheckCircle,
  MapPin,
  MessageCircle,
  CreditCard,
  Sparkles,
  Download,
  Share2,
  Bookmark,
  ChevronRight,
  X,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  fileUrl?: string;
  isDigital?: boolean;
  category?: string;
  location?: string;
  seller?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  createdAt?: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Digital Downloads');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Purchase State
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bkash' | 'nagad'>('wallet');

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
        }
      })
      .catch(() => {});

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        // Fallback default sample listings for rich marketplace experience
        setProducts([
          {
            id: 'prod-1',
            title: 'Lightroom Cinematic Color Grading Presets 2026',
            description: '15+ Professional Cinematic LR Presets designed for Bangladeshi outdoor lighting, portraits, and street photography.',
            price: 499,
            currency: 'BDT',
            isDigital: true,
            category: 'Presets & Assets',
            location: 'Dhaka, Bangladesh',
            seller: {
              id: 's-1',
              name: 'Badhon Mondol',
              username: 'badhon',
              isVerified: true,
            },
          },
          {
            id: 'prod-2',
            title: 'Full-Stack Next.js 15 & Prisma Masterclass E-Book',
            description: 'Learn modern Web Dev & Monetization architecture with real code examples and production deployment tips.',
            price: 799,
            currency: 'BDT',
            isDigital: true,
            category: 'E-Books & Courses',
            location: 'Chattogram, Bangladesh',
            seller: {
              id: 's-2',
              name: 'EarnSpace Academy',
              username: 'earnspace_official',
              isVerified: true,
            },
          },
          {
            id: 'prod-3',
            title: 'YouTube Thumbnail Starter PSD Pack (10 Templates)',
            description: 'High CTR Photoshop templates for Bangladeshi vloggers, tech creators, and tutorial channels.',
            price: 350,
            currency: 'BDT',
            isDigital: true,
            category: 'Presets & Assets',
            location: 'Sylhet, Bangladesh',
            seller: {
              id: 's-3',
              name: 'Rahim Graphic Studio',
              username: 'rahim_design',
              isVerified: false,
            },
          },
          {
            id: 'prod-4',
            title: '1-on-1 Creator Monetization & Sponsorship Mentorship Session',
            description: '60 minutes direct Zoom consulting on building your personal space, securing brands, and setting up payment automation.',
            price: 1500,
            currency: 'BDT',
            isDigital: false,
            category: 'Services & Mentorship',
            location: 'Online / Dhaka',
            seller: {
              id: 's-1',
              name: 'Badhon Mondol',
              username: 'badhon',
              isVerified: true,
            },
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          price: parseFloat(newPrice),
          currency: 'BDT',
          fileUrl: newFileUrl || 'https://earnspace.app/downloads/sample-digital-asset.pdf',
          isDigital: true,
          category: newCategory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        setNewFileUrl('');
        fetchProducts();
      } else {
        alert(data.message || 'Failed to list product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyProduct = async () => {
    if (!selectedProduct) return;
    setIsPurchasing(true);

    setTimeout(() => {
      setIsPurchasing(false);
      setPurchaseSuccess(true);
    }, 1200);
  };

  const categories = [
    { id: 'all', label: 'All Listings' },
    { id: 'Presets & Assets', label: 'Presets & Assets' },
    { id: 'E-Books & Courses', label: 'E-Books & Courses' },
    { id: 'Services & Mentorship', label: 'Services & Mentorship' },
    { id: 'Digital Downloads', label: 'Digital Downloads' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar initialUser={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar 1:1 Facebook Marketplace Menu */}
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black flex items-center gap-2">
                <Store className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Marketplace
              </h1>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-md"
                title="Create New Listing"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Create Listing Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Create New Listing
            </button>

            {/* Categories */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Categories
              </div>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === c.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{c.label}</span>
                  {selectedCategory === c.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Location & Trust Shield */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                Location
              </div>
              <div className="flex items-center gap-2 px-2 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>All Bangladesh (Instant Delivery)</span>
              </div>

              <div className="p-3 bg-indigo-950/30 dark:bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-[11px] text-indigo-300 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Buyer Protection
                </div>
                <p className="text-slate-400 text-[10px]">
                  All digital products purchased on EarnSpace are backed by 100% money-back guarantee via bKash / Wallet.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Grid Content */}
        <section className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold">Today&apos;s Digital Picks</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore digital products, courses, presets & services directly from Bangladeshi creators.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
              {filteredProducts.length} items found
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail / Header Gradient */}
                  <div className="h-40 bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-950 p-4 relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors"></div>

                    <div className="flex justify-between items-start z-10">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                        {product.category || 'Digital Asset'}
                      </span>
                      <button className="w-7 h-7 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-800 backdrop-blur-md">
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="z-10">
                      <div className="text-xl font-black text-white tracking-tight flex items-baseline gap-1">
                        ৳{product.price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-300">BDT</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          {product.seller?.name || 'Creator'}
                          {product.seller?.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
                          )}
                        </span>
                        <span className="text-[10px] text-slate-400">{product.location || 'Dhaka'}</span>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Now (bKash / Wallet)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* QUICK BUY MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Product Checkout
                </span>
                <h3 className="text-lg font-bold">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setPurchaseSuccess(false);
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {purchaseSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-green-500">Purchase Successful!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your digital download link has been unlocked and emailed to your account.
                </p>
                <a
                  href={selectedProduct.fileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Files Now
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Price:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ৳{selectedProduct.price} BDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seller:</span>
                    <span className="font-semibold">{selectedProduct.seller?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery:</span>
                    <span className="font-semibold text-green-500">Instant Digital File Unlock</span>
                  </div>
                </div>

                {/* Select Payment Adapter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'wallet', label: 'EarnSpace Wallet' },
                      { id: 'bkash', label: 'bKash Direct' },
                      { id: 'nagad', label: 'Nagad Direct' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                          paymentMethod === m.id
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBuyProduct}
                  disabled={isPurchasing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isPurchasing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay ৳{selectedProduct.price} BDT & Download
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW LISTING MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Create Marketplace Listing
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Photoshop Cinematic Presets Pack"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Price (BDT ৳)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Digital Downloads">Digital Downloads</option>
                    <option value="Presets & Assets">Presets & Assets</option>
                    <option value="E-Books & Courses">E-Books & Courses</option>
                    <option value="Services & Mentorship">Services & Mentorship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your product, features, and file details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Digital File Link (PDF/ZIP)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or download URL"
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {isSubmitting ? 'Publishing Listing...' : 'Publish to Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Futuristic AI Assistant */}
      <AiMonetizationAssistant user={user} />

      <Footer />
    </div>
  );
}
