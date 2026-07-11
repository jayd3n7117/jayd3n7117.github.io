import { generatedVideo } from './video.generated';

export type LocalizedAlt = Readonly<{ en: string; bm: string; zh: string }>;

export type ImageSource = Readonly<{ src: string; width: number }>;

export type MediaImage = Readonly<{
  src: string;
  width: number;
  height: number;
  alt: LocalizedAlt;
  sources: Readonly<{
    webp: readonly ImageSource[];
    avif: readonly ImageSource[];
  }>;
}>;

const responsive = (
  name: string,
  width: number,
  height: number,
  alt: LocalizedAlt,
): MediaImage => ({
  src: `/media/${name}-960.webp`,
  width: 960,
  height: Math.round((height / width) * 960),
  alt,
  sources: {
    webp: [640, 960, 1440].map((candidate) => ({
      src: `/media/${name}-${candidate}.webp`,
      width: candidate,
    })),
    avif: [640, 960, 1440].map((candidate) => ({
      src: `/media/${name}-${candidate}.avif`,
      width: candidate,
    })),
  },
});

const teamGathering = responsive('team-gathering', 4032, 3024, {
  en: 'Team members posing together indoors',
  bm: 'Ahli pasukan bergambar bersama di dalam bangunan',
  zh: '团队成员在室内合影',
});

export const media = {
  logo: {
    src: '/media/coway-logo.png',
    width: 1390,
    height: 340,
    alt: { en: 'Coway', bm: 'Coway', zh: 'Coway' },
    sources: {
      webp: [{ src: '/media/coway-logo.webp', width: 1390 }],
      avif: [{ src: '/media/coway-logo.avif', width: 1390 }],
    },
  },
  hero: teamGathering,
  culture: [
    teamGathering,
    responsive('team-social-gathering', 4032, 3024, {
      en: 'Team members gathered around tables indoors',
      bm: 'Ahli pasukan berkumpul di sekeliling meja di dalam bangunan',
      zh: '团队成员在室内围桌合影',
    }),
    responsive('team-meeting', 4032, 3024, {
      en: 'Team members posing around a meeting table',
      bm: 'Ahli pasukan bergambar di sekeliling meja mesyuarat',
      zh: '团队成员围着会议桌合影',
    }),
    responsive('team-outdoor-activity', 1280, 960, {
      en: 'Team members wearing helmets during an outdoor activity',
      bm: 'Ahli pasukan memakai topi keledar semasa aktiviti luar',
      zh: '团队成员在户外活动中佩戴头盔',
    }),
  ],
  achievements: [
    responsive('promotion-stage-photo', 1280, 960, {
      en: 'Four people holding a certificate on a promotion stage',
      bm: 'Empat orang memegang sijil di pentas kenaikan pangkat',
      zh: '四人在晋升舞台上手持证书合影',
    }),
    responsive('certificate-group-photo', 4032, 3024, {
      en: 'Group holding certificates on a Coway stage',
      bm: 'Kumpulan memegang sijil di pentas Coway',
      zh: '一群人在 Coway 舞台上手持证书合影',
    }),
    responsive('manager-promotion-graphic', 900, 794, {
      en: 'Manager promotion announcement graphic',
      bm: 'Grafik pengumuman kenaikan pangkat pengurus',
      zh: '经理晋升公告图',
    }),
  ],
  video: {
    ...generatedVideo,
    available: true,
    width: 1280,
    height: 720,
    alt: {
      en: 'Team video',
      bm: 'Video pasukan',
      zh: '团队视频',
    },
  },
} as const;
