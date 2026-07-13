export type Locale = "en" | "bm" | "zh";

export interface LandingContent {
  chrome: {
    skipLink: string;
    homeLabel: string;
    primaryNavigationLabel: string;
    officialSiteLabel: string;
    growthFact: string;
  };
  meta: {
    title: string;
    description: string;
    language: string;
  };
  nav: {
    menu: string;
    language: string;
    opportunity: string;
    support: string;
    culture: string;
    faq: string;
    apply: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  momentum: {
    title: string;
    body: string;
  };
  opportunity: {
    title: string;
    body: string;
    incomeLabel: string;
    incomeRange: "RM2,500-RM10,000+";
    commissionLabel: string;
    commissionBased: true;
    disclaimer: string;
    guarantee: false;
  };
  support: {
    title: string;
    intro: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  culture: {
    title: string;
    statement: string;
    body: string;
  };
  progression: {
    title: string;
    body: string;
    steps: string[];
  };
  video: {
    title: string;
    description: string;
    playLabel: string;
  };
  candidateFit: {
    title: string;
    intro: string;
    priorities: Array<{
      audience:
        "experiencedSalespeople" | "careerSwitchers" | "ambitiousNewcomers";
      title: string;
      description: string;
    }>;
    notForYouTitle: string;
    notForYou: string;
  };
  form: {
    title: string;
    intro: string;
    fields: Array<{
      key: "name" | "ageRange" | "currentJob" | "location" | "salesExperience";
      label: string;
      placeholder: string;
      required: true;
    }>;
    consent: string;
    submit: string;
    submitting: string;
    success: string;
    failure: string;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  footer: {
    disclaimer: string;
    privacy: string;
    privacyLink: string;
    copyright: string;
  };
}

const en: LandingContent = {
  chrome: { skipLink: "Skip to main content", homeLabel: "Coway recruitment home", primaryNavigationLabel: "Primary navigation", officialSiteLabel: "Coway Malaysia official website", growthFact: "Learn → Lead" },
  meta: {
    title: "Coway Sales Recruitment Malaysia",
    description:
      "Explore a commission-based Coway sales opportunity with training, practical tools, team support, and room to grow.",
    language: "English",
  },
  nav: {
    menu: "Menu",
    language: "Language",
    opportunity: "Opportunity",
    support: "Support",
    culture: "Culture",
    faq: "FAQ",
    apply: "Apply now",
  },
  hero: {
    eyebrow: "Build your sales journey",
    title: "Grow with a Coway sales team in Malaysia",
    subtitle:
      "Turn your drive into a flexible, fully commission-based sales career with training and a team behind you.",
    primaryCta: "See if you are a fit",
    secondaryCta: "Explore the opportunity",
  },
  momentum: {
    title: "Your momentum starts with one conversation",
    body: "Bring your ambition and people skills. We provide a practical environment where you can learn, take action, and improve through real sales experience.",
  },
  opportunity: {
    title: "A performance-led sales opportunity",
    body: "This opportunity is fully commission-based, giving you the flexibility to build your results through consistent sales activity.",
    incomeLabel: "Potential monthly commission income",
    incomeRange: "RM2,500-RM10,000+",
    commissionLabel: "Fully commission-based",
    commissionBased: true,
    disclaimer:
      "Actual income depends on individual sales performance. No income is guaranteed.",
    guarantee: false,
  },
  support: {
    title: "Practical support to help you move forward",
    intro:
      "You will have access to tools, learning, and people who can support your sales development.",
    items: [
      {
        title: "In-depth online sales training",
        description:
          "Learn product communication, prospecting, follow-up, and customer care through structured online training.",
      },
      {
        title: "Collaborative content creation",
        description:
          "Work together on useful, authentic content that supports customer conversations.",
      },
      {
        title: "Multiple active sales funnels",
        description:
          "Use several active channels to find, nurture, and follow up with potential customers.",
      },
      {
        title: "One-click sales information",
        description:
          "Reach essential product and sales information quickly when you need it.",
      },
      {
        title: "Coaching and team support",
        description:
          "Get practical guidance, feedback, and encouragement from the team.",
      },
      {
        title: "Leadership development and promotion",
        description:
          "Develop leadership skills and work toward promotion as your capability and contribution grow.",
      },
    ],
  },
  culture: {
    title: "We grow together",
    statement: "There is no me in this team. Only us.",
    body: "We share ideas, celebrate progress, and help one another improve while each person remains responsible for their own performance.",
  },
  progression: {
    title: "A path from learning to leadership",
    body: "Build capability step by step. Progress depends on your development, contribution, and sales performance.",
    steps: [
      "Learn the fundamentals",
      "Build consistent sales habits",
      "Support others and develop leadership",
    ],
  },
  video: {
    title: "See how the team works",
    description:
      "Get a closer look at the learning, collaboration, and day-to-day energy behind the sales journey.",
    playLabel: "Play team video",
  },
  candidateFit: {
    title: "Who we are prioritising",
    intro: "We welcome motivated people, with priority given in this order:",
    priorities: [
      {
        audience: "experiencedSalespeople",
        title: "Experienced salespeople",
        description:
          "You already know how to build trust, follow up, and close sales.",
      },
      {
        audience: "careerSwitchers",
        title: "Career switchers",
        description:
          "You are ready to apply transferable skills in a performance-led sales career.",
      },
      {
        audience: "ambitiousNewcomers",
        title: "Ambitious newcomers",
        description:
          "You are new to sales but coachable, proactive, and ready to learn.",
      },
    ],
    notForYouTitle: "This may not be for you if…",
    notForYou:
      "You expect a fixed salary, guaranteed earnings, or passive income without consistent sales activity.",
  },
  form: {
    title: "Start the conversation",
    intro:
      "Tell us a little about yourself. Your details will only be used to follow up on this opportunity.",
    fields: [
      {
        key: "name",
        label: "Name",
        placeholder: "Your full name",
        required: true,
      },
      {
        key: "ageRange",
        label: "Age range",
        placeholder: "Select your age range",
        required: true,
      },
      {
        key: "currentJob",
        label: "Current job",
        placeholder: "What do you do now?",
        required: true,
      },
      {
        key: "location",
        label: "Malaysian state / location",
        placeholder: "Your state or location",
        required: true,
      },
      {
        key: "salesExperience",
        label: "Sales experience",
        placeholder: "Tell us about your sales experience",
        required: true,
      },
    ],
    consent:
      "I consent to being contacted about this sales opportunity and understand that submitting this form does not guarantee selection or income.",
    submit: "Submit interest",
    submitting: "Submitting…",
    success:
      "Thank you. Your interest has been received and the team will contact you about the next step.",
    failure: "We could not submit your details. Please try again.",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Is there a fixed salary?",
        answer:
          "No. This is a fully commission-based opportunity. Potential monthly commission income is RM2,500-RM10,000+, but actual income depends on individual sales performance and no income is guaranteed.",
      },
      {
        question: "Do I need sales experience?",
        answer:
          "No. Sales experience is not required. What matters most is your ambition, commitment to the industry, and willingness to learn. With the right attitude and consistent action, we can develop your skills and grow together.",
      },
      {
        question: "What training and support will I receive?",
        answer:
          "You can access in-depth online sales training, coaching, team support, collaborative content creation, active sales funnels, and quick sales information.",
      },
      {
        question: "Can I apply from anywhere in Malaysia?",
        answer:
          "Yes. Applications are welcomed from across Malaysia, subject to a conversation about local practical arrangements.",
      },
      {
        question: "Is the work flexible?",
        answer:
          "The sales activity offers flexibility, but meaningful results require consistent prospecting, follow-up, and customer support.",
      },
      {
        question: "Can I progress into leadership?",
        answer:
          "Leadership development and promotion opportunities are available as your capability, contribution, and performance grow.",
      },
      {
        question: "What happens after I apply?",
        answer:
          "The team will review your details and, if there is a potential fit, contact you for a conversation about the opportunity and next steps.",
      },
    ],
  },
  footer: {
    disclaimer:
      "Independent sales recruitment information. This is not an official Coway corporate careers website. This opportunity is fully commission-based; actual income depends on individual sales performance and no income is guaranteed.",
    privacy:
      "Your information is used only to respond to your expression of interest.",
    privacyLink: "Privacy information",
    copyright: "Coway sales recruitment Malaysia",
  },
};

const bm: LandingContent = {
  chrome: { skipLink: "Langkau ke kandungan utama", homeLabel: "Laman utama pengambilan Coway", primaryNavigationLabel: "Navigasi utama", officialSiteLabel: "Laman web rasmi Coway Malaysia", growthFact: "Belajar → Memimpin" },
  meta: {
    title: "Pengambilan Jualan Coway Malaysia",
    description:
      "Terokai peluang jualan Coway berasaskan komisen dengan latihan, alat praktikal, sokongan pasukan dan ruang untuk berkembang.",
    language: "Bahasa Malaysia",
  },
  nav: {
    menu: "Menu",
    language: "Bahasa",
    opportunity: "Peluang",
    support: "Sokongan",
    culture: "Budaya",
    faq: "Soalan lazim",
    apply: "Mohon sekarang",
  },
  hero: {
    eyebrow: "Bina perjalanan jualan anda",
    title: "Berkembang bersama pasukan jualan Coway di Malaysia",
    subtitle:
      "Jadikan semangat anda sebuah kerjaya jualan fleksibel yang berasaskan komisen sepenuhnya, dengan latihan dan sokongan pasukan.",
    primaryCta: "Lihat kesesuaian anda",
    secondaryCta: "Terokai peluang ini",
  },
  momentum: {
    title: "Momentum anda bermula dengan satu perbualan",
    body: "Bawa cita-cita dan kemahiran berinteraksi anda. Kami menyediakan persekitaran praktikal untuk anda belajar, bertindak dan maju melalui pengalaman jualan sebenar.",
  },
  opportunity: {
    title: "Peluang jualan berasaskan prestasi",
    body: "Peluang ini berasaskan komisen sepenuhnya, dengan fleksibiliti untuk membina hasil melalui aktiviti jualan yang konsisten.",
    incomeLabel: "Potensi pendapatan komisen bulanan",
    incomeRange: "RM2,500-RM10,000+",
    commissionLabel: "Berasaskan komisen sepenuhnya",
    commissionBased: true,
    disclaimer:
      "Pendapatan sebenar bergantung pada prestasi jualan individu. Tiada pendapatan yang dijamin.",
    guarantee: false,
  },
  support: {
    title: "Sokongan praktikal untuk membantu anda maju",
    intro:
      "Anda akan mendapat akses kepada alat, pembelajaran dan individu yang boleh menyokong perkembangan jualan anda.",
    items: [
      {
        title: "Latihan jualan dalam talian yang mendalam",
        description:
          "Pelajari komunikasi produk, pencarian prospek, susulan dan khidmat pelanggan melalui latihan dalam talian yang tersusun.",
      },
      {
        title: "Penciptaan kandungan secara kolaboratif",
        description:
          "Bekerjasama menghasilkan kandungan berguna dan tulen untuk menyokong perbualan bersama pelanggan.",
      },
      {
        title: "Pelbagai corong jualan aktif",
        description:
          "Gunakan beberapa saluran aktif untuk mencari, memupuk dan membuat susulan dengan bakal pelanggan.",
      },
      {
        title: "Maklumat jualan satu klik",
        description:
          "Akses maklumat produk dan jualan penting dengan pantas apabila diperlukan.",
      },
      {
        title: "Bimbingan dan sokongan pasukan",
        description:
          "Dapatkan panduan praktikal, maklum balas dan galakan daripada pasukan.",
      },
      {
        title: "Pembangunan kepimpinan dan kenaikan pangkat",
        description:
          "Bina kemahiran memimpin dan usahakan kenaikan pangkat seiring perkembangan keupayaan dan sumbangan anda.",
      },
    ],
  },
  culture: {
    title: "Kita berkembang bersama",
    statement: "Tiada “saya” dalam pasukan ini. Hanya “kita”.",
    body: "Kita berkongsi idea, meraikan kemajuan dan saling membantu untuk maju, manakala setiap individu tetap bertanggungjawab atas prestasi sendiri.",
  },
  progression: {
    title: "Laluan daripada pembelajaran kepada kepimpinan",
    body: "Bina keupayaan langkah demi langkah. Kemajuan bergantung pada perkembangan, sumbangan dan prestasi jualan anda.",
    steps: [
      "Pelajari asas",
      "Bina tabiat jualan yang konsisten",
      "Sokong orang lain dan bangunkan kepimpinan",
    ],
  },
  video: {
    title: "Lihat cara pasukan kami bekerja",
    description:
      "Kenali pembelajaran, kerjasama dan tenaga harian di sebalik perjalanan jualan ini.",
    playLabel: "Mainkan video pasukan",
  },
  candidateFit: {
    title: "Calon yang kami utamakan",
    intro:
      "Kami mengalu-alukan individu bermotivasi, dengan keutamaan mengikut susunan berikut:",
    priorities: [
      {
        audience: "experiencedSalespeople",
        title: "Jurujual berpengalaman",
        description:
          "Anda sudah tahu cara membina kepercayaan, membuat susulan dan menutup jualan.",
      },
      {
        audience: "careerSwitchers",
        title: "Individu yang mahu bertukar kerjaya",
        description:
          "Anda bersedia menggunakan kemahiran sedia ada dalam kerjaya jualan berasaskan prestasi.",
      },
      {
        audience: "ambitiousNewcomers",
        title: "Pendatang baharu yang bercita-cita tinggi",
        description:
          "Anda baharu dalam jualan tetapi mudah dibimbing, proaktif dan bersedia untuk belajar.",
      },
    ],
    notForYouTitle: "Ini mungkin bukan untuk anda jika…",
    notForYou:
      "Anda mengharapkan gaji tetap, pendapatan terjamin atau pendapatan pasif tanpa aktiviti jualan yang konsisten.",
  },
  form: {
    title: "Mulakan perbualan",
    intro:
      "Kongsikan sedikit maklumat tentang diri anda. Butiran anda hanya akan digunakan untuk tindakan susulan berkenaan peluang ini.",
    fields: [
      {
        key: "name",
        label: "Nama",
        placeholder: "Nama penuh anda",
        required: true,
      },
      {
        key: "ageRange",
        label: "Julat umur",
        placeholder: "Pilih julat umur anda",
        required: true,
      },
      {
        key: "currentJob",
        label: "Pekerjaan semasa",
        placeholder: "Apakah pekerjaan anda sekarang?",
        required: true,
      },
      {
        key: "location",
        label: "Negeri / lokasi di Malaysia",
        placeholder: "Negeri atau lokasi anda",
        required: true,
      },
      {
        key: "salesExperience",
        label: "Pengalaman jualan",
        placeholder: "Ceritakan pengalaman jualan anda",
        required: true,
      },
    ],
    consent:
      "Saya bersetuju untuk dihubungi tentang peluang jualan ini dan memahami bahawa penghantaran borang ini tidak menjamin pemilihan atau pendapatan.",
    submit: "Hantar minat",
    submitting: "Sedang dihantar…",
    success:
      "Terima kasih. Minat anda telah diterima dan pasukan akan menghubungi anda tentang langkah seterusnya.",
    failure: "Butiran anda tidak dapat dihantar. Sila cuba lagi.",
  },
  faq: {
    title: "Soalan lazim",
    items: [
      {
        question: "Adakah terdapat gaji tetap?",
        answer:
          "Tidak. Ini ialah peluang berasaskan komisen sepenuhnya. Potensi pendapatan komisen bulanan ialah RM2,500-RM10,000+, tetapi pendapatan sebenar bergantung pada prestasi jualan individu dan tiada pendapatan yang dijamin.",
      },
      {
        question: "Adakah saya memerlukan pengalaman jualan?",
        answer:
          "Tidak. Pengalaman jualan tidak diperlukan. Yang paling penting ialah cita-cita anda, komitmen terhadap industri ini dan kesediaan untuk belajar. Dengan sikap yang betul dan tindakan yang konsisten, kita boleh membina kemahiran anda dan berkembang bersama.",
      },
      {
        question: "Apakah latihan dan sokongan yang akan saya terima?",
        answer:
          "Anda boleh mengakses latihan jualan dalam talian yang mendalam, bimbingan, sokongan pasukan, penciptaan kandungan bersama, corong jualan aktif dan maklumat jualan pantas.",
      },
      {
        question: "Bolehkah saya memohon dari mana-mana lokasi di Malaysia?",
        answer:
          "Ya. Permohonan dialu-alukan dari seluruh Malaysia, tertakluk pada perbualan tentang urusan praktikal setempat.",
      },
      {
        question: "Adakah kerja ini fleksibel?",
        answer:
          "Aktiviti jualan menawarkan fleksibiliti, tetapi hasil yang bermakna memerlukan pencarian prospek, susulan dan khidmat pelanggan yang konsisten.",
      },
      {
        question: "Bolehkah saya maju ke peranan kepimpinan?",
        answer:
          "Peluang pembangunan kepimpinan dan kenaikan pangkat tersedia seiring perkembangan keupayaan, sumbangan dan prestasi anda.",
      },
      {
        question: "Apakah yang berlaku selepas saya memohon?",
        answer:
          "Pasukan akan menyemak butiran anda dan, jika terdapat potensi kesesuaian, menghubungi anda untuk berbincang tentang peluang serta langkah seterusnya.",
      },
    ],
  },
  footer: {
    disclaimer:
      "Maklumat pengambilan jualan bebas. Ini bukan laman kerjaya korporat rasmi Coway. Peluang ini berasaskan komisen sepenuhnya; pendapatan sebenar bergantung pada prestasi jualan individu dan tiada pendapatan yang dijamin.",
    privacy:
      "Maklumat anda hanya digunakan untuk membalas pernyataan minat anda.",
    privacyLink: "Maklumat privasi",
    copyright: "Pengambilan jualan Coway Malaysia",
  },
};

const zh: LandingContent = {
  chrome: { skipLink: "跳至主要内容", homeLabel: "Coway 招聘主页", primaryNavigationLabel: "主导航", officialSiteLabel: "Coway 马来西亚官方网站", growthFact: "学习 → 领导" },
  meta: {
    title: "Coway 马来西亚销售招募",
    description:
      "探索以佣金为基础的 Coway 销售机会，并获得培训、实用工具、团队支持及成长空间。",
    language: "简体中文",
  },
  nav: {
    menu: "菜单",
    language: "语言",
    opportunity: "机会",
    support: "支持",
    culture: "文化",
    faq: "常见问题",
    apply: "立即申请",
  },
  hero: {
    eyebrow: "开启你的销售之路",
    title: "加入马来西亚 Coway 销售团队，一起成长",
    subtitle:
      "在培训与团队支持下，将你的动力转化为灵活、完全以佣金为基础的销售事业。",
    primaryCta: "看看你是否适合",
    secondaryCta: "了解这个机会",
  },
  momentum: {
    title: "你的动力，从一次交流开始",
    body: "带上你的抱负与沟通能力。我们提供务实的环境，让你通过真实销售经验学习、行动并持续进步。",
  },
  opportunity: {
    title: "以业绩为导向的销售机会",
    body: "此机会完全以佣金为基础，让你能灵活地通过持续的销售行动创造业绩。",
    incomeLabel: "潜在每月佣金收入",
    incomeRange: "RM2,500-RM10,000+",
    commissionLabel: "完全以佣金为基础",
    commissionBased: true,
    disclaimer: "实际收入取决于个人销售业绩。不保证任何收入。",
    guarantee: false,
  },
  support: {
    title: "助你前进的实用支持",
    intro: "你将获得销售发展所需的工具、学习资源和团队支持。",
    items: [
      {
        title: "深入的线上销售培训",
        description:
          "通过系统化线上培训，学习产品沟通、开发客户、跟进及客户服务。",
      },
      {
        title: "协作创作内容",
        description: "团队共同制作实用、真实的内容，帮助你与客户沟通。",
      },
      {
        title: "多个活跃销售漏斗",
        description: "使用多个活跃渠道寻找、培育并跟进潜在客户。",
      },
      {
        title: "一键获取销售信息",
        description: "在需要时快速取得重要的产品与销售信息。",
      },
      {
        title: "教练指导与团队支持",
        description: "从团队获得务实指导、反馈和鼓励。",
      },
      {
        title: "领导力发展与晋升",
        description: "随着能力与贡献提升，培养领导技能并争取晋升。",
      },
    ],
  },
  culture: {
    title: "我们共同成长",
    statement: "这个团队里没有“我”，只有“我们”。",
    body: "我们分享想法、庆祝进步并互相帮助成长，同时每个人仍须为自己的业绩负责。",
  },
  progression: {
    title: "从学习走向领导的成长路径",
    body: "一步一步培养能力。你的发展取决于个人成长、贡献及销售业绩。",
    steps: ["学习基本功", "建立稳定的销售习惯", "支持他人并培养领导力"],
  },
  video: {
    title: "看看团队如何协作",
    description: "进一步了解这段销售旅程背后的学习、协作和日常活力。",
    playLabel: "播放团队视频",
  },
  candidateFit: {
    title: "我们优先考虑的人选",
    intro: "我们欢迎积极进取的人，并按以下顺序优先考虑：",
    priorities: [
      {
        audience: "experiencedSalespeople",
        title: "有经验的销售人员",
        description: "你已经懂得建立信任、持续跟进和完成销售。",
      },
      {
        audience: "careerSwitchers",
        title: "准备转行的人士",
        description: "你准备好把可转移技能运用在以业绩为导向的销售事业中。",
      },
      {
        audience: "ambitiousNewcomers",
        title: "有抱负的销售新人",
        description: "你虽没有销售经验，但愿意接受指导、主动行动并认真学习。",
      },
    ],
    notForYouTitle: "如果你有以下期待，这可能不适合你……",
    notForYou:
      "你期待固定薪资、保证收入，或不持续进行销售活动也能获得被动收入。",
  },
  form: {
    title: "开始交流",
    intro: "请简单介绍自己。你的资料只会用于跟进此销售机会。",
    fields: [
      { key: "name", label: "姓名", placeholder: "你的全名", required: true },
      {
        key: "ageRange",
        label: "年龄范围",
        placeholder: "选择你的年龄范围",
        required: true,
      },
      {
        key: "currentJob",
        label: "目前职业",
        placeholder: "你目前从事什么工作？",
        required: true,
      },
      {
        key: "location",
        label: "马来西亚州属／地点",
        placeholder: "你的州属或地点",
        required: true,
      },
      {
        key: "salesExperience",
        label: "销售经验",
        placeholder: "请介绍你的销售经验",
        required: true,
      },
    ],
    consent:
      "我同意团队就此销售机会与我联系，并了解提交此表格不保证获选或获得任何收入。",
    submit: "提交意向",
    submitting: "正在提交……",
    success: "谢谢。我们已收到你的意向，团队将与你联系并说明下一步。",
    failure: "无法提交你的资料，请重试。",
  },
  faq: {
    title: "常见问题",
    items: [
      {
        question: "有固定薪资吗？",
        answer:
          "没有。这是完全以佣金为基础的机会。潜在每月佣金收入为 RM2,500-RM10,000+，但实际收入取决于个人销售业绩，并且不保证任何收入。",
      },
      {
        question: "我需要销售经验吗？",
        answer:
          "不需要。销售经验并非必要条件。我们更看重你对这份事业的企图心、投入和学习意愿。只要保持正确的态度并持续行动，我们就能一起提升你的能力，共同成长。",
      },
      {
        question: "我会获得哪些培训和支持？",
        answer:
          "你可获得深入的线上销售培训、教练指导、团队支持、协作内容创作、活跃销售漏斗和快速销售信息。",
      },
      {
        question: "马来西亚各地都可以申请吗？",
        answer:
          "可以。我们欢迎马来西亚各地人士申请，具体安排会根据当地实际情况进一步沟通。",
      },
      {
        question: "工作时间灵活吗？",
        answer:
          "销售活动具有灵活性，但要取得实际成果，仍需要持续开发客户、跟进和提供客户支持。",
      },
      {
        question: "我可以晋升到领导岗位吗？",
        answer:
          "随着你的能力、贡献和业绩成长，你将有机会接受领导力发展并争取晋升。",
      },
      {
        question: "申请后会有什么下一步？",
        answer:
          "团队会审核你的资料；如果初步合适，我们会联系你，进一步讨论这个机会和后续步骤。",
      },
    ],
  },
  footer: {
    disclaimer:
      "独立销售招募信息。本网站并非 Coway 官方企业招聘网站。此机会完全以佣金为基础；实际收入取决于个人销售业绩，并且不保证任何收入。",
    privacy: "你的资料只会用于回复你的应征意向。",
    privacyLink: "隐私信息",
    copyright: "Coway 马来西亚销售招募",
  },
};

export const locales: Record<Locale, LandingContent> = { en, bm, zh };

export const applicationInterim: Record<Locale, string> = {
  en: "The application form is being prepared and will be available here shortly. No details can be submitted yet.",
  bm: "Borang permohonan sedang disediakan dan akan tersedia di sini tidak lama lagi. Tiada butiran boleh dihantar buat masa ini.",
  zh: "\u7533\u8bf7\u8868\u683c\u6b63\u5728\u51c6\u5907\u4e2d\uff0c\u5c06\u5f88\u5feb\u5728\u6b64\u63d0\u4f9b\u3002\u76ee\u524d\u5c1a\u65e0\u6cd5\u63d0\u4ea4\u4efb\u4f55\u8d44\u6599\u3002",
};

export function getContent(locale: Locale): LandingContent {
  return locales[locale];
}
