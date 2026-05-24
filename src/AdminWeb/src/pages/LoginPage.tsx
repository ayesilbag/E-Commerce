import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('administrator@localhost');
  const [password, setPassword] = useState('Administrator1!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-hero">
        <div className="login-hero-content">
          <h1>Mağazanızı tek yerden yönetin</h1>
          <p>Ürünler, kategoriler ve kargo ayarlarınızı modern bir panelden kontrol edin.</p>
        </div>
        <p className="login-hero-footer">Digitalep E-Commerce Admin</p>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <h2>Hoş geldiniz</h2>
          <p className="subtitle">Yönetim paneline giriş yapın</p>

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@firma.com"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="error-banner">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
