import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Sparkles, Check, X, Upload } from 'lucide-react';
import { api, getFullImageUrl } from '../../services/api';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: '',
    discount_price: '',
    size_ml: 100,
    concentration: 'Extrait de Parfum (40% Oil)',
    short_description: '',
    full_description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    longevity: '24+ Hours Nuclear',
    sillage: 'Magnetic Aura',
    stock_status: 'in_stock',
    stock_quantity: 50,
    is_featured: 1,
    is_active: 1,
    main_image: '/uploads/bnb-gold-intense.svg',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProducts();
      if (res?.data) setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      tagline: '',
      price: '',
      discount_price: '',
      size_ml: 100,
      concentration: 'Extrait de Parfum (40% Oil)',
      short_description: '',
      full_description: '',
      top_notes: '',
      heart_notes: '',
      base_notes: '',
      longevity: '24+ Hours Nuclear',
      sillage: 'Magnetic Aura',
      stock_status: 'in_stock',
      stock_quantity: 50,
      is_featured: 1,
      is_active: 1,
      main_image: '/uploads/bnb-gold-intense.svg',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      ...p,
      discount_price: p.discount_price || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this perfume from the archives?')) {
      try {
        await api.deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await api.toggleFeatured(id);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await api.uploadImage(fd);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, main_image: res.url }));
      } else {
        alert(res.message || 'Upload failed');
      }
    } catch (err) {
      alert(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-2xl font-black text-cream-50 uppercase tracking-wider">
            Perfumes Management
          </h1>
          <p className="text-xs text-cream-300 mt-1">Add, edit, and curate all fragrances visible in the boutique.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark-950 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-gold-glow"
        >
          <Plus className="w-4 h-4" /> Add New Perfume
        </button>
      </div>

      {/* Table */}
      <div className="luxury-glass rounded-2xl overflow-hidden border border-dark-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950 text-gold-400 font-cinzel uppercase tracking-wider border-b border-dark-800">
              <tr>
                <th className="p-4">Visual</th>
                <th className="p-4">Perfume Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Concentration</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-dark-800/40 transition-colors">
                  <td className="p-4">
                    <img
                      src={getFullImageUrl(p.main_image)}
                      alt={p.name}
                      className="w-10 h-14 object-contain bg-dark-950 rounded p-1"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-cinzel font-bold text-cream-50 text-sm">{p.name}</div>
                    <div className="text-[10px] text-cream-300">{p.size_ml} ML</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gold-300">₹{Number(p.discount_price || p.price).toLocaleString('en-IN')}</div>
                    {p.discount_price && (
                      <div className="text-[10px] text-cream-300 line-through">₹{Number(p.price).toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td className="p-4 text-cream-200">{p.concentration}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeatured(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider ${
                        Number(p.is_featured) === 1
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          : 'bg-dark-950 text-cream-300 border border-dark-800'
                      }`}
                    >
                      {Number(p.is_featured) === 1 ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold ${
                      Number(p.is_active) === 1 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {Number(p.is_active) === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg border border-dark-700 hover:border-gold-400 text-cream-200 hover:text-gold-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg border border-dark-700 hover:border-red-400 text-cream-200 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-dark-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-dark-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 text-cream-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-dark-800">
              <h2 className="font-cinzel text-lg font-bold text-cream-50 uppercase tracking-wider">
                {editingProduct ? 'Edit Fragrance Details' : 'Add New Fragrance'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-cream-300 hover:text-gold-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Image Upload Row */}
              <div className="flex items-center gap-5 p-3 rounded-xl bg-dark-950 border border-dark-800">
                <img
                  src={getFullImageUrl(formData.main_image)}
                  alt="Preview"
                  className="w-14 h-20 object-contain rounded bg-dark-900 p-1"
                />
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">
                    Perfume Bottle Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-cream-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-cinzel file:bg-gold-500 file:text-dark-950 cursor-pointer"
                  />
                  {uploadingImage && <span className="text-[10px] text-gold-400 block mt-1">Uploading to /uploads...</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Perfume Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Size (ML)</label>
                  <input
                    type="number"
                    value={formData.size_ml}
                    onChange={(e) => setFormData({ ...formData, size_ml: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Concentration</label>
                <input
                  type="text"
                  value={formData.concentration}
                  onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                  placeholder="Extrait de Parfum (40% Oil)"
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Top Notes</label>
                  <input
                    type="text"
                    value={formData.top_notes}
                    onChange={(e) => setFormData({ ...formData, top_notes: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Heart Notes</label>
                  <input
                    type="text"
                    value={formData.heart_notes}
                    onChange={(e) => setFormData({ ...formData, heart_notes: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-cream-200 uppercase tracking-wider mb-1">Base Notes</label>
                  <input
                    type="text"
                    value={formData.base_notes}
                    onChange={(e) => setFormData({ ...formData, base_notes: e.target.value })}
                    className="w-full bg-dark-950 border border-dark-700 rounded-xl p-2.5 text-cream-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-dark-700 text-cream-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-dark-950 font-cinzel font-bold uppercase tracking-wider shadow-gold-glow"
                >
                  Save Perfume
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
