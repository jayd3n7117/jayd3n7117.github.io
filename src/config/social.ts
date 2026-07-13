export type SocialPlatformId = 'facebook' | 'instagram' | 'tiktok' | 'xiaohongshu';

export type SocialProfile = Readonly<{
  id: SocialPlatformId;
  label: string;
  url: string;
}>;

export const socialProfiles: readonly SocialProfile[] = [
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/share/19WmC6tBsQ/' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/heipige_choy?igsh=eWc2YjFienF5bHdi' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@captain.choy?_r=1&_t=ZS-97zTdFNzYhw' },
  { id: 'xiaohongshu', label: 'Xiaohongshu', url: 'https://xhslink.com/m/2fkDxBavMuL' },
];

export function getSocialLinkAttributes(url: string) {
  const href = url.trim();
  return href
    ? ({ href, target: '_blank', rel: 'noopener noreferrer' } as const)
    : null;
}
