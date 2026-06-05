import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Youtube as YoutubeIcon,
} from 'lucide-react';
import type { SocialLinks as SocialLinksType } from '@/types';
import { cn } from '@/lib/utils';

const SOCIAL_PLATFORMS = [
  { key: 'facebook' as const, label: 'Facebook', icon: FacebookIcon },
  { key: 'twitter' as const, label: 'X', icon: TwitterIcon },
  { key: 'instagram' as const, label: 'Instagram', icon: InstagramIcon },
  { key: 'youTube' as const, label: 'YouTube', icon: YoutubeIcon },
];

interface SocialLinksProps {
  links?: SocialLinksType | null;
  variant?: 'footer' | 'contact';
  className?: string;
}

const SocialLinks = ({ links, variant = 'contact', className }: SocialLinksProps) => {
  if (!links) return null;

  const active = SOCIAL_PLATFORMS.filter((p) => links[p.key]);
  if (active.length === 0) return null;

  const isFooter = variant === 'footer';

  return (
    <div className={cn('flex gap-3', className)}>
      {active.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={
            isFooter
              ? 'p-1.5 md:p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors'
              : 'bg-primary w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity'
          }
        >
          <Icon size={isFooter ? 14 : 20} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
