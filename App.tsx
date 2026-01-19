import React from 'react';
// استدعاء كافة المكونات الـ 11 من المجلد الموحد
import { 
  Navbar, 
  Hero, 
  Features, 
  CourseLevels, 
  AITutor, 
  SocialMediaKit, 
  AdPromotion, 
  ContactBar, 
  SourceExplorer, 
  ProjectBlueprint, 
  GitPushModal 
} from './components';

const App = () => {
  return (
    <div className="bg-[#020617] text-white min-h-screen selection:bg-[#D4AF37] selection:text-black" dir="rtl">
      {/* شريط التنقل العلوي */}
      <Navbar />
      
      <main>
        {/* القسم الرئيسي (العنوان والشعار) */}
        <Hero />

        {/* قسم المميزات والأكواد الفنية */}
        <div id="features" className="animate-in">
          <Features />
          <ProjectBlueprint />
        </div>

        {/* قسم المسار الأكاديمي والمستويات */}
        <div id="levels" className="animate-in">
          <CourseLevels />
        </div>

        {/* قسم المدرس الذكي (الذكاء الاصطناعي الرئيسي) */}
        <div id="tutor" className="py-20 bg-gradient-to-b from-transparent to-black/20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif gold-gradient-text font-black mb-4 uppercase tracking-tighter">
              Elite AI Tutor
            </h2>
            <p className="text-slate-500 text-sm">تحدث مع مستر إليت، مساعدك الشخصي لإتقان اللكنة البريطانية.</p>
          </div>
          <AITutor />
        </div>

        {/* أدوات الترويج والسوشيال ميديا المدعومة بالذكاء الاصطناعي */}
        <div className="bg-[#010409]/50 border-y border-white/5">
          <SocialMediaKit />
          <AdPromotion />
        </div>
      </main>

      {/* شريط التواصل والفوتر */}
      <ContactBar />

      {/* أدوات المطورين العائمة (أسفل اليمين واليسار) */}
      <SourceExplorer />
      <GitPushModal />
    </div>
  );
};

export default App;
