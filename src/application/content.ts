import type { Locale } from "../content/locales";
import type { ApplicationField, ValidationErrorCode } from "./schema";

type Copy = {
  title: string; intro: string; privacy: string; required: string; optional: string;
  labels: Record<ApplicationField, string>; placeholders: { select: string };
  ageOptions: Record<string, string>; experienceOptions: Record<string, string>;
  submit: string; submitting: string; invalid: string; success: string; failure: string;
  errors: Record<ValidationErrorCode, string>;
};

export const applicationContent: Record<Locale, Copy> = {
  en: {
    title: "Start the conversation", intro: "Share a few non-sensitive details so we can understand your fit for this fully commission-based opportunity.",
    privacy: "Your information is used for recruitment follow-up and is processed and stored through Formspree, our configured third-party form service.",
    required: "Required", optional: "Optional", placeholders: { select: "Select an option" },
    labels: { name: "Name", contactNumber: "Contact number", ageRange: "Age range", currentJob: "Current job", state: "Malaysian state / location", city: "City", salesExperience: "Sales experience", experienceDetail: "Experience detail", consent: "I consent to being contacted about this sales opportunity. I understand this form does not guarantee selection or income." },
    ageOptions: { "18-24": "18–24", "25-34": "25–34", "35-44": "35–44", "45+": "45+" }, experienceOptions: { none: "None", "<1": "Less than 1 year", "1-3": "1–3 years", "4-6": "4–6 years", "7+": "7+ years" },
    submit: "Send application", submitting: "Sending…", invalid: "Please correct the highlighted fields.", success: "Thank you. Your application has been sent successfully.", failure: "We couldn't send your application. Please try again.",
    errors: { REQUIRED: "This field is required.", NAME_TOO_SHORT: "Enter at least 2 characters.", INVALID_PHONE: "Enter a valid contact number.", INVALID_OPTION: "Select a valid option.", TOO_LONG: "Use 120 characters or fewer.", CONSENT_REQUIRED: "Consent is required before continuing." },
  },
  bm: {
    title: "Mulakan perbualan", intro: "Kongsikan beberapa butiran tidak sensitif supaya kami dapat memahami kesesuaian anda untuk peluang berasaskan komisen sepenuhnya ini.",
    privacy: "Maklumat anda digunakan untuk tindakan susulan pengambilan dan diproses serta disimpan melalui Formspree, perkhidmatan borang pihak ketiga yang dikonfigurasikan.",
    required: "Wajib", optional: "Pilihan", placeholders: { select: "Pilih satu pilihan" },
    labels: { name: "Nama", contactNumber: "Nombor telefon", ageRange: "Julat umur", currentJob: "Pekerjaan semasa", state: "Negeri / lokasi di Malaysia", city: "Bandar", salesExperience: "Pengalaman jualan", experienceDetail: "Butiran pengalaman", consent: "Saya bersetuju untuk dihubungi tentang peluang jualan ini. Saya faham borang ini tidak menjamin pemilihan atau pendapatan." },
    ageOptions: { "18-24": "18–24", "25-34": "25–34", "35-44": "35–44", "45+": "45+" }, experienceOptions: { none: "Tiada", "<1": "Kurang 1 tahun", "1-3": "1–3 tahun", "4-6": "4–6 tahun", "7+": "7+ tahun" },
    submit: "Hantar permohonan", submitting: "Sedang menghantar…", invalid: "Sila betulkan medan yang ditandakan.", success: "Terima kasih. Permohonan anda telah berjaya dihantar.", failure: "Kami tidak dapat menghantar permohonan anda. Sila cuba lagi.",
    errors: { REQUIRED: "Medan ini wajib diisi.", NAME_TOO_SHORT: "Masukkan sekurang-kurangnya 2 aksara.", INVALID_PHONE: "Masukkan nombor telefon yang sah.", INVALID_OPTION: "Pilih pilihan yang sah.", TOO_LONG: "Gunakan 120 aksara atau kurang.", CONSENT_REQUIRED: "Persetujuan diperlukan sebelum meneruskan." },
  },
  zh: {
    title: "开始沟通", intro: "请分享少量非敏感资料，以便我们了解你是否适合这个完全佣金制的机会。",
    privacy: "你的资料用于招聘跟进，并通过我们配置的第三方表单服务 Formspree 处理和存储。",
    required: "必填", optional: "选填", placeholders: { select: "请选择" },
    labels: { name: "姓名", contactNumber: "联系电话", ageRange: "年龄范围", currentJob: "目前职业", state: "马来西亚州属／地点", city: "城市", salesExperience: "销售经验", experienceDetail: "经验详情", consent: "我同意就此销售机会接受联系，并了解此表格不保证获选或收入。" },
    ageOptions: { "18-24": "18–24", "25-34": "25–34", "35-44": "35–44", "45+": "45岁以上" }, experienceOptions: { none: "无", "<1": "少于1年", "1-3": "1–3年", "4-6": "4–6年", "7+": "7年以上" },
    submit: "提交申请", submitting: "正在提交…", invalid: "请更正标示的字段。", success: "谢谢。你的申请已成功发送。", failure: "无法发送你的申请。请再试一次。",
    errors: { REQUIRED: "此栏为必填。", NAME_TOO_SHORT: "请至少输入2个字符。", INVALID_PHONE: "请输入有效的联系电话。", INVALID_OPTION: "请选择有效选项。", TOO_LONG: "请勿超过120个字符。", CONSENT_REQUIRED: "继续前必须给予同意。" },
  },
};
