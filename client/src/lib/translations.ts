/**
 * Arabic and English translations for Moga app
 * Supports RTL (Right-to-Left) for Arabic
 */

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation & Header
    adminDashboard: 'لوحة التحكم',
    trackRepair: 'تتبع الإصلاح',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    welcome: 'أهلا وسهلا',
    
    // Landing Page
    brandName: 'Moga',
    tagline: 'تتبع إصلاح جهازك بسهولة',
    heroTitle: 'تتبع جهازك مع Moga',
    heroSubtitle: 'احصل على تحديثات فورية حول حالة إصلاح جهازك، وتواصل مع فنيينا، وابق على اطلاع دائم في كل خطوة',
    
    // Slogans & Quotes
    slogan1: 'جودة الخدمة أولاً',
    slogan2: 'إصلاح سريع وآمن',
    slogan3: 'ثقتك هي أولويتنا',
    slogan4: 'تكنولوجيا حديثة لخدمة أفضل',
    slogan5: 'فريق محترف في خدمتك',
    
    quote1: 'نحن لا نصلح الأجهزة فقط، نحن نصلح ثقتك بنا',
    quote2: 'كل جهاز لديك مهم لنا كما هو مهم لك',
    quote3: 'سرعة الخدمة وجودتها يسيران معاً',
    quote4: 'فريقنا مدرب على أعلى المعايير العالمية',
    
    // Tracking
    enterTrackingCode: 'أدخل رمز التتبع',
    trackingCodePlaceholder: 'مثال: TRACK-2024-001234',
    track: 'تتبع',
    trackingCode: 'رمز التتبع',
    deviceNotFound: 'لم يتم العثور على الجهاز',
    
    // Repair Stages
    received: 'تم الاستقبال',
    diagnosing: 'قيد التشخيص',
    repairing: 'قيد الإصلاح',
    qualityCheck: 'فحص الجودة',
    readyForPickup: 'جاهز للاستلام',
    
    // Device Info
    deviceModel: 'موديل الجهاز',
    issue: 'المشكلة',
    estimatedCompletion: 'التاريخ المتوقع للإنجاز',
    actualCompletion: 'تاريخ الإنجاز الفعلي',
    
    // Cost
    costBreakdown: 'تفصيل التكاليف',
    partsPrice: 'سعر الأجزاء',
    laborPrice: 'سعر العمل',
    totalPrice: 'السعر الإجمالي',
    
    // Messaging
    messages: 'الرسائل',
    sendMessage: 'إرسال رسالة',
    typeMessage: 'اكتب رسالتك هنا...',
    noMessages: 'لا توجد رسائل حتى الآن',
    technician: 'الفني',
    customer: 'العميل',
    
    // Notifications
    notificationsMenu: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات',
    statusUpdated: 'تم تحديث الحالة',
    deviceReady: 'جهازك جاهز للاستلام',
    
    // Feedback
    feedback: 'التقييم والمراجعة',
    rating: 'التقييم',
    review: 'المراجعة',
    submitFeedback: 'إرسال التقييم',
    serviceSpeed: 'سرعة الخدمة',
    staffBehavior: 'سلوك الموظفين',
    repairQuality: 'جودة الإصلاح',
    comment: 'التعليق',
    
    // Admin Dashboard
    adminPanel: 'لوحة التحكم',
    createJob: 'إنشاء وظيفة جديدة',
    allJobs: 'جميع الوظائف',
    activeJobs: 'الوظائف النشطة',
    completedJobs: 'الوظائف المكتملة',
    jobDetails: 'تفاصيل الوظيفة',
    updateStage: 'تحديث المرحلة',
    addNotes: 'إضافة ملاحظات',
    
    // Analytics
    analytics: 'التحليلات',
    jobsByStatus: 'الوظائف حسب الحالة',
    averageSatisfaction: 'متوسط الرضا',
    totalJobs: 'إجمالي الوظائف',
    completionRate: 'معدل الإنجاز',
    
    // AI Insights
    aiInsights: 'رؤى ذكية',
    generateInsights: 'توليد الرؤى',
    repairTrends: 'اتجاهات الإصلاح',
    commonIssues: 'المشاكل الشائعة',
    technicianPerformance: 'أداء الفني',
    
    // Form Labels
    customerName: 'اسم العميل',
    customerEmail: 'بريد العميل',
    customerPhone: 'هاتف العميل',
    issueDescription: 'وصف المشكلة',
    estimatedCompletionDate: 'التاريخ المتوقع للإنجاز',
    
    // Buttons
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    submit: 'إرسال',
    download: 'تحميل',
    share: 'مشاركة',
    
    // Messages
    success: 'نجح',
    error: 'خطأ',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    
    // Features
    realTimeTracking: 'تتبع فوري',
    liveChat: 'محادثة حية',
    qrCode: 'رمز QR',
    notifications: 'إشعارات',
    aiAnalytics: 'تحليلات ذكية',
    
    // Feature Descriptions
    realTimeTrackingDesc: 'تابع حالة جهازك في الوقت الفعلي',
    liveChatDesc: 'تحدث مباشرة مع فريقنا المتخصص',
    qrCodeDesc: 'امسح رمز QR للوصول الفوري',
    notificationsDesc: 'احصل على تنبيهات عند تحديث الحالة',
    aiAnalyticsDesc: 'رؤى ذكية حول أداء الخدمة',
  },
  en: {
    // Navigation & Header
    adminDashboard: 'Admin Dashboard',
    trackRepair: 'Track Repair',
    logout: 'Logout',
    login: 'Login',
    welcome: 'Welcome',
    
    // Landing Page
    brandName: 'Moga',
    tagline: 'Track Your Device Repair Easily',
    heroTitle: 'Track Your Device with Moga',
    heroSubtitle: 'Get instant updates on your device repair status, communicate with our technicians, and stay informed every step of the way',
    
    // Slogans & Quotes
    slogan1: 'Quality Service First',
    slogan2: 'Fast and Secure Repair',
    slogan3: 'Your Trust is Our Priority',
    slogan4: 'Modern Technology for Better Service',
    slogan5: 'Professional Team at Your Service',
    
    quote1: 'We don\'t just fix devices, we fix your trust in us',
    quote2: 'Every device you own matters to us as much as it matters to you',
    quote3: 'Speed and quality go hand in hand',
    quote4: 'Our team is trained to the highest international standards',
    
    // Tracking
    enterTrackingCode: 'Enter Your Tracking Code',
    trackingCodePlaceholder: 'e.g., TRACK-2024-001234',
    track: 'Track',
    trackingCode: 'Tracking Code',
    deviceNotFound: 'Device Not Found',
    
    // Repair Stages
    received: 'Received',
    diagnosing: 'Diagnosing',
    repairing: 'Repairing',
    qualityCheck: 'Quality Check',
    readyForPickup: 'Ready for Pickup',
    
    // Device Info
    deviceModel: 'Device Model',
    issue: 'Issue',
    estimatedCompletion: 'Estimated Completion',
    actualCompletion: 'Actual Completion',
    
    // Cost
    costBreakdown: 'Cost Breakdown',
    partsPrice: 'Parts Price',
    laborPrice: 'Labor Price',
    totalPrice: 'Total Price',
    
    // Messaging
    messages: 'Messages',
    sendMessage: 'Send Message',
    typeMessage: 'Type your message here...',
    noMessages: 'No messages yet',
    technician: 'Technician',
    customer: 'Customer',
    
    // Notifications
    notificationsMenu: 'Notifications',
    noNotifications: 'No notifications',
    statusUpdated: 'Status Updated',
    deviceReady: 'Your device is ready for pickup',
    
    // Feedback
    feedback: 'Feedback & Review',
    rating: 'Rating',
    review: 'Review',
    submitFeedback: 'Submit Feedback',
    serviceSpeed: 'Service Speed',
    staffBehavior: 'Staff Behavior',
    repairQuality: 'Repair Quality',
    comment: 'Comment',
    
    // Admin Dashboard
    adminPanel: 'Admin Panel',
    createJob: 'Create New Job',
    allJobs: 'All Jobs',
    activeJobs: 'Active Jobs',
    completedJobs: 'Completed Jobs',
    jobDetails: 'Job Details',
    updateStage: 'Update Stage',
    addNotes: 'Add Notes',
    
    // Analytics
    analytics: 'Analytics',
    jobsByStatus: 'Jobs by Status',
    averageSatisfaction: 'Average Satisfaction',
    totalJobs: 'Total Jobs',
    completionRate: 'Completion Rate',
    
    // AI Insights
    aiInsights: 'AI Insights',
    generateInsights: 'Generate Insights',
    repairTrends: 'Repair Trends',
    commonIssues: 'Common Issues',
    technicianPerformance: 'Technician Performance',
    
    // Form Labels
    customerName: 'Customer Name',
    customerEmail: 'Customer Email',
    customerPhone: 'Customer Phone',
    issueDescription: 'Issue Description',
    estimatedCompletionDate: 'Estimated Completion Date',
    
    // Buttons
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    submit: 'Submit',
    download: 'Download',
    share: 'Share',
    
    // Messages
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    noData: 'No data available',
    
    // Features
    realTimeTracking: 'Real-Time Tracking',
    liveChat: 'Live Chat',
    qrCode: 'QR Code',
    notifications: 'Notifications',
    aiAnalytics: 'AI Analytics',
    
    // Feature Descriptions
    realTimeTrackingDesc: 'Track your device status in real-time',
    liveChatDesc: 'Talk directly with our specialist team',
    qrCodeDesc: 'Scan QR code for instant access',
    notificationsDesc: 'Get alerts when status updates',
    aiAnalyticsDesc: 'Smart insights about service performance',
  },
};

export const getTranslation = (key: keyof typeof translations.ar, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
};
