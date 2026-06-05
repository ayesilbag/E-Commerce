import type { ReactNode } from 'react';

type Props = {
  id: string;
  title: string;
  description?: ReactNode;
  path?: string;
  children: ReactNode;
};

export default function SiteSettingsSection({ id, title, description, path, children }: Props) {
  return (
    <section id={id} className="site-settings-section">
      <div className="site-settings-section-header">
        <div className="site-settings-section-heading">
          <h3 className="card-title">{title}</h3>
          {path && <code className="site-settings-path">{path}</code>}
        </div>
        {description && <div className="field-hint site-settings-section-desc">{description}</div>}
      </div>
      {children}
    </section>
  );
}
