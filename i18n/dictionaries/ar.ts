import type { PortfolioDictionary } from "../types";

const ar = {
  locale: "ar",
  direction: "rtl",
  localeName: "العربية",
  common: {
    siteName: "الملف المهني لعصام الغبالي",
    portfolioOwner: "عصام الغبالي",
    skipToContent: "الانتقال إلى المحتوى الرئيسي",
    loading: "جارٍ التحميل",
    close: "إغلاق",
    back: "رجوع",
    previous: "السابق",
    next: "التالي",
    opensInNewTab: "يُفتح في علامة تبويب جديدة",
    externalLink: "رابط خارجي",
    download: "تنزيل",
    notAvailable: "غير متاح",
  },
  navigation: {
    ariaLabel: "التنقل الرئيسي",
    brandLabel: "عصام الغبالي — الانتقال إلى الصفحة الرئيسية",
    sections: {
      home: "الرئيسية",
      about: "نبذة عني",
      projects: "المشاريع",
      skills: "المهارات",
      certifications: "الشهادات",
      experience: "المسار",
      contact: "التواصل",
    },
    openMenu: "فتح قائمة التنقل",
    closeMenu: "إغلاق قائمة التنقل",
    menuLabel: "قائمة التنقل",
  },
  languageSwitcher: {
    label: "اللغة",
    currentLanguage: "اللغة الحالية",
    changeLanguage: "تغيير اللغة",
  },
  hero: {
    greeting: "مرحبًا، أنا",
    name: "عصام الغبالي",
    stableHeadline: "مطوّر Full-Stack وData Scientist",
    rotatingRoles: [
      "مطوّر Full-Stack",
      "Data Scientist",
      "متخصص في التعلم الآلي",
      "مطوّر أنظمة ذكية",
      "أحل المشكلات بالاعتماد على البيانات",
    ],
    profileImageAlt: "صورة شخصية لعصام الغبالي",
    viewProjects: "استعراض المشاريع",
    contactMe: "تواصل معي",
    downloadCv: "تنزيل السيرة الذاتية",
    linkedinLabel: "عرض حساب عصام الغبالي على LinkedIn",
    githubLabel: "عرض حساب عصام الغبالي على GitHub",
  },
  about: {
    titleLead: "نبذة",
    titleAccent: "عني",
    summary:
      "طالب ماستر في علم البيانات، أمتلك أساسًا متينًا في علوم الحاسوب وأركز على التعلم الآلي والذكاء الاصطناعي والأنظمة البرمجية القابلة للتوسع.",
    paragraphs: [
      "أعمل عند تقاطع التعلم الآلي والذكاء الاصطناعي وهندسة البرمجيات الحديثة.",
      "أركز على تصميم أنظمة ذكية تعالج مشكلات واقعية من خلال ممارسات بيانات منهجية وبنى برمجية قابلة للتوسع.",
      "يدفعني الفضول والتعلم المستمر إلى بناء حلول رقمية توازن بين الأداء وسهولة الصيانة والقيمة العملية.",
    ],
    focusAreas: [
      {
        id: "artificial-intelligence",
        title: "الذكاء الاصطناعي",
        description:
          "تصميم أنظمة ذكية تعتمد على التعلم الآلي وخوارزميات ملائمة لطبيعة المشكلة.",
      },
      {
        id: "data-science",
        title: "علم البيانات",
        description:
          "تحويل البيانات الخام إلى رؤى واضحة وحلول عملية تستند إلى الأدلة.",
      },
      {
        id: "software-engineering",
        title: "هندسة البرمجيات",
        description:
          "بناء تطبيقات قابلة للتوسع والصيانة على أسس موثوقة في الواجهة الأمامية والخلفية.",
      },
    ],
  },
  skills: {
    titleLead: "الخبرات",
    titleAccent: "التقنية",
    description:
      "التقنيات التي أستخدمها لتحويل الأفكار إلى حلول رقمية ذكية ومتينة وذات قيمة عملية.",
    developerTitle: "مطوّر برمجيات",
    developerDescription:
      "أبني تطبيقات Full-Stack باستخدام أطر حديثة وبنى قابلة للتوسع، بدءًا من واجهات واضحة وصولًا إلى API متينة وأنظمة خلفية عالية الأداء.",
    dataScientistTitle: "Data Scientist",
    dataScientistDescription:
      "أحوّل البيانات الخام إلى رؤى قابلة للاستخدام من خلال التحليل الإحصائي والتعلم الآلي وتصور البيانات لدعم قرارات أفضل.",
    technologiesLabel: "التقنيات",
    categories: {
      development: "التطوير",
      dataScience: "علم البيانات",
      aiMachineLearning: "الذكاء الاصطناعي / التعلم الآلي",
    },
    tickerInstructions: "مرّر المؤشر فوق قائمة التقنيات أو انقل التركيز إليها لإيقاف حركتها مؤقتًا.",
  },
  experience: {
    titleLead: "مساري",
    titleAccent: "المهني والأكاديمي",
    description:
      "مسار أكاديمي ومهني يطوّر خبرتي في هندسة البرمجيات وعلم البيانات والأنظمة الذكية.",
    timelineLabel: "الخط الزمني للمسار الأكاديمي والمهني",
    items: {
      "master-data-science": {
        title: "ماستر علم البيانات والأنظمة الذكية",
        period: "2025 – الآن",
        institution: "كلية العلوم والتقنيات بفاس (FST Fès)",
        location: "فاس، المغرب",
        description:
          "دراسة متقدمة تركز على التعلم الآلي والذكاء الاصطناعي والأنظمة الذكية القابلة للتوسع.",
        typeLabel: "دراسة أكاديمية",
      },
      "software-engineering-internship": {
        title: "متدرب في هندسة البرمجيات",
        period: "2025",
        institution: "École Polytechnique des Génies",
        location: "فاس، المغرب",
        duration: "شهران",
        description:
          "صممت وطورت منصة داخلية لإدارة الموارد باستخدام Spring Boot وReact.js، مع التركيز على بنية الواجهة الخلفية وREST API والتكامل الموثوق بين مكونات النظام لتبسيط العمليات الداخلية.",
        typeLabel: "خبرة مهنية",
      },
      "computer-engineering-licence": {
        title: "الإجازة في العلوم والتقنيات — هندسة الحاسوب",
        period: "2024 – 2025",
        institution: "كلية العلوم والتقنيات بفاس (FST Fès)",
        location: "فاس، المغرب",
        description: "تخصص في تطوير البرمجيات والخوارزميات وبنية الأنظمة.",
        typeLabel: "دراسة أكاديمية",
      },
      deust: {
        title: "دبلوم الدراسات الجامعية في العلوم والتقنيات (DEUST)",
        period: "2022 – 2024",
        institution: "كلية العلوم والتقنيات بفاس (FST Fès)",
        location: "فاس، المغرب",
        description:
          "اكتسبت أساسًا قويًا في الرياضيات وعلوم الحاسوب، وطورت التفكير التحليلي ومهارات حل المشكلات والمبادئ الأساسية للهندسة.",
        typeLabel: "دراسة أكاديمية",
      },
    },
  },
  projects: {
    section: {
      titleLead: "مشاريع",
      titleAccent: "مختارة",
      description:
        "مجموعة مختارة من المشاريع في تطوير Full-Stack وعلم البيانات والبنى البرمجية القابلة للتوسع.",
      viewAll: "عرض جميع المشاريع",
    },
    listing: {
      titleLead: "جميع",
      titleAccent: "المشاريع",
      description:
        "مجموعة مشاريعي في تطوير Full-Stack وعلم البيانات والتعلم الآلي وتطبيقات المؤسسات.",
      count: {
        zero: "لا توجد مشاريع",
        one: "مشروع واحد",
        two: "مشروعان",
        few: "{count} مشاريع",
        many: "{count} مشروعًا",
        other: "{count} مشروع",
      },
      backToPortfolio: "العودة إلى الملف المهني",
      collectionLabel: "مجموعة المشاريع",
    },
    card: {
      githubProfile: "حساب GitHub",
      githubRepository: "مستودع GitHub",
      viewDetails: "تفاصيل المشروع",
      viewDetailsFor: "عرض تفاصيل مشروع {project}",
      technologiesLabel: "التقنيات المستخدمة",
    },
    detail: {
      backToProjects: "العودة إلى جميع المشاريع",
      githubProfile: "عرض حساب GitHub",
      githubRepository: "عرض المستودع على GitHub",
      projectImageLabel: "معاينة المشروع",
      technologiesHeading: "التقنيات",
      caseStudyHeading: "دراسة المشروع",
    },
    items: {
      "indonesia-tourism": {
        title: "Indonesia Tourism Website",
        category: "الواجهة الأمامية / تطوير الويب",
        shortDescription:
          "موقع سياحي ثابت يعرض ثقافة إندونيسيا ووجهاتها ومعالمها السياحية.",
        imageAlt: "معاينة موقع السياحة في إندونيسيا",
        seo: {
          title: "موقع السياحة في إندونيسيا",
          description:
            "موقع سياحي متجاوب يقدم ثقافة إندونيسيا ووجهاتها ومعالمها ومحتواها البصري المرتبط بالسفر.",
        },
        introduction: [
          "صفحة سياحية مخصصة لإندونيسيا، صُممت لتقديم ثقافة البلد ومعالمه وتجارب السفر فيه ضمن واجهة غنية بالمعلومات وجذابة بصريًا.",
        ],
        caseStudy: [
          {
            id: "content",
            heading: "محتوى الموقع",
            items: [
              "قسم Hero افتتاحي",
              "إبراز الوجهات السياحية",
              "تقديم الثقافة المحلية",
              "معرض صور",
              "قسم للتواصل",
            ],
          },
          {
            id: "focus",
            heading: "التركيز التقني",
            paragraphs: [
              "يركز المشروع على هيكلة الواجهة الأمامية والتصميم المتجاوب والتفاعلات المطورة باستخدام JavaScript.",
            ],
          },
        ],
      },
      "resource-platform": {
        title: "Academic Resource Management Platform",
        category: "تطبيق Full-Stack",
        shortDescription:
          "منصة Full-Stack تتيح للأساتذة مشاركة الموارد التعليمية وإدارتها لفائدة الطلبة.",
        imageAlt: "معاينة منصة إدارة الموارد التعليمية",
        seo: {
          title: "منصة إدارة الموارد التعليمية",
          description:
            "منصة مبنية باستخدام Spring Boot وReact لتنظيم مواد المقررات ومشاركتها والوصول إليها بشكل آمن.",
        },
        introduction: [
          "نظام Full-Stack لإدارة الموارد التعليمية، مخصص لمؤسسات التعليم.",
        ],
        caseStudy: [
          {
            id: "capabilities",
            heading: "الوظائف الأساسية",
            items: [
              "رفع مواد المقررات وإدارتها من طرف الأساتذة",
              "وصول الطلبة إلى الموارد وتنزيلها",
              "تنظيم المواد حسب المقرر",
              "حماية الوصول بواسطة نظام مصادقة",
            ],
          },
          {
            id: "architecture",
            heading: "البنية التقنية",
            paragraphs: [
              "تستخدم الواجهة الخلفية Spring Boot وتعرض REST API، بينما توفر واجهة React.js تجربة تفاعلية وتتولى إدارة حالة التطبيق.",
            ],
          },
          {
            id: "demonstrates",
            heading: "المهارات التي يبرزها المشروع",
            items: [
              "تطوير REST API",
              "إدارة المصادقة",
              "تكامل Full-Stack",
              "إدارة الحالة باستخدام React",
            ],
          },
        ],
      },
      "employee-management": {
        title: "Employee & Salary Management System",
        category: "تطبيق ويب للمؤسسات",
        shortDescription:
          "تطبيق MVC ثلاثي الطبقات لإدارة الموظفين والمشرفين والرواتب وصلاحيات الوصول حسب الدور.",
        imageAlt: "معاينة نظام إدارة الموظفين والرواتب",
        seo: {
          title: "نظام إدارة الموظفين والرواتب",
          description:
            "تطبيق MVC باستخدام Spring Boot لإدارة الموظفين والمشرفين والرواتب والوصول المبني على الأدوار.",
        },
        introduction: [
          "تطبيق ويب مؤسساتي ثلاثي الطبقات، مطوّر باستخدام Spring Boot وThymeleaf.",
        ],
        caseStudy: [
          {
            id: "features",
            heading: "الوظائف الأساسية",
            items: [
              "عمليات CRUD الخاصة بالموظفين",
              "إدارة المشرفين",
              "إدارة الرواتب",
              "مصادقة مبنية على أدوار المدير والمشرف والموظف",
            ],
          },
          {
            id: "architecture",
            heading: "البنية متعددة الطبقات",
            items: ["طبقة Controller", "طبقة Service", "طبقة Repository"],
          },
        ],
      },
      "nosql-ml-redis": {
        title: "NoSQL & Machine Learning Football Prediction System",
        category: "هندسة البيانات / التعلم الآلي",
        shortDescription:
          "بنية تطبيق تجمع Redis وتدريب النموذج وAPI للتنبؤ وواجهة أمامية مبنية باستخدام React.",
        imageAlt: "معاينة نظام توقع نتائج كرة القدم باستخدام Redis والتعلم الآلي",
        seo: {
          title: "توقع كرة القدم باستخدام Redis وML",
          description:
            "بنية لتوقع نتائج كرة القدم تجمع Redis وتدريب Machine Learning والاستدلال عبر REST API وواجهة React.",
        },
        introduction: [
          "بنية تطبيق متكاملة تربط تخزين NoSQL وتدريب Machine Learning وخدمة التنبؤ بواجهة ويب.",
        ],
        caseStudy: [
          {
            id: "architecture",
            heading: "البنية المتكاملة",
            items: [
              "Redis بوصفها قاعدة بيانات NoSQL",
              "تدريب نموذج Machine Learning",
              "عرض التنبؤات من خلال REST API",
              "واجهة أمامية مبنية باستخدام React",
            ],
          },
        ],
      },
      "personal-portfolio": {
        title: "Personal Portfolio Website",
        category: "الواجهة الأمامية / Full-Stack",
        shortDescription:
          "ملف مهني حديث مبني باستخدام Next.js وTailwind CSS لعرض المشاريع والمهارات والمسار المهني.",
        imageAlt: "معاينة الملف المهني الشخصي لعصام الغبالي",
        seo: {
          title: "ملف مهني شخصي باستخدام Next.js",
          description:
            "ملف مهني متجاوب مبني باستخدام Next.js وTypeScript وTailwind CSS وFramer Motion وEmailJS.",
        },
        introduction: [
          "ملفي المهني كمطوّر، صممته لعرض مشاريعي ومهاراتي التقنية ومساري المهني من خلال واجهة متجاوبة وسهلة الصيانة.",
        ],
        caseStudy: [
          {
            id: "features",
            heading: "الوظائف الأساسية",
            items: [
              "صفحة رئيسية متحركة",
              "مسارات ديناميكية للمشاريع باستخدام Next.js",
              "عرض تفاعلي للمهارات",
              "خط زمني للمسار المهني",
              "نموذج تواصل مدمج مع EmailJS",
              "تصميم متجاوب",
            ],
          },
          {
            id: "architecture",
            heading: "البنية",
            paragraphs: [
              "يتبع المشروع تنظيمًا قائمًا على المكونات، ويجمع بيانات المشاريع في مصدر مركزي لتسهيل الصيانة والتوسع مستقبلًا.",
            ],
          },
        ],
      },
      "ticket-management-system": {
        title: "Advanced Ticket Management System",
        category: "الواجهة الخلفية / تطبيق مؤسساتي",
        shortDescription:
          "REST API قيد التطوير باستخدام Spring Boot لإدارة تذاكر الدعم والمستخدمين ومسارات العمل المنظمة.",
        imageAlt: "معاينة النظام المتقدم لإدارة التذاكر",
        seo: {
          title: "REST API لإدارة التذاكر",
          description:
            "REST API قيد التطوير باستخدام Spring Boot لإدارة التذاكر والمستخدمين والتحقق وتخزين البيانات ومسارات العمل.",
        },
        introduction: [
          "REST API قيد التطوير باستخدام Spring Boot، تحاكي إدارة الحوادث وطلبات الدعم والمهام الداخلية في الشركات.",
        ],
        caseStudy: [
          {
            id: "workflow",
            heading: "المستخدمون ودورة حياة التذكرة",
            items: [
              "أدوار User وAgent وAdmin",
              "حالات OPEN وIN_PROGRESS وRESOLVED وCLOSED",
              "إدارة المستخدمين والتحضير للمصادقة",
            ],
          },
          {
            id: "architecture",
            heading: "بنية الواجهة الخلفية",
            items: [
              "طبقات Controller وService وRepository",
              "استخدام DTO لحماية الكيانات الداخلية",
              "طبقة Mapper لتحويل الكائنات",
              "تصميم RESTful API",
              "التحقق باستخدام Jakarta Validation",
              "تخزين البيانات باستخدام Spring Data JPA",
            ],
          },
          {
            id: "status",
            heading: "حالة المشروع",
            paragraphs: ["المشروع قيد التطوير حاليًا."],
          },
        ],
      },
      "resource-management-system": {
        title: "University Material Resource Management System",
        category: "Full-Stack / تطبيق مؤسساتي",
        shortDescription:
          "منصة لإدارة احتياجات المعدات الجامعية وطلبات العروض والموردين وتخصيص المخزون وعمليات الصيانة.",
        imageAlt: "معاينة النظام الجامعي لإدارة الموارد المادية",
        seo: {
          title: "إدارة الموارد المادية الجامعية",
          description:
            "منصة آمنة باستخدام Spring Boot لإدارة شراء المعدات والموردين والمخزون والتخصيص وعمليات الصيانة في الجامعة.",
        },
        introduction: [
          "نظام شامل مخصص للكليات الجامعية لإدارة دورة حياة الحواسيب والطابعات بين مختلف الأقسام.",
          "تربط المنصة رؤساء الأقسام ومسؤول الموارد ومصلحة الصيانة والموردين الخارجيين من خلال مسارات عمل مركزية وآمنة.",
        ],
        caseStudy: [
          {
            id: "procurement",
            heading: "طلبات العروض والمشتريات",
            items: [
              "جمع رؤساء الأقسام احتياجات الأساتذة من المعدات",
              "دراسة الاحتياجات والمصادقة عليها خلال اجتماع القسم",
              "تجميع مسؤول الموارد للطلبات في طلب عروض محدد بتاريخ بداية ونهاية",
              "تقديم الموردين عروضًا تشمل التسليم والضمان والعلامة والأسعار الوحدوية والإجمالي",
            ],
          },
          {
            id: "suppliers",
            heading: "إدارة الموردين",
            items: [
              "تسجيل الموردين بواسطة حساب شركة آمن",
              "إدراج المورد غير الملتزم في القائمة السوداء وإشعاره بسبب الرفض",
              "اختيار العرض الأقل سعرًا وإرسال إشعارات القبول أو الرفض",
            ],
          },
          {
            id: "inventory",
            heading: "المخزون والتخصيص",
            items: [
              "منح كل مورد مستلم رقم مخزون فريدًا على هيئة باركود",
              "تسجيل المعلومات التفصيلية لشركة المورد",
              "تخصيص الموارد لأستاذ بعينه أو لقسم كامل",
              "عرض الموارد والتخصيصات وتعديلها وحذفها",
            ],
          },
          {
            id: "maintenance",
            heading: "الصيانة والإبلاغ عن الأعطال",
            items: [
              "إبلاغ الأساتذة مصلحة الصيانة بأعطال المعدات",
              "توثيق التقنيين للأعطال الخطيرة وتاريخها وتكرارها ونوعها البرمجي أو المادي",
              "اتخاذ مسؤول الموارد قرار إعادة المورد المشمول بالضمان لإصلاحه أو استبداله",
            ],
          },
          {
            id: "architecture",
            heading: "البنية والتحكم في الوصول",
            paragraphs: [
              "تتبع الواجهة الخلفية طبقات Controller وService وRepository، وتؤمّن أدوار رئيس القسم ومسؤول الموارد والتقني والمورد والأستاذ.",
            ],
          },
        ],
      },
      "water-potability-ml": {
        title: "Water Potability Prediction System",
        category: "التعلم الآلي / علم البيانات",
        shortDescription:
          "مسار ML متكامل وتطبيق Streamlit للتنبؤ بصلاحية المياه للشرب انطلاقًا من قياسات فيزيائية وكيميائية.",
        imageAlt: "معاينة تطبيق التنبؤ بصلاحية المياه للشرب",
        seo: {
          title: "التنبؤ بصلاحية المياه باستخدام ML",
          description:
            "دراسة Machine Learning متكاملة وتطبيق Streamlit للتنبؤ بصلاحية المياه مع إعطاء الأولوية لمخاطر السلامة.",
        },
        introduction: [
          "دراسة متكاملة في Machine Learning تتنبأ بصلاحية المياه للشرب اعتمادًا على تسعة قياسات فيزيائية وكيميائية.",
          "تعطي عملية التقييم الأولوية لتقليل خطر تصنيف المياه غير الصالحة على أنها آمنة للشرب.",
        ],
        caseStudy: [
          {
            id: "data",
            heading: "مجموعة البيانات والمتغيرات",
            paragraphs: [
              "توفر مجموعة water_potability.csv متغيرات pH وHardness وSolids وChloramines وSulfate وConductivity وOrganic Carbon وTrihalomethanes وTurbidity.",
            ],
            metrics: [{ label: "متغيرات الإدخال", value: "9" }],
          },
          {
            id: "feature-importance",
            heading: "أهمية المتغيرات",
            items: [
              "تستخدم Decision Tree بعمق أقصى قدره 5 لترتيب مساهمة كل متغير",
              "تُعرض أهمية المتغيرات في مخطط أعمدة",
            ],
          },
          {
            id: "missing-values",
            heading: "استراتيجيات القيم المفقودة",
            items: [
              "تعوض الاستراتيجية الأولى القيم المفقودة بوسيط كل عمود مع الاحتفاظ بجميع الصفوف والأعمدة",
              "تحذف الاستراتيجية الثانية الصفوف التي تتضمن قيمًا مفقودة",
              "يُدرّب كل من Random Forest وKNN وSVM ويُقيّم ضمن الاستراتيجيتين",
            ],
          },
          {
            id: "evaluation",
            heading: "تقييم النموذج واختياره",
            items: [
              "المقياس الرئيسي: الاستدعاء للفئة 0 التي تمثل المياه غير الصالحة للشرب",
              "المقاييس الثانوية: Accuracy وF1-score وROC-AUC",
              "مصفوفات الالتباس ومنحنيات ROC لكل نموذج واستراتيجية",
              "حفظ أفضل نموذج وScaler في ملفات .pkl",
              "تقييم الإعداد المختار باستخدام تحقق متقاطع من 3 طيات",
            ],
          },
          {
            id: "application",
            heading: "تطبيق Streamlit",
            items: [
              "إدخال يدوي للمعلمات التسع",
              "تنبؤ فوري: صالحة أو غير صالحة للشرب",
              "عرض درجة قرار SVM والمسافة عن حد القرار",
              "اختبار سريع انطلاقًا من صف في مجموعة البيانات",
              "سجل كامل للتنبؤات مع تصدير CSV",
            ],
          },
        ],
      },
      "customer-churn-prediction": {
        title: "Customer Churn Prediction",
        category: "التعلم الآلي / علم البيانات",
        shortDescription:
          "نظام متكامل للتنبؤ بتسرب العملاء يجمع قابلية التفسير وFastAPI للاستدلال وتطبيق ويب متجاوب.",
        imageAlt: "معاينة تطبيق التنبؤ بتسرب العملاء",
        seo: {
          title: "التنبؤ بتسرب العملاء",
          description:
            "مسار قابل للتفسير للتنبؤ بتسرب العملاء، مع ضبط العتبة وFastAPI واختبارات آلية ونشر باستخدام Docker.",
        },
        introduction: [
          "نظام Machine Learning متكامل يتنبأ بتسرب العملاء ويحوّل احتمالات النموذج إلى مؤشرات عملية تدعم جهود الاحتفاظ بالعملاء.",
        ],
        caseStudy: [
          {
            id: "business-goal",
            heading: "الهدف العملي",
            items: [
              "تحديد العملاء المرجح مغادرتهم",
              "إنتاج احتمال تسرب لكل عميل",
              "مساعدة فرق الاحتفاظ على ترتيب العملاء المعرضين للخطر حسب الأولوية",
            ],
          },
          {
            id: "data",
            heading: "البيانات والتحليل الاستكشافي",
            items: [
              "مجموعة IBM Telco Customer Churn التي تضم 7,043 عميلًا",
              "تحليل توزيع التسرب وعدم توازن الفئات",
              "دراسة tenure وContract وMonthlyCharges وInternetService وTechSupport وPaymentMethod وغيرها من خصائص العملاء",
            ],
          },
          {
            id: "machine-learning",
            heading: "منهجية Machine Learning",
            items: [
              "معالجة مسبقة تمنع تسرب البيانات وFeature Engineering حتمي",
              "مقارنة Logistic Regression وDecision Tree وRandom Forest وGradient Boosting",
              "اختيار مسار Logistic Regression نهائيًا",
              "ضبط عتبة التشغيل عند 0.30 وفق موازنة الدقة والاستدعاء المطلوبة مهنيًا",
            ],
          },
          {
            id: "results",
            heading: "النتائج المتحقق منها",
            metrics: [
              { label: "ROC-AUC على بيانات الاختبار", value: "0.8429" },
              { label: "حالات التسرب المكتشفة", value: "285 من 374" },
              { label: "عتبة التشغيل", value: "0.30" },
            ],
          },
          {
            id: "explainability",
            heading: "قابلية التفسير",
            paragraphs: [
              "تُستخدم معاملات النموذج وSHAP لتحليل التأثير العام للمتغيرات وشرح العوامل المرتبطة بالتنبؤات من دون تقديم ادعاءات سببية.",
            ],
          },
          {
            id: "production",
            heading: "API والتطبيق",
            items: [
              "حفظ مسار المعالجة المسبقة وLogistic Regression كاملًا",
              "نماذج Pydantic متحقق منها ومعروضة عبر FastAPI",
              "Endpoints للصحة ومعلومات النموذج والتنبؤ الفردي والدُفعي مع توثيق Swagger",
              "واجهة متجاوبة تتضمن 19 مدخلًا للعميل والاحتمال والتنبؤ وعتبة التشغيل",
            ],
          },
          {
            id: "validation",
            heading: "الاختبارات وDocker",
            metrics: [
              { label: "الاختبارات الآلية", value: "39 ناجحة" },
              { label: "التحققات النهائية", value: "70 مكتملة" },
            ],
            items: [
              "التحقق من سلامة حاوية Docker",
              "تطابق التنبؤات والنموذج بين Python وFastAPI محليًا وبيئة Docker",
            ],
          },
        ],
      },
      "football-intelligence-player-recommendation-system": {
        title: "Football Intelligence & Player Recommendation System",
        category: "علم البيانات / نظام توصية",
        shortDescription:
          "منصة متكاملة لتحليل اللاعبين والتشابه الإحصائي والكشف والتوصية بالبدائل واكتشاف المواهب الرياضية.",
        imageAlt: "معاينة منصة ذكاء كرة القدم والتوصية باللاعبين",
        seo: {
          title: "نظام توصية لاعبي كرة القدم",
          description:
            "منصة ذكاء كروي تجمع التحليلات والتشابه والكشف وFastAPI وReact وتوصيات قابلة للتفسير.",
        },
        introduction: [
          "نظام متكامل لذكاء كرة القدم والتوصية باللاعبين، يحوّل بيانات الأداء إلى رؤى قابلة للتفسير لدعم الكشف والاستقطاب.",
        ],
        caseStudy: [
          {
            id: "business-goal",
            heading: "الهدف العملي",
            items: [
              "استكشاف اللاعبين استنادًا إلى أدلة إحصائية",
              "إيجاد لاعبين بملامح أداء متشابهة إحصائيًا",
              "بناء قوائم ترشيح وفق متطلبات رياضية",
              "تحديد بدلاء محتملين",
              "مقارنة اللاعبين ضمن سياقات المراكز المناسبة",
              "إبراز لاعبين أقل شهرة يملكون مؤشرات قوية نسبة إلى مراكزهم",
            ],
          },
          {
            id: "data-science",
            heading: "علم البيانات وتحليلات كرة القدم",
            items: [
              "جمع بيانات أحداث كرة القدم واللاعبين والتحقق منها وتنظيفها وإعدادها",
              "بناء ملفات لاعب-فريق-مسابقة-موسم ضمن سياقها",
              "Feature Engineering يراعي مركز اللاعب",
              "مقاييس لكل 90 دقيقة ونسب مئوية مقارنة بالمركز",
              "ملفات Radar ومقارنات تحليلية",
            ],
          },
          {
            id: "recommendation",
            heading: "نظام التوصية",
            items: [
              "استخدام Cosine Similarity على ملفات إحصائية مطبّعة",
              "منطق توصية بين لاعبي المركز نفسه",
              "كشف ذكي بقيود صارمة وتفضيلات رياضية موزونة",
              "توصية بالبدلاء مع استبعاد الفريق المرجعي",
              "اكتشاف Sporting Hidden Gems بناءً على التعرض ونقاط القوة المئوية",
              "مخرجات قابلة للتفسير ومراعية للسياق",
            ],
          },
          {
            id: "application",
            heading: "الواجهة الخلفية والتطبيق",
            items: [
              "خدمات علم بيانات معروضة باستخدام FastAPI وPydantic",
              "REST endpoints للاعبين والملفات والتشابه والكشف والبدلاء وHidden Gems والمقارنة والتحليلات",
              "واجهة React وTypeScript لاستكشاف اللاعبين ومخططات Radar والمقارنة ومسارات الكشف والتحليلات",
              "عميل API مركزي ومكتوب بأنواع واضحة يربط الواجهة الأمامية بخلفية التوصية",
            ],
          },
          {
            id: "validation",
            heading: "التحقق",
            items: [
              "اختبارات الواجهة الخلفية والتوصية والتحقق من البيانات وAPI",
              "تحققات TypeScript وESLint واختبارات المكونات وAPI وبناء الإنتاج للواجهة الأمامية",
              "اكتمال التدقيق التقني النهائي من دون مشكلات حرجة متبقية",
            ],
          },
        ],
      },
    },
  },
  certifications: {
    section: {
      titleLead: "شهاداتي",
      titleAccent: "المهنية",
      description:
        "شهادات تدعم معارفي في هندسة البرمجيات وعلم البيانات والتعلم الآلي وPython وJava.",
      viewAll: "عرض جميع الشهادات",
    },
    listing: {
      titleLead: "جميع",
      titleAccent: "الشهادات",
      description: "مجموعة الشهادات والاعتمادات الموثقة في ملفي المهني.",
      count: {
        zero: "لا توجد شهادات",
        one: "شهادة واحدة",
        two: "شهادتان",
        few: "{count} شهادات",
        many: "{count} شهادة",
        other: "{count} شهادة",
      },
      backToPortfolio: "العودة إلى الملف المهني",
      collectionLabel: "مجموعة الشهادات",
    },
    card: {
      preview: "معاينة",
      previewCertificate: "معاينة شهادة {certificate}",
      verify: "تحقق",
      verifyCertificate: "التحقق من الشهادة",
      viewOnLinkedIn: "العرض على LinkedIn",
      downloadCertificate: "تنزيل الشهادة",
    },
    modal: {
      dialogLabel: "معاينة الشهادة",
      closePreview: "إغلاق معاينة الشهادة",
      close: "إغلاق",
      imageLabel: "صورة الشهادة",
    },
    items: {
      "python-data-science-ai": {
        title: "Python for Data Science, AI & Development",
        issuer: "IBM (عبر Coursera)",
        imageAlt: "شهادة Python for Data Science, AI & Development الصادرة عن IBM عبر Coursera",
      },
      "supervised-ml-regression-classification": {
        title: "Supervised Machine Learning: Regression and Classification",
        issuer: "DeepLearning.AI (عبر Coursera)",
        imageAlt: "شهادة Supervised Machine Learning الصادرة عن DeepLearning.AI عبر Coursera",
      },
      "introduction-to-software-engineering": {
        title: "Introduction to Software Engineering",
        issuer: "IBM (عبر Coursera)",
        imageAlt: "شهادة Introduction to Software Engineering الصادرة عن IBM عبر Coursera",
      },
      "cs250-python-for-data-scientists": {
        title: "CS250: Python for Data Scientists",
        issuer: "Saylor Academy",
        imageAlt: "شهادة CS250: Python for Data Scientists الصادرة عن Saylor Academy",
      },
      "the-data-science-profession": {
        title: "The Data Science Profession",
        issuer: "University of London (عبر Coursera)",
        imageAlt: "شهادة The Data Science Profession الصادرة عن University of London عبر Coursera",
      },
      "spring-ecosystem-and-core": {
        title: "Spring — Ecosystem and Core",
        issuer: "LearnQuest (عبر Coursera)",
        imageAlt: "شهادة Spring Ecosystem and Core الصادرة عن LearnQuest عبر Coursera",
      },
      "introduction-to-machine-learning": {
        title: "Introduction to Machine Learning",
        issuer: "Duke University (عبر Coursera)",
        imageAlt: "شهادة Introduction to Machine Learning الصادرة عن Duke University عبر Coursera",
      },
      "java-explorer": {
        title: "Java Explorer",
        issuer: "Oracle",
        imageAlt: "اعتماد Java Explorer الصادر عن Oracle",
      },
      "python-for-machine-learning": {
        title: "Python for Machine Learning",
        issuer: "SimpliLearn",
        imageAlt: "شهادة Python for Machine Learning الصادرة عن SimpliLearn",
      },
      "kaggle-data-visualization": {
        title: "Data Visualization",
        issuer: "Kaggle",
        imageAlt: "شهادة Data Visualization الصادرة عن Kaggle",
      },
    },
  },
  contact: {
    titleLead: "لنبنِ",
    titleAccent: "شيئًا ذا قيمة",
    description:
      "أرحب بالنقاش حول المشاريع والأفكار التقنية والفرص التي يمكن لهندسة البرمجيات وعلم البيانات أن يقدما فيها قيمة عملية.",
    formLabel: "التواصل مع عصام الغبالي",
    fields: {
      name: {
        label: "الاسم",
        placeholder: "اسمك",
        requiredError: "يرجى إدخال اسمك.",
      },
      email: {
        label: "البريد الإلكتروني",
        placeholder: "you@example.com",
        requiredError: "يرجى إدخال بريدك الإلكتروني.",
        invalidError: "أدخل عنوان بريد إلكتروني صالحًا.",
      },
      message: {
        label: "الرسالة",
        placeholder: "عرّفني بمشروعك أو بالفرصة المتاحة",
        requiredError: "يرجى كتابة رسالة.",
      },
    },
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    success: "أُرسلت رسالتك بنجاح.",
    error: "تعذر إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    emailLabel: "مراسلة عصام الغبالي عبر البريد الإلكتروني",
    linkedinLabel: "عرض حساب عصام الغبالي على LinkedIn",
    githubLabel: "عرض حساب عصام الغبالي على GitHub",
  },
  footer: {
    copyright: "© {year} عصام الغبالي.",
    rights: "جميع الحقوق محفوظة.",
    navigationLabel: "روابط تذييل الصفحة",
  },
  breadcrumbs: {
    ariaLabel: "مسار التنقل",
    home: "الرئيسية",
    projects: "المشاريع",
    certifications: "الشهادات",
    separatorLabel: "الصفحة التالية",
  },
  notFound: {
    title: "الصفحة غير موجودة",
    description: "الصفحة المطلوبة غير موجودة أو لم تعد متاحة.",
    projectTitle: "المشروع غير موجود",
    projectDescription: "المشروع المطلوب غير موجود في هذا الملف المهني.",
    backHome: "العودة إلى الصفحة الرئيسية",
    backToProjects: "استعراض جميع المشاريع",
  },
  chatbot: {
    title: "مساعد عصام",
    subtitle: "دليل الملف المهني",
    dialogLabel: "مساعد الذكاء الاصطناعي في الملف المهني لعصام",
    open: "فتح مساعد الذكاء الاصطناعي",
    close: "إغلاق مساعد الذكاء الاصطناعي",
    inputPlaceholder: "اسأل عن عصام…",
    inputLabel: "رسالة إلى مساعد الذكاء الاصطناعي الخاص بعصام",
    send: "إرسال الرسالة",
    thinking: "يُعد مساعد عصام الإجابة",
    disclaimer: "تعتمد الإجابات فقط على المعلومات الموثقة في ملف عصام المهني وسيرته الذاتية.",
    welcome:
      "مرحبًا! أنا مساعد الذكاء الاصطناعي في الملف المهني لعصام. يمكنك سؤالي عن خبرته أو مشاريعه أو مهاراته أو دراسته أو شهاداته. تعتمد إجاباتي فقط على المعلومات الموثقة في ملفه المهني وسيرته الذاتية.",
    unavailable: "تعذر الوصول إلى المساعد. تحقق من اتصالك ثم حاول مرة أخرى.",
    suggestions: [
      "عرّفني بعصام",
      "اعرض أفضل مشاريعه",
      "ما أبرز مهاراته؟",
      "اعرض شهاداته",
    ],
    userMessageLabel: "رسالتك",
    assistantMessageLabel: "إجابة المساعد",
    unreadOne: "إجابة واحدة غير مقروءة من المساعد",
    unreadMany: "{count} إجابات غير مقروءة من المساعد",
    resources: {
      types: {
        project: "مشروع",
        certificate: "شهادة",
        pdf: "PDF",
        image: "صورة",
        github: "GitHub",
        link: "رابط",
      },
      actions: {
        project: "عرض المشروع",
        certificate: "التحقق من الشهادة",
        pdf: "عرض السيرة الذاتية",
        image: "عرض الصورة",
        github: "فتح GitHub",
        link: "فتح الرابط",
      },
    },
  },
  seo: {
    titleTemplate: "%s | عصام الغبالي",
    defaultTitle: "عصام الغبالي — مطوّر Full-Stack وData Scientist",
    defaultDescription:
      "الملف المهني لعصام الغبالي، مطوّر Full-Stack وData Scientist يعمل باستخدام Java وSpring Boot وReact وPython والتعلم الآلي.",
    home: {
      title: "مطوّر Full-Stack وData Scientist",
      description:
        "اكتشف مشاريع عصام الغبالي في Full-Stack وعلم البيانات والتعلم الآلي، إلى جانب مهاراته ومساره وشهاداته.",
    },
    projects: {
      title: "مشاريع البرمجيات وعلم البيانات",
      description:
        "استعرض عشرة مشاريع تشمل Spring Boot وReact وNext.js وعلم البيانات والتعلم الآلي وFastAPI وبنية برمجيات المؤسسات.",
    },
    certifications: {
      title: "شهادات علم البيانات والبرمجيات",
      description:
        "استعرض شهادات عصام الغبالي الموثقة في Python وعلم البيانات والتعلم الآلي وهندسة البرمجيات وSpring وJava.",
    },
    notFound: {
      title: "الصفحة غير موجودة",
      description: "تعذر العثور على الصفحة المطلوبة في هذا الملف المهني.",
    },
    openGraphImageAlt: "عصام الغبالي — مطوّر Full-Stack وData Scientist",
  },
  accessibility: {
    decorativeImageAlt: "",
    mainContentLabel: "المحتوى الرئيسي",
    sectionNavigationLabel: "أقسام الملف المهني",
    scrollTickerPaused: "توقفت قائمة التقنيات مؤقتًا",
    scrollTickerPlaying: "قائمة التقنيات متحركة",
    currentPage: "الصفحة الحالية",
    errorPrefix: "خطأ:",
    successPrefix: "تم بنجاح:",
  },
} as const satisfies PortfolioDictionary;

export default ar;
