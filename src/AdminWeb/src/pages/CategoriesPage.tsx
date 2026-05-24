import { FormEvent, useEffect, useState } from 'react';
import { api, uploadImage } from '../api/client';
import { IconCategories, IconPlus, IconUpload } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
};

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<{ success: boolean; data: Category[] }>('/api/admin/categories');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name, slug: slug || undefined, image, displayOrder, isActive: true }),
      });
      setName('');
      setSlug('');
      setImage('');
      setDisplayOrder(0);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata');
    }
  };

  const onUpload = async (file: File) => {
    const result = await uploadImage(file, 'categories');
    setImage(result.url);
  };

  const remove = async (id: string) => {
    if (!confirm('Kategori silinsin mi?')) return;
    await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <>
      <PageHeader title="Kategoriler" subtitle="Ürün kategorilerinizi düzenleyin" />

      <div className="form-layout" style={{ gridTemplateColumns: '360px 1fr' }}>
        <div className="card">
          <h3 className="card-title">Yeni kategori</h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="cat-name">Ad *</label>
              <input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="cat-slug">Slug</label>
              <input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="otomatik oluşturulur" />
            </div>
            <div className="field">
              <label htmlFor="cat-order">Sıra</label>
              <input id="cat-order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Görsel</label>
              <div className="upload-zone">
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
                <div className="upload-zone-icon">
                  <IconUpload size={24} />
                </div>
                <div className="upload-zone-text">Görsel yükle</div>
              </div>
              {image && <img src={image} alt="" className="thumb-lg" style={{ marginTop: '0.75rem' }} />}
            </div>
            {error && <div className="error-banner">{error}</div>}
            <button type="submit" className="btn btn-primary">
              <IconPlus size={18} />
              Ekle
            </button>
          </form>
        </div>

        <div className="card card-flush">
          {loading ? (
            <div className="loading-state">
              <span className="spinner" />
              Yükleniyor...
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <IconCategories size={28} />
              </div>
              <h3>Kategori yok</h3>
              <p>Sol taraftan ilk kategorinizi ekleyin.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Görsel</th>
                    <th>Ad</th>
                    <th>Slug</th>
                    <th>Sıra</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id}>
                      <td>{c.image ? <img src={c.image} alt="" className="thumb" /> : <div className="thumb" />}</td>
                      <td className="product-name">{c.name}</td>
                      <td className="muted">{c.slug}</td>
                      <td>{c.displayOrder}</td>
                      <td>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
