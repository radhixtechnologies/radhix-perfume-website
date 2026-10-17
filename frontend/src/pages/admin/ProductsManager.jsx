import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Sparkles, Check, X, Upload, Image, Star } from 'lucide-react';
import { api, getFullImageUrl } from '../../services/api';

const createEmptyFormData = () => ({
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

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [formData, setFormData] = useState(createEmptyFormData);
  const [additionalImages, setAdditionalImages] = useState([]);

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
    setFormData(createEmptyFormData());
    setAdditionalImages([]);
    setSaveMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setSaveMessage('');
    setFormData({
      ...p,
      discount_price: p.discount_price || '',
    });
    setAdditionalImages(Array.isArray(p.additional_images) ? p.additional_images : []);
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
      e.target.value = '';
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      files.forEach((file) => fd.append('images[]', file));
      const res = await api.uploadImage(fd);
      if (!res.success) {
        throw new Error(res.message || 'Failed to upload images');
      }
      const newUrls = res.urls || (res.url ? [res.url] : []);
      if (!newUrls.length) {
        throw new Error('No image URLs returned from server');
      }

      // If current main image is default placeholder, set first uploaded as primary
      if (formData.main_image.includes('bnb-gold-intense.svg')) {
        setFormData((prev) => ({ ...prev, main_image: newUrls[0] }));
        if (newUrls.length > 1) {
          setAdditionalImages((prev) => [...prev, ...newUrls.slice(1)]);
        }
      } else {
        setAdditionalImages((prev) => [...prev, ...newUrls]);
      }
    } catch (err) {
      alert(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSetMainImage = (url) => {
    const currentMain = formData.main_image;
    setFormData((prev) => ({ ...prev, main_image: url }));
    setAdditionalImages((prev) => {
      const filtered = prev.filter((img) => img !== url);
      if (currentMain && !currentMain.includes('bnb-gold-intense.svg') && !filtered.includes(currentMain)) {
        return [currentMain, ...filtered];
      }
      return filtered;
    });
  };

  const handleRemoveAdditionalImage = (indexToRemove) => {
    setAdditionalImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (uploadingImage) {
      alert('Please wait for the image upload to finish before saving.');
      return;
    }

    const addAnother = e.nativeEvent.submitter?.value === 'add-another';
    setIsSaving(true);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, { ...formData, additional_images: additionalImages });
      } else {
        await api.createProduct({ ...formData, additional_images: additionalImages });
      }
      await loadProducts();

      if (addAnother) {
        setFormData(createEmptyFormData());
        setAdditionalImages([]);
        setSaveMessage('Perfume saved. You can add the next one now.');
      } else {
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
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
                    <div className="relative inline-block">
                      <img
                        src={getFullImageUrl(p.main_image)}
                        alt={p.name}
                        className="w-10 h-14 object-contain bg-dark-950 rounded p-1 border border-dark-800"
                      />
                      {p.additional_images && p.additional_images.length > 0 && (
                        <span
                          className="absolute -bottom-1 -right-1 bg-gold-400 text-dark-950 font-black text-[9px] px-1.5 py-0.2 rounded-full font-cinzel shadow-gold-glow"
                          title={`${p.additional_images.length} gallery image(s)`}
                        >
                          +{p.additional_images.length}
                        </span>
                      )}
                    </div>
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
              
              {/* Product Visuals & Multi-Image Gallery */}
              <div className="p-4 rounded-xl bg-dark-950 border border-dark-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-gold-400" />
                      <label className="text-xs font-cinzel font-bold text-cream-50 uppercase tracking-wider">
                        Product Visuals & Multi-Image Gallery
                      </label>
                    </div>
                    <p className="text-[10px] text-cream-300 mt-0.5">
                      Add multiple images for bottle, box packaging, and luxury details.
                    </p>
                  </div>

                  <label className="inline-flex w-fit items-center gap-2 px-3.5 py-2 rounded-xl bg-gold-gradient text-dark-950 text-[10px] font-cinzel font-bold uppercase tracking-wider cursor-pointer shadow-gold-glow hover:scale-105 active:scale-95 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Multiple Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesUpload}
                      disabled={uploadingImage || isSaving}
                      className="sr-only"
                    />
                  </label>
                </div>

                {uploadingImage && (
                  <div className="flex items-center gap-2 text-xs text-gold-400 animate-pulse bg-gold-500/10 px-3 py-2 rounded-lg border border-gold-500/20">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading image(s) to server...</span>
                  </div>
                )}

                {/* Primary Cover Image Preview */}
                <div>
                  <span className="text-[10px] uppercase font-cinzel font-bold text-gold-400 tracking-wider block mb-2">
                    ★ Primary Cover Image (Shown on Shop Cards)
                  </span>
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-dark-900 border border-gold-500/30">
                    <div className="relative w-16 h-20 bg-dark-950 rounded-lg p-1.5 border border-dark-700 shrink-0 flex items-center justify-center">
                      <img
                        src={getFullImageUrl(formData.main_image)}
                        alt="Primary Cover"
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute -top-1.5 -left-1.5 bg-gold-400 text-dark-950 text-[8px] font-black px-1.5 py-0.5 rounded-full font-cinzel shadow">
                        PRIMARY
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-cream-100 font-semibold">Current Main Bottle Photo</p>
                      <p className="text-[10px] text-cream-400 mb-2 truncate">{formData.main_image}</p>
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-700 text-cream-200 hover:text-gold-300 text-[10px] font-cinzel cursor-pointer transition-colors">
                        <Upload className="w-3 h-3" />
                        Replace Primary Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage || isSaving}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Images Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-cinzel font-bold text-cream-300 tracking-wider">
                      Additional Gallery Images ({additionalImages.length})
                    </span>
                    {additionalImages.length > 0 && (
                      <span className="text-[10px] text-gold-400">
                        Click "★ Set Cover" to make any image primary
                      </span>
                    )}
                  </div>

                  {additionalImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {additionalImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="group relative rounded-xl bg-dark-900 border border-dark-700 hover:border-gold-500/50 p-2 flex flex-col items-center justify-between transition-all"
                        >
                          <div className="w-full h-20 flex items-center justify-center p-1">
                            <img
                              src={getFullImageUrl(image)}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-contain rounded"
                            />
                          </div>

                          <div className="w-full flex items-center justify-between gap-1 pt-1.5 border-t border-dark-800">
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(image)}
                              disabled={isSaving || uploadingImage}
                              title="Set as Primary Cover Image"
                              className="text-[9px] text-gold-400 hover:text-gold-200 font-cinzel font-bold uppercase transition-colors"
                            >
                              ★ Set Cover
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(index)}
                              disabled={isSaving || uploadingImage}
                              title="Remove image"
                              className="text-red-400 hover:text-red-300 p-0.5 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-dashed border-dark-700 bg-dark-900/40 text-center">
                      <p className="text-[11px] text-cream-300 font-medium">No additional gallery images added.</p>
                      <p className="text-[10px] text-cream-400 mt-0.5">
                        Click "Upload Multiple Images" above to add more photos of the packaging, side angles, or ingredients.
                      </p>
                    </div>
                  )}
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
                  disabled={isSaving}
                >
                  Cancel
                </button>
                {!editingProduct && (
                  <button
                    type="submit"
                    value="add-another"
                    disabled={isSaving || uploadingImage}
                    className="px-5 py-2.5 rounded-xl border border-gold-500/50 text-gold-300 font-cinzel font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save & Add Another'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving || uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-dark-950 font-cinzel font-bold uppercase tracking-wider shadow-gold-glow disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Perfume'}
                </button>
              </div>

              {saveMessage && (
                <p role="status" className="text-right text-xs text-green-400">
                  {saveMessage}
                </p>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
