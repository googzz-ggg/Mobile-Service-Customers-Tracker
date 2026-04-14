import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Smartphone, MessageSquare, BarChart3, Zap, Shield, Clock, Star, ArrowRight, QrCode } from 'lucide-react';

export default function Home() {
  const { t, language, dir } = useLanguage();
  const [trackingCode, setTrackingCode] = useState('');
  const [, setLocation] = useLocation();

  const handleTrack = () => {
    if (trackingCode.trim()) {
      setLocation(`/track/${trackingCode}`);
    }
  };

  const features = [
    {
      icon: Zap,
      titleAr: 'تتبع فوري',
      titleEn: 'Real-Time Tracking',
      descAr: 'تابع حالة جهازك في الوقت الفعلي',
      descEn: 'Track your device status instantly',
    },
    {
      icon: MessageSquare,
      titleAr: 'محادثة حية',
      titleEn: 'Live Chat',
      descAr: 'تحدث مباشرة مع فريقنا المتخصص',
      descEn: 'Chat directly with our specialists',
    },
    {
      icon: QrCode,
      titleAr: 'رمز QR',
      titleEn: 'QR Code',
      descAr: 'امسح الرمز للوصول الفوري',
      descEn: 'Scan for instant access',
    },
    {
      icon: BarChart3,
      titleAr: 'تحليلات ذكية',
      titleEn: 'Smart Analytics',
      descAr: 'رؤى حول أداء الخدمة',
      descEn: 'Service performance insights',
    },
  ];

  const testimonials = [
    {
      nameAr: 'أحمد محمود',
      nameEn: 'Ahmed Mahmoud',
      deviceAr: 'iPhone 14 Pro',
      deviceEn: 'iPhone 14 Pro',
      commentAr: 'خدمة ممتازة وسريعة جداً، فريق احترافي جداً',
      commentEn: 'Excellent and very fast service, very professional team',
      rating: 5,
    },
    {
      nameAr: 'فاطمة علي',
      nameEn: 'Fatima Ali',
      deviceAr: 'Samsung Galaxy S23',
      deviceEn: 'Samsung Galaxy S23',
      commentAr: 'تطبيق رائع وسهل الاستخدام، تحديثات فورية',
      commentEn: 'Amazing and easy-to-use app, instant updates',
      rating: 5,
    },
    {
      nameAr: 'محمد خالد',
      nameEn: 'Mohammed Khaled',
      deviceAr: 'MacBook Pro',
      deviceEn: 'MacBook Pro',
      commentAr: 'أفضل خدمة إصلاح جهاز في المدينة',
      commentEn: 'Best device repair service in the city',
      rating: 5,
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Moga
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'تتبع جهازك مع Moga' : 'Track Your Device with Moga'}
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'احصل على تحديثات فورية حول حالة إصلاح جهازك، وتواصل مع فنيينا، وابق على اطلاع دائم في كل خطوة'
                : 'Get instant updates on your device repair status, communicate with our technicians, and stay informed every step of the way'}
            </p>

            {/* Tracking Input */}
            <div className="flex gap-2 max-w-md mx-auto mb-8">
              <Input
                placeholder={language === 'ar' ? 'مثال: TRACK-2024-001234' : 'e.g., TRACK-2024-001234'}
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                className="bg-slate-800/50 border-blue-500/30 text-white placeholder-gray-500"
              />
              <Button
                onClick={handleTrack}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6"
              >
                {language === 'ar' ? 'تتبع' : 'Track'}
                <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </div>
          </div>

          {/* Slogans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <div className="glass-card p-6 text-center">
              <p className="text-lg font-semibold text-blue-300">
                {language === 'ar' ? 'جودة الخدمة أولاً' : 'Quality Service First'}
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-lg font-semibold text-cyan-300">
                {language === 'ar' ? 'إصلاح سريع وآمن' : 'Fast and Secure Repair'}
              </p>
            </div>
            <div className="glass-card p-6 text-center">
              <p className="text-lg font-semibold text-blue-300">
                {language === 'ar' ? 'ثقتك هي أولويتنا' : 'Your Trust is Our Priority'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-blue-300">
            {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="glass-card p-8 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <Icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h4 className="text-xl font-bold mb-2">
                    {language === 'ar' ? feature.titleAr : feature.titleEn}
                  </h4>
                  <p className="text-gray-400">
                    {language === 'ar' ? feature.descAr : feature.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-cyan-300">
            {language === 'ar' ? 'لماذا تختار Moga؟' : 'Why Choose Moga?'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-l-4 border-blue-500">
              <div className="flex gap-4 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg italic mb-4 text-gray-200">
                {language === 'ar'
                  ? 'نحن لا نصلح الأجهزة فقط، نحن نصلح ثقتك بنا'
                  : 'We don\'t just fix devices, we fix your trust in us'}
              </p>
              <p className="text-blue-300 font-semibold">
                {language === 'ar' ? 'فريقنا المحترف' : 'Our Professional Team'}
              </p>
            </div>

            <div className="glass-card p-8 border-l-4 border-cyan-500">
              <div className="flex gap-4 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg italic mb-4 text-gray-200">
                {language === 'ar'
                  ? 'كل جهاز لديك مهم لنا كما هو مهم لك'
                  : 'Every device you own matters to us as much as it matters to you'}
              </p>
              <p className="text-cyan-300 font-semibold">
                {language === 'ar' ? 'خدمة شخصية' : 'Personal Service'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 text-blue-300">
            {language === 'ar' ? 'آراء عملائنا' : 'Customer Reviews'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="glass-card p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-200 mb-6 italic">
                  "{language === 'ar' ? testimonial.commentAr : testimonial.commentEn}"
                </p>
                <div>
                  <p className="font-bold text-blue-300">
                    {language === 'ar' ? testimonial.nameAr : testimonial.nameEn}
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === 'ar' ? testimonial.deviceAr : testimonial.deviceEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
            {language === 'ar' ? 'ابدأ تتبع جهازك الآن' : 'Start Tracking Your Device Now'}
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            {language === 'ar'
              ? 'احصل على تحديثات فورية وتواصل مباشر مع فريقنا'
              : 'Get instant updates and direct communication with our team'}
          </p>
          <Button
            onClick={() => setLocation('/admin')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-8 py-6 text-lg"
          >
            {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
            <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-slate-900/50 py-8 px-4 text-center text-gray-400">
        <p>
          {language === 'ar'
            ? '© 2024 Moga. جميع الحقوق محفوظة'
            : '© 2024 Moga. All rights reserved'}
        </p>
      </footer>
    </div>
  );
}
