import { uid, type CvDoc } from "./cv-model";

export function sampleAccountant(lang: "ar" | "en"): CvDoc {
  if (lang === "en") return sampleEn();
  return sampleAr();
}

function sampleAr(): CvDoc {
  return {
    id: uid(),
    lang: "ar",
    updatedAt: Date.now(),
    profile: {
      name: "آية محمود حسن",
      headline: "محاسب عام",
      location: "القاهرة",
      phone: "+20 100 000 0000",
      email: "aya.hassan@email.com",
    },
    summary:
      "محاسب عام بخبرة تتجاوز 7 سنوات في التصنيع والمحاسبة العامة. خبرة عملية في إدارة الدورة المحاسبية الكاملة، بما يشمل الأستاذ العام (General Ledger)، الخزينة (Treasury)، الحسابات الدائنة والمدينة، الرواتب، متابعة المخزون، والتسويات والإقفالات الشهرية. أجيد Excel بشكل متقدم: INDEX MATCH وXLOOKUP وPivot Tables وPower Query وSUMIFS، مع إعداد تقارير تدعم اتخاذ القرار.",
    experience: [
      {
        id: uid(),
        title: "محاسب عام",
        company: "شركة النور للتصنيع",
        start: "يناير 2025",
        end: "حتى الآن",
        current: true,
        bullets: [
          "تسجيل ومراجعة القيود اليومية للخزينة والمبيعات وتكاليف الإنتاج وفق دليل الحسابات.",
          "إدارة معاملات خزينة تقارب 2 مليون جنيه شهريًا، ومتابعة نحو 300 حركة مالية مع معالجة الفروقات.",
          "متابعة أرصدة الموردين والعملاء وإعداد التسويات قبل الإقفال الشهري.",
          "المساهمة في إعداد ميزان المراجعة والتقارير المالية الدورية للإدارة.",
        ],
      },
      {
        id: uid(),
        title: "محاسب",
        company: "مؤسسة الأفق للخدمات",
        start: "يناير 2021",
        end: "ديسمبر 2024",
        bullets: [
          "مراجعة كشوف رواتب شهرية لأكثر من 400 موظف مع مطابقة الحضور والاستحقاقات.",
          "إدارة عمليات الخزينة ومتابعة الحركة النقدية اليومية والتسويات.",
          "إعداد التقارير الشهرية والمساعدة في أعمال الإقفال المالي.",
        ],
      },
    ],
    education: [
      {
        id: uid(),
        degree: "بكالوريوس — تجارة",
        school: "جامعة القاهرة",
        year: "ديسمبر 2016",
      },
    ],
    skillGroups: [
      {
        id: uid(),
        title: "المهارات التقنية",
        items: [
          "Microsoft Excel — متقدم: XLOOKUP، INDEX MATCH، SUMIFS، Pivot Tables",
          "Power Query",
          "Microsoft Word",
          "Microsoft PowerPoint",
        ],
      },
      {
        id: uid(),
        title: "مهارات العمل",
        items: [
          "مراجعة وتحليل البيانات المالية",
          "اكتشاف ومعالجة الفروقات والتسويات",
          "إعداد التقارير الداعمة لاتخاذ القرار",
          "الدقة والتنظيم والعمل تحت الضغط",
        ],
      },
    ],
    languages: [
      { id: uid(), name: "العربية", level: "لغة أم" },
      { id: uid(), name: "الإنجليزية", level: "مستوى مهني للعمل" },
    ],
    training: ["برنامج المحاسب المالي المحترف", "دورة Excel المتقدم"],
    interests: ["تعلم الذكاء الاصطناعي في المحاسبة", "تطوير المهارات في البرمجيات المحاسبية"],
  };
}

function sampleEn(): CvDoc {
  return {
    id: uid(),
    lang: "en",
    updatedAt: Date.now(),
    profile: {
      name: "Aya Mahmoud Hassan",
      headline: "General Accountant",
      location: "Cairo",
      phone: "+20 100 000 0000",
      email: "aya.hassan@email.com",
    },
    summary:
      "General accountant with over 7 years of experience in manufacturing and general accounting. Hands-on ownership of the full accounting cycle, including General Ledger, Treasury, accounts payable and receivable, payroll, inventory tracking, and monthly closings. Advanced Excel (INDEX MATCH, XLOOKUP, Pivot Tables, Power Query, SUMIFS) with reporting that supports decision-making.",
    experience: [
      {
        id: uid(),
        title: "General Accountant",
        company: "Al Nour Manufacturing",
        start: "January 2025",
        end: "Present",
        current: true,
        bullets: [
          "Record and review daily journals for treasury, sales, and production costs against the chart of accounts.",
          "Manage treasury of about EGP 2 million per month and around 300 movements, clearing variances.",
          "Monitor supplier and customer balances and reconcile before month-end close.",
          "Contribute to the trial balance and periodic management reports.",
        ],
      },
      {
        id: uid(),
        title: "Accountant",
        company: "Al Ofuq Services",
        start: "January 2021",
        end: "December 2024",
        bullets: [
          "Reviewed monthly payroll for 400+ staff, matching attendance and entitlements.",
          "Managed treasury operations and daily cash movement and reconciliations.",
          "Prepared monthly reports and supported financial close.",
        ],
      },
    ],
    education: [
      {
        id: uid(),
        degree: "Bachelor of Commerce",
        school: "Cairo University",
        year: "December 2016",
      },
    ],
    skillGroups: [
      {
        id: uid(),
        title: "Technical Skills",
        items: [
          "Microsoft Excel — Advanced: XLOOKUP, INDEX MATCH, SUMIFS, Pivot Tables",
          "Power Query",
          "Microsoft Word",
          "Microsoft PowerPoint",
        ],
      },
      {
        id: uid(),
        title: "Working Skills",
        items: [
          "Financial data review and analysis",
          "Detecting and clearing variances",
          "Decision-support reporting",
          "Accuracy, organization, and work under pressure",
        ],
      },
    ],
    languages: [
      { id: uid(), name: "Arabic", level: "Native" },
      { id: uid(), name: "English", level: "Professional working proficiency" },
    ],
    training: ["Professional Financial Accountant Program", "Advanced Excel Course"],
    interests: ["AI applications in accounting", "Accounting software skills"],
  };
}
