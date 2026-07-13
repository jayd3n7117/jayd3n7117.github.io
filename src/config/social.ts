export type SocialPlatformId = 'facebook' | 'instagram' | 'tiktok' | 'xiaohongshu';

export type SocialProfile = Readonly<{
  id: SocialPlatformId;
  label: string;
  url: string;
}>;

export const socialProfiles: readonly SocialProfile[] = [
  { id: 'facebook', label: 'Facebook', url: '' },
  { id: 'instagram', label: 'Instagram', url: '' },
  { id: 'tiktok', label: 'TikTok', url: '' },
  { id: 'xiaohongshu', label: 'Xiaohongshu', url: '' },
];

export function getSocialLinkAttributes(url: string) {
  const href = url.trim();
  return href
    ? ({ href, target: '_blank', rel: 'noopener noreferrer' } as const)
    : null;
}
