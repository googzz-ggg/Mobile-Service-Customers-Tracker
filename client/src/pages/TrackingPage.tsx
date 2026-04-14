import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, AlertCircle, Download, MessageCircle } from "lucide-react";
import { useRoute } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { QRCodeSVG } from "qrcode.react";
import MessagingInterface from "@/components/MessagingInterface";
import RepairTimeline from "@/components/RepairTimeline";
import FeedbackForm from "@/components/FeedbackForm";
import NotificationFeed from "@/components/NotificationFeed";
import TechnicianNotes from "@/components/TechnicianNotes";
import CostBreakdown from "@/components/CostBreakdown";

const STAGE_ICONS: Record<string, React.ReactNode> = {
  Received: <CheckCircle2 className="w-5 h-5" />,
  Diagnosing: <Clock className="w-5 h-5" />,
  Repairing: <AlertCircle className="w-5 h-5" />,
  "Quality Check": <CheckCircle2 className="w-5 h-5" />,
  "Ready for Pickup": <CheckCircle2 className="w-5 h-5" />,
};

const STAGE_COLORS: Record<string, string> = {
  Received: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Diagnosing: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Repairing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Quality Check": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Ready for Pickup": "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function TrackingPage() {
  const { t, language, dir } = useLanguage();
  const [, params] = useRoute("/track/:trackingCode");
  const trackingCode = params?.trackingCode || "";

  const { data: job, isLoading, error } = trpc.repairs.getByTrackingCode.useQuery(
    { trackingCode },
    { enabled: !!trackingCode }
  );

  const { data: stages } = trpc.repairs.getStages.useQuery(
    { jobId: job?.id || 0 },
    { enabled: !!job?.id }
  );

  const { data: feedback } = trpc.feedback.getByJobId.useQuery(
    { jobId: job?.id || 0 },
    { enabled: !!job?.id }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-foreground/70">{language === 'ar' ? 'جاري تحميل حالة الإصلاح...' : 'Loading your repair status...'}</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir={dir}>
        <Card className="glass-card-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">{t('deviceNotFound')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70 mb-4">
              {language === 'ar' ? 'لم نتمكن من العثور على إصلاح برمز: ' : 'We couldn\'t find a repair with the code: '}<span className="font-mono">{trackingCode}</span>
            </p>
            <p className="text-sm text-foreground/50">
              {language === 'ar' ? 'يرجى التحقق من رمز التتبع الخاص بك والمحاولة مرة أخرى.' : 'Please check your tracking code and try again. If you received a QR code or tracking link, make sure you\'re using the correct one.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = job.currentStage === "Ready for Pickup";
  const estimatedDays = job.estimatedCompletionDate
    ? Math.ceil(
        (new Date(job.estimatedCompletionDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground mb-2">Moga {t('trackRepair')}</h1>
                <LanguageSwitcher />
              </div>
              <p className="text-foreground/60">
                {t('trackingCode')}: <span className="font-mono text-accent">{trackingCode}</span>
              </p>
            </div>
            <Badge className={`${STAGE_COLORS[job.currentStage]} border w-fit`}>
              {STAGE_ICONS[job.currentStage]}
              <span className="ml-2">{job.currentStage}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Info Card */}
            <Card className="glass-card-lg">
              <CardHeader>
                <CardTitle>{t('deviceModel')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">{t('deviceModel')}</p>
                    <p className="text-lg font-semibold text-foreground">{job.deviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">{t('issue')}</p>
                    <p className="text-lg font-semibold text-foreground">{job.issueDescription}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">{t('estimatedCompletion')}</p>
                    <p className="text-lg font-semibold text-accent">
                      {estimatedDays !== null ? (
                        estimatedDays > 0 ? (
                          `${estimatedDays} ${language === 'ar' ? 'أيام' : 'days'}`
                        ) : (
                          language === 'ar' ? 'اليوم' : 'Today'
                        )
                      ) : (
                        language === 'ar' ? 'قيد التحديد' : 'TBD'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <CostBreakdown
              estimatedCost={job.costEstimate}
              finalCost={undefined}
              status={job.currentStage}
            />

            {/* Notifications */}
            <NotificationFeed jobId={job.id} />

            {/* Repair Timeline */}
            <RepairTimeline stages={stages || []} currentStage={job.currentStage} />

            {/* Technician Notes */}
            {stages && <TechnicianNotes notes={stages} />}

            {/* Messaging Interface */}
            <MessagingInterface jobId={job.id} trackingCode={trackingCode} />

            {/* Feedback Form - Show when completed */}
            {isCompleted && !feedback && (
              <FeedbackForm jobId={job.id} trackingCode={trackingCode} />
            )}

            {/* Feedback Display - Show if already submitted */}
            {feedback && (
              <Card className="glass-card-lg border-green-500/30 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="text-green-300">Your Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < feedback.rating ? "text-yellow-400" : "text-foreground/20"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-foreground/60">({feedback.rating}/5)</span>
                  </div>
                  {feedback.comment && (
                    <p className="text-foreground/80 italic">"{feedback.comment}"</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - QR Code & Summary */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <Card className="glass-card-lg">
              <CardHeader>
                <CardTitle className="text-lg">{t('qrCode')}</CardTitle>
                <CardDescription>{language === 'ar' ? 'شارك هذا الرمز لتتبع إصلاحك' : 'Share this QR code to track your repair'}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-lg" data-qr-container="true">
                  <QRCodeSVG
                    value={`${window.location.origin}/track/${trackingCode}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const qrContainer = document.querySelector('[data-qr-container="true"]');
                    if (qrContainer) {
                      const svg = qrContainer.querySelector('svg');
                      if (svg) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const svgData = new XMLSerializer().serializeToString(svg);
                        const img = new Image();
                        img.onload = () => {
                          if (ctx) {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            const link = document.createElement('a');
                            link.href = canvas.toDataURL('image/png');
                            link.download = `repair-tracking-${trackingCode}.png`;
                            link.click();
                          }
                        };
                        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                      }
                    }
                  }}
                >
                  <Download className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('download')}
                </Button>
              </CardContent>
            </Card>

            {/* Status Summary */}
            <Card className="glass-card-lg">
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'ملخص الحالة' : 'Status Summary'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">{language === 'ar' ? 'تم الإنشاء' : 'Created'}</span>
                    <span className="text-foreground font-medium">
                      {new Date(job.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">{language === 'ar' ? 'آخر تحديث' : 'Last Updated'}</span>
                    <span className="text-foreground font-medium">
                      {new Date(job.updatedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>
                  {job.completedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">{language === 'ar' ? 'تم الإنجاز' : 'Completed'}</span>
                      <span className="text-green-300 font-medium">
                        {new Date(job.completedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="glass-card-lg">
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'هل تحتاج مساعدة؟' : 'Need Help?'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground/70">
                  {language === 'ar' ? 'استخدم واجهة الرسائل أعلاه للتواصل مع فنيينا مباشرة.' : 'Use the messaging interface above to communicate with our technicians directly.'}
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  <MessageCircle className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('sendMessage')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
