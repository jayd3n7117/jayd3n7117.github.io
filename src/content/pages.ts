export const supportingPageKeys = [
  'coway-sales-career',
  'career-change-to-sales',
  'sales-training-leadership',
  'coway-sales-malaysia-locations',
  'application-faq',
] as const;

export type SupportingLocale = 'en' | 'zh';
export type SupportingPageKey = (typeof supportingPageKeys)[number];

export interface SupportingPageContent {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  introduction: string;
  sections: Array<{ id: string; title: string; body: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  cta: { title: string; body: string; label: string };
}

type SupportingPages = Record<
  SupportingLocale,
  Record<SupportingPageKey, SupportingPageContent>
>;

export const supportingPages: SupportingPages = {
  en: {
    'coway-sales-career': {
      meta: {
        title: 'Coway Sales Career Malaysia | Opportunity Guide',
        description:
          'Understand the Coway sales career opportunity in Malaysia, including commission, daily sales activity, training, team support and leadership development.',
      },
      eyebrow: 'Sales career guide',
      title: 'What a Coway sales career involves',
      introduction:
        'A Coway sales career is a performance-led opportunity for people who want practical sales experience, flexible activity and a team environment focused on learning and growth.',
      sections: [
        {
          id: 'role',
          title: 'The work is built around customers',
          body: [
            'The role involves finding potential customers, understanding their needs, explaining suitable Coway products, following up and supporting customers after a decision. Good sales work is not only about presenting a product. It also requires listening, clear communication, reliable follow-up and responsible customer care.',
            'Your daily activity may include prospecting, responding to enquiries, preparing product information, arranging conversations and keeping track of follow-up. The team provides practical resources and guidance, while each salesperson remains responsible for their own activity and customer relationships.',
          ],
        },
        {
          id: 'commission',
          title: 'A fully commission-based opportunity',
          body: [
            'This is not a fixed-salary position. The opportunity is fully commission-based, and actual income depends on individual sales performance. The potential monthly commission range shown on this website is RM2,500-RM10,000+, but no income is guaranteed.',
            'A commission model can offer flexibility and performance upside, but it also requires consistent action. Before applying, consider whether you are prepared to prospect, follow up, learn from feedback and manage periods when results take time to develop.',
          ],
        },
        {
          id: 'support',
          title: 'Training, tools and team support',
          body: [
            'New and experienced salespeople can access online sales training, product information, coaching, content collaboration and practical support for customer conversations. Training can help you understand the process, but improvement still depends on practice and consistent application.',
            'The team culture is designed around shared learning. Members can exchange ideas, review approaches and encourage one another while remaining accountable for their own performance. People who develop capability and contribute to others may also work toward leadership responsibilities.',
          ],
        },
        {
          id: 'fit',
          title: 'Who may find this opportunity suitable',
          body: [
            'The current priority is aspiring team leaders, followed by people seeking a career change, existing salespeople and fresh graduates. Previous sales experience can help, but it is not required. Coachability, initiative, communication and willingness to take action are important.',
            'This opportunity may not suit someone who needs a guaranteed salary, expects passive income or does not want regular customer-facing activity. A first conversation is used to discuss expectations and practical fit before either side decides on next steps.',
          ],
        },
      ],
      faq: [
        { question: 'Is this a fixed-salary job?', answer: 'No. It is a fully commission-based sales opportunity, and no income is guaranteed.' },
        { question: 'Can someone without sales experience apply?', answer: 'Yes. Training and team support are available, but applicants should be ready to learn and take consistent action.' },
        { question: 'Is this the official Coway corporate careers website?', answer: 'No. Coway Sales Career is operated independently by a Coway sales team in Malaysia.' },
      ],
      cta: {
        title: 'Decide whether the opportunity fits you',
        body: 'Share a few non-sensitive details and the sales leadership team will review whether a conversation would be useful.',
        label: 'Start an application',
      },
    },
    'career-change-to-sales': {
      meta: {
        title: 'Career Change to Sales in Malaysia | Practical Guide',
        description:
          'Explore how transferable skills, training, commission expectations and consistent activity shape a career change into sales in Malaysia.',
      },
      eyebrow: 'Career change guide',
      title: 'Moving from your current career into sales',
      introduction:
        'Changing careers can feel uncertain. A structured sales environment can help you test your communication, discipline and learning ability through real customer activity.',
      sections: [
        {
          id: 'transferable-skills',
          title: 'Start with the skills you already use',
          body: [
            'Many useful sales skills are developed outside formal sales roles. Customer service builds listening and problem-solving. Operations work develops organisation. Teaching builds explanation skills. Entrepreneurship develops initiative. These abilities can support a move into sales when they are applied to customer conversations and follow-up.',
            'A career switcher does not need to pretend to know everything on day one. It is more useful to identify what you can already do, where you need training and whether you are willing to practise unfamiliar tasks such as prospecting or asking for a decision.',
          ],
        },
        {
          id: 'expectations',
          title: 'Understand the performance model before changing',
          body: [
            'This Coway sales opportunity is fully commission-based rather than salaried. Actual income depends on individual sales performance and no income is guaranteed. The potential monthly commission range displayed on this site is RM2,500-RM10,000+, but it should not be treated as a promise.',
            'Career changers should consider personal commitments, savings, time availability and comfort with variable results. A clear view of the commission model helps you make a responsible decision instead of relying on an optimistic income figure.',
          ],
        },
        {
          id: 'learning-plan',
          title: 'Build a practical learning plan',
          body: [
            'Early development focuses on product communication, prospecting, customer needs, follow-up and customer care. Online training, sales information, coaching and team discussions provide a structure, while practice turns that information into usable skill.',
            'Set simple activity goals, review conversations and ask for feedback. Progress usually becomes clearer when you measure the actions you can control, such as outreach and follow-up, rather than judging yourself only by immediate sales results.',
          ],
        },
        {
          id: 'first-conversation',
          title: 'Use the first conversation to assess fit',
          body: [
            'An application is not a guarantee of selection or income. It starts a review by the sales leadership team. If there is potential fit, the next conversation can cover your background, goals, location, availability and understanding of a commission-based sales career.',
            'You should also use that conversation to ask questions. A good career decision depends on clear expectations from both sides, not pressure to commit before you understand the work.',
          ],
        },
      ],
      faq: [
        { question: 'Do I need to resign before applying?', answer: 'No. An application starts a conversation. Discuss your availability and circumstances before making a major career decision.' },
        { question: 'Which transferable skills matter most?', answer: 'Listening, communication, organisation, follow-up, resilience and willingness to learn are all useful.' },
      ],
      cta: {
        title: 'Explore your next career direction',
        body: 'Apply for a conversation if you understand the commission model and want to assess your fit for sales.',
        label: 'Discuss your fit',
      },
    },
    'sales-training-leadership': {
      meta: {
        title: 'Sales Training and Leadership Growth | Malaysia',
        description:
          'Learn how Coway sales training, coaching, practical activity and team contribution can support progress from sales fundamentals toward leadership.',
      },
      eyebrow: 'Growth and support',
      title: 'From sales training to leadership development',
      introduction:
        'Training creates a starting structure. Leadership development comes later through reliable performance, contribution, communication and the ability to support other people.',
      sections: [
        {
          id: 'fundamentals',
          title: 'Learn the sales fundamentals',
          body: [
            'Training covers practical areas such as product communication, prospecting, customer needs, follow-up and customer care. Online resources make key information easier to revisit, while team coaching helps connect that information to real conversations.',
            'The aim is not to memorise one script. Effective salespeople learn how to ask questions, explain clearly and adapt responsibly to different customer needs. Practice and feedback are essential parts of the learning process.',
          ],
        },
        {
          id: 'performance',
          title: 'Turn learning into consistent performance',
          body: [
            'Results depend on what happens after training. Consistent prospecting, organised follow-up and accurate customer support help build stronger habits. Reviewing both successful and unsuccessful conversations can show what to improve next.',
            'This opportunity is fully commission-based. Actual income depends on individual sales performance, and no income is guaranteed. A performance mindset therefore includes planning activity, managing time and continuing to act when results are not immediate.',
          ],
        },
        {
          id: 'team-contribution',
          title: 'Contribute to the team as you grow',
          body: [
            'Team contribution can include sharing useful approaches, helping with content, encouraging newer members and communicating responsibly. Supporting others does not replace personal performance, but it demonstrates reliability and the ability to work beyond individual tasks.',
            'Aspiring leaders should practise giving clear guidance, listening to challenges and setting a consistent example. Leadership is treated as a development path, not an automatic title that follows from joining.',
          ],
        },
        {
          id: 'leadership',
          title: 'Work toward leadership responsibility',
          body: [
            'Progress toward leadership depends on capability, contribution and performance. Specific timing cannot be guaranteed because each person develops at a different pace and practical opportunities may vary.',
            'A useful leadership goal is to become someone others can rely on for accurate information, constructive feedback and steady action. The first step is building your own sales foundation and understanding how the team works.',
          ],
        },
      ],
      faq: [
        { question: 'Is leadership promotion guaranteed?', answer: 'No. Development and promotion depend on capability, contribution, performance and available opportunities.' },
        { question: 'Is training only for beginners?', answer: 'No. Experienced salespeople can also use coaching and team review to strengthen their approach.' },
      ],
      cta: {
        title: 'Build the next stage of your sales capability',
        body: 'Start with a conversation about your experience, development goals and willingness to contribute.',
        label: 'Explore the growth path',
      },
    },
    'coway-sales-malaysia-locations': {
      meta: {
        title: 'Coway Sales Opportunity Across Malaysia | Locations',
        description:
          'Explore the Malaysia-wide Coway sales opportunity, with current recruitment focus in Kuala Lumpur, Selangor, Penang and Johor.',
      },
      eyebrow: 'Malaysia locations',
      title: 'A Malaysia-wide sales opportunity',
      introduction:
        'Applications are welcomed nationwide, with the current recruitment focus on Kuala Lumpur, Selangor, Penang and Johor. Practical arrangements are discussed individually.',
      sections: [
        {
          id: 'nationwide',
          title: 'Applications from across Malaysia',
          body: [
            'Sales activity is connected to real customer needs, so location can affect training access, team coordination and how you build a local customer network. The website welcomes applications from across Malaysia rather than limiting interest to one city.',
            'An application does not confirm that every arrangement is available in every area. The sales leadership team reviews your location and circumstances before discussing practical next steps.',
          ],
        },
        {
          id: 'focus-areas',
          title: 'Current focus areas',
          body: [
            'Kuala Lumpur and Selangor are important focus areas because applicants can access a large and varied customer market. Penang and Johor are also current priorities for people who want to build sales activity with local knowledge and consistent follow-up.',
            'These places are grouped on one page because the opportunity and expectations remain the same. We do not create separate city pages with repeated information simply to target search terms.',
          ],
        },
        {
          id: 'local-activity',
          title: 'What local sales activity requires',
          body: [
            'Local understanding can help you communicate naturally, recognise common customer questions and plan practical follow-up. English and Chinese communication are useful across the current focus areas, while other Malaysian languages can also support customer relationships.',
            'The role still requires the same fundamentals wherever you are: prospecting, product communication, follow-up and customer care. Training and team resources support the process, but each salesperson is responsible for building consistent activity.',
          ],
        },
        {
          id: 'arrangements',
          title: 'Discuss arrangements before making assumptions',
          body: [
            'Use the application form to state your Malaysian state or location and optional city. If there is potential fit, the team can explain how communication, training and support may work for your area.',
            'The opportunity is fully commission-based, actual income depends on individual sales performance and no income is guaranteed. Location does not change those core terms.',
          ],
        },
      ],
      faq: [
        { question: 'Can I apply outside the four focus areas?', answer: 'Yes. Applications are welcomed nationwide, subject to a discussion about practical local arrangements.' },
        { question: 'Are the commission terms different by city?', answer: 'This website presents one fully commission-based opportunity. Any practical details are discussed directly with suitable applicants.' },
      ],
      cta: {
        title: 'Tell us where you are based',
        body: 'Include your state or location so the team can consider the practical fit for your area.',
        label: 'Apply from Malaysia',
      },
    },
    'application-faq': {
      meta: {
        title: 'Coway Sales Application FAQ | Malaysia Recruitment',
        description:
          'Get clear answers about the Coway sales application, commission model, experience requirements, locations, privacy and next steps.',
      },
      eyebrow: 'Application guidance',
      title: 'Questions before you apply',
      introduction:
        'A useful application starts with clear expectations. Review the opportunity, commission model and recruitment process before sharing your details.',
      sections: [
        {
          id: 'before-applying',
          title: 'What to understand before applying',
          body: [
            'This is a fully commission-based Coway sales opportunity, not a fixed-salary position. Actual income depends on individual sales performance and no income is guaranteed. The RM2,500-RM10,000+ potential monthly commission range is information about possible performance, not a promise.',
            'Applicants should be comfortable with customer-facing activity, follow-up and continuous learning. Sales experience is welcome but not required. The current priority is aspiring team leaders, career switchers, existing salespeople and fresh graduates.',
          ],
        },
        {
          id: 'form',
          title: 'What the application form asks for',
          body: [
            'The form asks for basic contact details, age range, current job, Malaysian location and sales experience. Optional experience details can help the team understand your background. Do not submit identity documents, financial information or other sensitive personal data through the form.',
            'Form submissions are processed and stored through Formspree, the configured third-party form service. Analytics consent is separate, and recruitment form answers are not intentionally sent to Google Analytics.',
          ],
        },
        {
          id: 'review',
          title: 'How applications are reviewed',
          body: [
            'The sales leadership team reviews submitted details. If there is potential fit, someone may contact you for a conversation about your goals, understanding of the opportunity, location and next steps. Submitting the form does not guarantee selection or income.',
            'Response timing can vary, so this website does not promise a specific interview or start date. Make sure your contact number is accurate and use the conversation to ask any remaining questions.',
          ],
        },
        {
          id: 'website-status',
          title: 'Who operates this recruitment website',
          body: [
            'Coway Sales Career is an independent recruitment website operated by a Coway sales team in Malaysia. It is not the official corporate website of Coway (Malaysia) Sdn. Bhd.',
            'The site explains one sales team opportunity and provides a direct application route. It does not represent every Coway role, department or corporate hiring process.',
          ],
        },
      ],
      faq: [
        { question: 'Will I definitely be contacted?', answer: 'No. The team contacts applicants when there is potential fit. Submission does not guarantee selection.' },
        { question: 'Does the form guarantee income?', answer: 'No. Income depends on individual sales performance and no income is guaranteed.' },
        { question: 'Can I request deletion of my information?', answer: 'Use the contact route provided by the sales team to ask about recruitment information held for follow-up.' },
      ],
      cta: {
        title: 'Ready to start a conversation?',
        body: 'Apply only after you understand the fully commission-based model and the information requested.',
        label: 'Send an application',
      },
    },
  },
  zh: {
    'coway-sales-career': {
      meta: {
        title: '马来西亚 Coway 销售事业 | 完整机会指南',
        description: '了解马来西亚 Coway 销售事业的工作内容、佣金模式、日常销售活动、培训、团队支持与领导力发展。',
      },
      eyebrow: '销售事业指南',
      title: 'Coway 销售事业包含哪些工作',
      introduction: '这是一项以业绩为导向的销售机会，适合希望累积实战经验、灵活安排销售活动，并在团队中学习成长的人。',
      sections: [
        { id: 'role', title: '从了解客户开始', body: ['销售工作包括寻找潜在客户、了解需求、清楚说明合适的 Coway 产品、持续跟进，并在客户作出决定后提供支持。负责任的销售不只是介绍产品，也需要认真聆听、准确沟通和可靠的客户服务。', '日常活动可能包括开发客户、回复询问、准备产品资料、安排沟通以及记录跟进进度。团队会提供实用资料和指导，但每位销售人员仍需为自己的行动和客户关系负责。'] },
        { id: 'commission', title: '完全佣金制的机会', body: ['这不是固定薪资职位，而是完全以佣金为基础的销售机会。实际收入取决于个人销售业绩。本网站显示的潜在每月佣金范围为 RM2,500-RM10,000+，但不保证任何收入。', '佣金模式可能带来灵活性和成长空间，同时也要求持续行动。申请前，请认真考虑自己是否愿意开发客户、跟进、接受反馈，并面对成果需要时间累积的阶段。'] },
        { id: 'support', title: '培训、工具与团队支持', body: ['新人和有经验的销售人员都可接触线上销售培训、产品资料、教练指导、内容协作和客户沟通支持。培训提供结构，而能力提升仍取决于实际练习和持续运用。', '团队文化强调共同学习。成员可以交流方法、检讨做法并互相鼓励，同时各自为个人业绩负责。能力、贡献和表现持续成长的人，也可以朝领导责任发展。'] },
        { id: 'fit', title: '哪些人可能适合', body: ['目前优先考虑有志成为团队领导者的人，其次是准备转职的人、现有销售人员和应届毕业生。销售经验有帮助但不是必要条件。愿意学习、主动行动、良好沟通和接受指导都很重要。', '如果你需要保证薪资、期待被动收入，或不愿意持续面对客户，这项机会可能不适合你。首次沟通会帮助双方了解期望和实际匹配度。'] },
      ],
      faq: [
        { question: '这是固定薪资工作吗？', answer: '不是。这是完全佣金制的销售机会，并且不保证任何收入。' },
        { question: '没有销售经验可以申请吗？', answer: '可以。团队提供培训和支持，但申请者必须愿意学习并持续行动。' },
        { question: '这是 Coway 官方企业招聘网站吗？', answer: '不是。Coway Sales Career 由马来西亚 Coway 销售团队独立运营。' },
      ],
      cta: { title: '判断这项机会是否适合你', body: '提供少量非敏感资料，销售领导团队会审核是否适合进一步沟通。', label: '开始申请' },
    },
    'career-change-to-sales': {
      meta: { title: '马来西亚转职销售指南 | 实用准备方法', description: '了解如何运用可转移技能、建立销售能力，并在申请完全佣金制销售机会前评估个人准备。' },
      eyebrow: '转职指南',
      title: '从现有工作转向销售事业',
      introduction: '转职会带来不确定感。一个有结构的销售环境可以让你通过真实客户活动，检验自己的沟通、纪律和学习能力。',
      sections: [
        { id: 'transferable-skills', title: '先认识你已有的能力', body: ['许多销售能力来自非销售工作。客户服务培养聆听和解决问题，营运工作培养组织能力，教学训练表达，创业经验提升主动性。关键是把这些能力运用在客户沟通和跟进上。', '转职者不需要假装第一天就懂得所有事情。更实际的做法是确认自己的优势、需要培训的部分，以及是否愿意练习开发客户或提出成交邀请等新任务。'] },
        { id: 'expectations', title: '转职前先理解业绩模式', body: ['这项 Coway 销售机会完全以佣金为基础，并非固定薪资。实际收入取决于个人销售业绩，并且不保证任何收入。网站显示的 RM2,500-RM10,000+ 潜在每月佣金范围不应被视为承诺。', '转职者应考虑个人责任、储蓄、可投入时间以及面对收入波动的能力。清楚理解佣金模式，能帮助你作出负责任的决定。'] },
        { id: 'learning-plan', title: '建立实际学习计划', body: ['初期学习包括产品沟通、开发客户、了解需求、持续跟进和客户服务。线上培训、销售资料、教练指导和团队讨论提供结构，而练习会把知识转化为实际能力。', '设定简单的行动目标，检讨客户沟通并主动寻求反馈。把注意力放在可控制的行动上，例如联系和跟进，通常比只用即时销售结果评价自己更有帮助。'] },
        { id: 'first-conversation', title: '用首次沟通评估匹配度', body: ['提交申请不保证获选或收入。销售领导团队会先审核资料，如有潜在匹配，再讨论你的背景、目标、地点、时间安排以及对佣金制销售事业的理解。', '你也应该利用这次沟通提问。良好的转职决定来自双方对工作和期望的清楚认识，而不是在不了解之前仓促承诺。'] },
      ],
      faq: [
        { question: '申请前需要先辞职吗？', answer: '不需要。申请只是开始沟通，在作出重大决定前先讨论你的情况和时间安排。' },
        { question: '哪些可转移技能最有帮助？', answer: '聆听、沟通、组织、跟进、抗压能力和学习意愿都很实用。' },
      ],
      cta: { title: '探索下一步职业方向', body: '如果你理解佣金模式，并希望评估自己是否适合销售，可以申请进一步沟通。', label: '讨论你的匹配度' },
    },
    'sales-training-leadership': {
      meta: { title: '销售培训与领导力发展 | 马来西亚', description: '了解 Coway 销售培训、教练指导、实战活动和团队贡献，如何支持你从基础销售能力走向领导责任。' },
      eyebrow: '成长与支持',
      title: '从销售培训走向领导力发展',
      introduction: '培训提供起点。领导力则来自可靠表现、持续贡献、良好沟通以及支持其他团队成员的能力。',
      sections: [
        { id: 'fundamentals', title: '学习销售基本功', body: ['培训涵盖产品沟通、开发客户、了解需求、跟进和客户服务。线上资料方便重复学习，团队指导则帮助你把信息运用在真实客户对话中。', '目标不是背诵同一套说法，而是学会提问、清楚说明，并根据不同客户需要作出负责任的回应。练习和反馈是学习过程的重要部分。'] },
        { id: 'performance', title: '把学习转化为稳定表现', body: ['培训后的行动决定成果。持续开发客户、有组织地跟进和准确提供客户支持，有助于建立更好的习惯。检讨成功和未成功的沟通，可以找出下一步改进方向。', '这项机会完全以佣金为基础。实际收入取决于个人销售业绩，并且不保证任何收入。业绩思维也包括规划活动、管理时间，以及在成果尚未出现时继续行动。'] },
        { id: 'team-contribution', title: '成长过程中为团队作出贡献', body: ['团队贡献可以包括分享实用方法、协助内容制作、鼓励新人和负责任地沟通。支持其他人不能取代个人表现，但可以体现可靠性和承担更多责任的能力。', '有志成为领导者的人应练习清楚指导、聆听困难和以稳定行动作出示范。领导力是一条发展路径，不是加入后自动获得的头衔。'] },
        { id: 'leadership', title: '逐步承担领导责任', body: ['领导力发展取决于能力、贡献和表现。每个人成长速度不同，实际机会也可能不同，因此无法保证具体晋升时间。', '一个实用的领导目标，是成为团队可以依赖的人，能够提供准确信息、建设性反馈和稳定行动。第一步仍是建立自己的销售基础。'] },
      ],
      faq: [
        { question: '一定会晋升领导职位吗？', answer: '不会。发展和晋升取决于能力、贡献、表现和实际机会。' },
        { question: '培训只适合新人吗？', answer: '不是。有经验的销售人员也可以通过教练指导和团队检讨加强方法。' },
      ],
      cta: { title: '建立下一阶段的销售能力', body: '从讨论你的经验、发展目标和团队贡献意愿开始。', label: '了解成长路径' },
    },
    'coway-sales-malaysia-locations': {
      meta: { title: '马来西亚各地 Coway 销售机会 | 招募地点', description: '了解面向全马的 Coway 销售机会，目前重点招募地区包括吉隆坡、雪兰莪、槟城和柔佛。' },
      eyebrow: '马来西亚地点',
      title: '面向全马的销售机会',
      introduction: '我们欢迎全马申请，目前重点地区是吉隆坡、雪兰莪、槟城和柔佛。实际安排会根据个人情况进一步讨论。',
      sections: [
        { id: 'nationwide', title: '欢迎全马申请', body: ['销售活动连接真实客户需求，因此地点会影响培训、团队协调和本地客户网络的建立。网站欢迎马来西亚各地人士申请，而不是只限一个城市。', '提交申请不代表每个地区都有完全相同的安排。销售领导团队会先了解你的地点和情况，再讨论实际下一步。'] },
        { id: 'focus-areas', title: '目前重点地区', body: ['吉隆坡和雪兰莪拥有多元客户市场，是目前重要地区。槟城和柔佛也是现阶段重点，适合希望运用本地知识并持续跟进客户的人。', '这些地区集中在同一页面，因为机会和基本要求一致。我们不会为了搜索关键词而建立内容重复的城市页面。'] },
        { id: 'local-activity', title: '本地销售活动需要什么', body: ['了解本地情况有助于自然沟通、掌握常见问题和规划实际跟进。英语和中文在重点地区都很实用，其他马来西亚语言也能帮助建立客户关系。', '无论地点在哪里，工作基础相同，包括开发客户、产品沟通、跟进和客户服务。团队提供培训和资源，而每位销售人员仍需建立稳定行动。'] },
        { id: 'arrangements', title: '先讨论实际安排', body: ['申请表会要求填写州属或地点，城市资料则属选填。如有潜在匹配，团队会说明你的地区可能如何进行沟通、培训和支持。', '这项机会完全以佣金为基础，实际收入取决于个人销售业绩，并且不保证任何收入。地点不会改变这些核心条件。'] },
      ],
      faq: [
        { question: '重点地区以外可以申请吗？', answer: '可以。我们欢迎全马申请，但需要进一步讨论当地实际安排。' },
        { question: '不同城市的佣金条件不同吗？', answer: '本网站介绍同一项完全佣金制机会，适合申请者的实际细节会直接讨论。' },
      ],
      cta: { title: '告诉我们你所在的地区', body: '填写州属或地点，让团队评估当地的实际匹配度。', label: '从马来西亚申请' },
    },
    'application-faq': {
      meta: { title: 'Coway 销售申请常见问题 | 马来西亚招募', description: '了解 Coway 销售申请流程、佣金模式、经验要求、招募地点、隐私处理和提交申请后的下一步。' },
      eyebrow: '申请说明',
      title: '申请前常见问题',
      introduction: '有用的申请建立在清楚期望上。分享资料前，请先了解机会、佣金模式和审核流程。',
      sections: [
        { id: 'before-applying', title: '申请前需要了解什么', body: ['这是一项完全佣金制的 Coway 销售机会，不是固定薪资职位。实际收入取决于个人销售业绩，并且不保证任何收入。RM2,500-RM10,000+ 潜在每月佣金范围是业绩可能性的说明，不是承诺。', '申请者应愿意面对客户、持续跟进和学习。销售经验有帮助但不是必要条件。目前优先考虑有志成为团队领导者的人、转职者、现有销售人员和应届毕业生。'] },
        { id: 'form', title: '申请表会要求哪些资料', body: ['表格会要求基本联系资料、年龄范围、目前职业、马来西亚地点和销售经验。选填的经验详情可以帮助团队了解你的背景。请勿通过表格提交身份证件、财务资料或其他敏感个人信息。', '表格资料通过已配置的第三方表单服务 Formspree 处理和存储。分析同意是独立选择，招聘表格答案不会被刻意发送到 Google Analytics。'] },
        { id: 'review', title: '申请如何审核', body: ['销售领导团队会审核所提交的资料。如有潜在匹配，团队可能联系你，讨论目标、对机会的理解、地点和下一步。提交表格不保证获选或收入。', '回复时间可能不同，因此网站不承诺具体面谈或开始日期。请确保联系电话正确，并在沟通时提出尚未解决的问题。'] },
        { id: 'website-status', title: '谁在运营这个招聘网站', body: ['Coway Sales Career 是由马来西亚 Coway 销售团队运营的独立招聘网站。它不是 Coway (Malaysia) Sdn. Bhd. 的官方企业网站。', '网站说明一个销售团队的机会并提供直接申请渠道。它不代表所有 Coway 职位、部门或企业招聘流程。'] },
      ],
      faq: [
        { question: '提交后一定会收到联系吗？', answer: '不会。团队会在有潜在匹配时联系申请者，提交不保证获选。' },
        { question: '申请表会保证收入吗？', answer: '不会。收入取决于个人销售业绩，并且不保证任何收入。' },
        { question: '可以要求删除资料吗？', answer: '你可以通过销售团队提供的联系渠道，询问招聘跟进所保存的资料。' },
      ],
      cta: { title: '准备开始沟通了吗？', body: '请在理解完全佣金制和表格所需资料后再申请。', label: '提交申请' },
    },
  },
};

export function getSupportingPage(
  locale: SupportingLocale,
  key: SupportingPageKey,
): SupportingPageContent {
  return supportingPages[locale][key];
}
