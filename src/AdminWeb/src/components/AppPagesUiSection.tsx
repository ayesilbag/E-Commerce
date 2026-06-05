import { useMemo, useState } from 'react';
import { validateAppPagesJson } from '../constants/storefront-app-pages';

type Props = {
  value: string;
  onChange: (next: string) => void;
};

export default function AppPagesUiSection({ value, onChange }: Props) {
  const [parseError, setParseError] = useState<string | null>(null);

  const error = useMemo(() => validateAppPagesJson(value), [value]);

  const handleChange = (next: string) => {
    onChange(next);
    setParseError(validateAppPagesJson(next));
  };

  return (
    <>
      <p className="field-hint" style={{ marginBottom: 12 }}>
        Giriş, hesap, mağaza, sepet, ödeme ve ürün sayfalarındaki tüm metinler. Boş bırakılırsa
        ilgili metinler mağazada gösterilmez. Örnek JSON için <code>docs/APP_PAGES_UI.md</code> dosyasına bakın.
      </p>
      <div className="field">
        <label htmlFor="app-pages-json">AppPagesUi JSON</label>
        <textarea
          id="app-pages-json"
          rows={18}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='{ "global": { "loadingLabel": "Yükleniyor..." }, ... }'
          spellCheck={false}
          style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}
        />
        {(parseError || error) && (
          <p className="field-hint" style={{ color: 'var(--danger, #c62828)' }}>
            JSON hatası: {parseError || error}
          </p>
        )}
      </div>
    </>
  );
}
