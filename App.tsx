import React, { useState } from 'react';

// 1. المكونات الأساسية (نضعها بين أقواس لأنها Named Exports)
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CourseLevels } from './components/CourseLevels';
import { SocialMediaKit } from './components/SocialMediaKit';
import { AdPromotion } from './components/AdPromotion';

// 2. مكون المدرس الذكي (بدون أقواس لأنه Default Export)
import AITutor from './components/AITutor';

// 3. استدعاء مكون محاكي الكول سنتر الجديد
import CallCenterSimulator from './components/CallCenterSimulator';

function App() {
  // حالة للتبديل التلقائي بين المدرس الذكي ومحاكي الكول سنتر
  const [activeTab, setActiveTab] = useState<'tutor' | 'simulator'>('tutor');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* القسم الرئيسي */}
      <Hero />
      
      {/* المميزات */}
      <Features />
      
      {/* مستويات الكورس */}
      <CourseLevels />

      {/* قسم المساعدين الأذكياء */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white" id="ai-tutor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#1a237e] sm:text-4xl">
              Interact with Our AI Assistants
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose general English tutoring or start specialized job training with our Call Center Simulator.
            </p>
          </div>

          {/* أزرار التبديل التفاعلية (Tabs) */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-gray-200/80 rounded-xl shadow-inner border border-gray-300">
              <button
                onClick={() => setActiveTab('tutor')}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeTab === 'tutor'
                    ? 'bg-[#1a237e] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎓 General English Tutor (Mr. Elite)
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  activeTab === 'simulator'
                    ? 'bg-[#1a237e] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📞 Call Center AI Simulator
              </button>
            </div>
          </div>
          
          {/* عرض المساعد المختار بناءً على التبويب النشط */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'tutor' ? (
              <AITutor />
            ) : (
              <CallCenterSimulator />
            )}
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
