import React from 'react';

// استيراد المكونات بشكل مباشر لتجنب أخطاء التصدير
// Direct imports to fix the build error
import Hero from './components/Hero';
import Features from './components/Features';
import CourseLevels from './components/CourseLevels';
import AITutor from './components/AITutor';
import SocialMediaKit from './components/SocialMediaKit';
import AdPromotion from './components/AdPromotion';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* القسم الرئيسي */}
      <Hero />
      
      {/* المميزات */}
      <Features />
      
      {/* مستويات الكورس */}
      <CourseLevels />

      {/* قسم المدرس الذكي Mr. Elite */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white" id="ai-tutor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a237e] sm:text-4xl">
              Talk to Mr. Elite
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Your AI Personal Tutor for British English. Practice Speaking, Reading & Writing.
            </p>
          </div>
          
          {/* استدعاء مكون المدرس الذكي */}
          <div className="max-w-4xl mx-auto">
            <AITutor />
          </div>
        </div>
      </section>

      {/* أدوات السوشيال ميديا */}
      <SocialMediaKit />
      
      {/* قسم الإعلانات */}
      <AdPromotion />
      
      {/* تذييل بسيط للصفحة */}
      <footer className="bg-[#1a237e] text-white py-8 text-center">
        <p>© 2026 Elite English Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
