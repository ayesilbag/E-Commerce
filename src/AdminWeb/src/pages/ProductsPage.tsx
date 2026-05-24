import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, downloadProductTemplate, importProductsExcel } from '../api/client';
import { IconDownload, IconPlus, IconProducts, IconUpload } from '../components/Icons';
import PageHeader from '../components/PageHeader';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  isActive: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<{ success: boolean; data: { products: Product[] } }>('/api/admin/products?limit=100');
      setProducts(res.data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Bu ürünü silmek istiyor musunuz?')) return;
    await api(`/api/admin/products/${id}`, { method: 'DELETE' });
    await load();
  };

  const onImport = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await importProductsExcel(file);
      setImportResult(res.message + (res.data.errors.length ? `\n${res.data.errors.slice(0, 5).join('\n')}` : ''));
      await load();
    } catch (err) {
      setImportResult(err instanceof Error ? err.message : 'Hata');
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Ürünler"
        subtitle="Mağaza vitrinindeki tüm ürünleri yönetin"
        action={
          <div className="actions header-actions">
            <button type="button" className="btn btn-secondary" onClick={() => downloadProductTemplate()}>
              <IconDownload size={18} />
              <span className="hide-mobile">Şablon</span>
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setImportOpen(true)}>
              <IconUpload size={18} />
              <span className="hide-mobile">Excel</span>
            </button>
            <Link to="/products/new" className="btn btn-primary">
              <IconPlus size={18} />
              <span className="hide-mobile">Yeni ürün</span>
            </Link>
          </div>
        }
      />

      <div className="card card-flush">
        {loading ? (
          <div className="loading-state">
            <span className="spinner" />
            Yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconProducts size={28} />
            </div>
            <h3>Henüz ürün yok</h3>
            <p>Excel ile toplu içe aktarın veya tek tek ekleyin.</p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setImportOpen(true)}>
                Excel içe aktar
              </button>
              <Link to="/products/new" className="btn btn-primary">
                Ürün ekle
              </Link>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th className="col-hide-mobile">SKU</th>
                  <th>Fiyat</th>
                  <th className="col-hide-mobile">Stok</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        {p.image ? <img src={p.image} alt="" className="thumb" /> : <div className="thumb" />}
                        <div>
                          <div className="product-name">{p.name}</div>
                          <div className="product-meta">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="muted col-hide-mobile">{p.sku}</td>
                    <td className="price-cell">{p.price.toFixed(2)} ₺</td>
                    <td className="col-hide-mobile">{p.stock}</td>
                    <td>
                      <span className={`badge ${p.isActive ? 'badge-success' : 'badge-muted'}`}>
                        {p.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <Link to={`/products/${p.id}`} className="btn btn-secondary btn-sm">
                          Düzenle
                        </Link>
                        <button type="button" className="btn btn-danger btn-sm hide-mobile" onClick={() => remove(p.id)}>
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {importOpen && (
        <div className="modal-backdrop" onClick={() => setImportOpen(false)} role="presentation">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Excel ile ürün içe aktar</h3>
            <p className="muted">.xlsx dosyası yükleyin. Önce şablonu indirip doldurmanızı öneririz.</p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
            />
            <div className="actions" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => downloadProductTemplate()}>
                Şablon indir
              </button>
              <button type="button" className="btn btn-primary" disabled={importing} onClick={() => fileRef.current?.click()}>
                {importing ? 'Aktarılıyor...' : 'Dosya seç'}
              </button>
            </div>
            {importResult && <pre className="import-result">{importResult}</pre>}
            <button type="button" className="btn btn-ghost" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setImportOpen(false)}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
