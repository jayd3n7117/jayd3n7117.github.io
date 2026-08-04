export type TrustLocale = 'en' | 'bm' | 'zh';

interface RecruitmentTrustCopy {
  disclosure: string;
  reviewer: string;
  disclosureLabel: string;
}

export const recruitmentTrust: Record<TrustLocale, RecruitmentTrustCopy> = {
  en: {
    disclosure:
      'Coway Sales Career is an independent recruitment website operated by a Coway sales team in Malaysia. It is not the official corporate website of Coway (Malaysia) Sdn. Bhd.',
    reviewer:
      'Applications are reviewed by our sales leadership team. If there is a potential fit, we will contact you to discuss the opportunity.',
    disclosureLabel: 'Website status',
  },
  bm: {
    disclosure:
      'Coway Sales Career ialah laman web pengambilan bebas yang dikendalikan oleh pasukan jualan Coway di Malaysia. Ia bukan laman web korporat rasmi Coway (Malaysia) Sdn. Bhd.',
    reviewer:
      'Permohonan disemak oleh pasukan kepimpinan jualan kami. Jika terdapat potensi kesesuaian, kami akan menghubungi anda untuk berbincang tentang peluang ini.',
    disclosureLabel: 'Status laman web',
  },
  zh: {
    disclosure:
      'Coway Sales Career 是由马来西亚 Coway 销售团队运营的独立招聘网站。它不是 Coway (Malaysia) Sdn. Bhd. 的官方企业网站。',
    reviewer:
      '申请将由我们的销售领导团队审核。如有潜在匹配，我们会联系你进一步讨论这个机会。',
    disclosureLabel: '网站性质说明',
  },
};
