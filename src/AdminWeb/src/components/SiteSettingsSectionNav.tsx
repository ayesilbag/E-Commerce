import { SITE_SETTINGS_SECTIONS } from '../constants/site-settings-sections';

export default function SiteSettingsSectionNav() {
  return (
    <nav className="site-settings-nav" aria-label="Site ayarları bölümleri">
      <p className="site-settings-nav-title">Mağaza sayfa sırası</p>
      <ul className="site-settings-nav-list">
        {SITE_SETTINGS_SECTIONS.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className="site-settings-nav-link">
              <span className="site-settings-nav-label">{section.label}</span>
              <span className="site-settings-nav-path">{section.path}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
