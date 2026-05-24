import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, uploadImage } from '../api/client';
import { IconUpload } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type Category = { id: string; name: string };

function reorderArray<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

export default function ProductFormPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryDragOver, setGalleryDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ success: boolean; data: Category[] }>('/api/admin/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isNew && id) {
      api<{ success: boolean; data: Record<string, unknown> }>(`/api/admin/products/${id}`).then((res) => {
        const p = res.data;
        setName(String(p.name ?? ''));
        setSku(String(p.sku ?? ''));
        setCategory(String(p.category ?? ''));
        setDescription(String(p.description ?? ''));
        setPrice(Number(p.price ?? 0));
        setOriginalPrice(p.originalPrice != null ? Number(p.originalPrice) : '');
        setStock(Number(p.stock ?? 0));
        setImage(String(p.image ?? ''));
        setImages(Array.isArray(p.images) ? (p.images as string[]) : []);
        setIsActive(Boolean(p.isActive));
        setIsFeatured(Boolean(p.isFeatured));
      });
    }
  }, [id, isNew]);

  const onUpload = async (file: File, asGallery = false) => {
    setUploading(true);
    setError('');
    try {
      const result = await uploadImage(file, 'products', isNew ? undefined : id);
      if (asGallery) {
        setImages((prev) => [...prev, result.url]);
      } else {
        setImage(result.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası');
    } finally {
      setUploading(false);
    }
  };

  const onGalleryFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) return;

    setUploading(true);
    setError('');
    try {
      const urls: string[] = [];
      for (const file of imageFiles) {
        const result = await uploadImage(file, 'products', isNew ? undefined : id);
        urls.push(result.url);
      }
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası');
    } finally {
      setUploading(false);
    }
  };

  const onGalleryReorder = (from: number, to: number) => {
    if (from === to) return;
    setImages((prev) => reorderArray(prev, from, to));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const body = {
      name,
      sku,
      category,
      description,
      price,
      originalPrice: originalPrice === '' ? null : originalPrice,
      stock,
      image,
      images,
      isActive,
      isFeatured,
    };

    try {
      if (isNew) {
        const res = await api<{ success: boolean; data: { id: string } }>('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        navigate(`/products/${res.data.id}`);
      } else {
        await api(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
        navigate('/products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title={isNew ? 'Yeni ürün' : 'Ürün düzenle'}
        subtitle={isNew ? 'Mağazanıza yeni bir ürün ekleyin' : 'Ürün bilgilerini güncelleyin'}
      />

      <form onSubmit={onSubmit} className="form-layout">
        <div className="card">
          <h3 className="card-title">Temel bilgiler</h3>
          <div className="form-grid">
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="name">Ürün adı *</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="sku">SKU *</label>
                <input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="category">Kategori *</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Kategori seçin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="description">Açıklama</label>
              <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-grid-2">
              <div className="field">
                <label htmlFor="price">Fiyat (₺)</label>
                <input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="originalPrice">Eski fiyat (₺)</label>
                <input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="stock">Stok adedi</label>
              <input id="stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 className="card-title">Görseller</h3>
            <div className="field" style={{ marginBottom: '1rem' }}>
              <label>Kapak görseli</label>
              <div className="upload-zone">
                <input type="file" accept="image/*" disabled={uploading} onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0], false)} />
                <div className="upload-zone-icon">
                  <IconUpload size={28} />
                </div>
                <div className="upload-zone-text">{uploading ? 'Yükleniyor...' : 'Görsel yüklemek için tıklayın'}</div>
                <div className="upload-zone-hint">PNG, JPG veya WebP · max 10MB</div>
              </div>
              {image && <img src={image} alt="" className="thumb-lg" style={{ marginTop: '1rem' }} />}
            </div>
            <div className="field">
              <label>Galeri</label>
              <div
                className={`upload-zone${galleryDragOver ? ' upload-zone--dragover' : ''}`}
                onDragEnter={(e) => {
                  if (e.dataTransfer.types.includes('Files')) setGalleryDragOver(true);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setGalleryDragOver(false);
                }}
                onDragOver={(e) => {
                  if (e.dataTransfer.types.includes('Files')) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setGalleryDragOver(false);
                  if (e.dataTransfer.files.length) {
                    void onGalleryFiles(e.dataTransfer.files);
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={(e) => e.target.files && void onGalleryFiles(e.target.files)}
                />
                <div className="upload-zone-icon">
                  <IconUpload size={28} />
                </div>
                <div className="upload-zone-text">
                  {uploading ? 'Yükleniyor...' : 'Görselleri sürükleyip bırakın veya tıklayın'}
                </div>
                <div className="upload-zone-hint">Birden fazla görsel seçebilirsiniz · PNG, JPG veya WebP</div>
              </div>
              {images.length > 0 && (
                <>
                  <p className="gallery-hint">Sıralamayı değiştirmek için görselleri sürükleyin</p>
                  <div className="gallery-grid">
                    {images.map((url, index) => (
                      <div
                        key={`${index}-${url}`}
                        className={`gallery-item${dragIndex === index ? ' gallery-item--dragging' : ''}${dropIndex === index ? ' gallery-item--drop-target' : ''}`}
                        draggable={!uploading}
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', String(index));
                          setDragIndex(index);
                        }}
                        onDragEnd={() => {
                          setDragIndex(null);
                          setDropIndex(null);
                        }}
                        onDragOver={(e) => {
                          if (dragIndex === null) return;
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          setDropIndex(index);
                        }}
                        onDragLeave={() => {
                          setDropIndex((current) => (current === index ? null : current));
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const from = dragIndex ?? Number(e.dataTransfer.getData('text/plain'));
                          onGalleryReorder(from, index);
                          setDragIndex(null);
                          setDropIndex(null);
                        }}
                      >
                        <img src={url} alt="" className="thumb gallery-item-image" draggable={false} />
                        <span className="gallery-item-index">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Yayın</h3>
            <label className="checkbox-field">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Vitrinde aktif
            </label>
            <label className="checkbox-field" style={{ marginTop: '0.75rem' }}>
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              Öne çıkan ürün
            </label>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
              İptal
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
