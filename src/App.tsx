import React, { useState, useRef } from 'react';
import { Upload, Sparkles, FileText } from 'lucide-react';
import FileUpload from './components/FileUpload';
import Portfolio from './components/Portfolio';
import Header from './components/Header';
import { defaultResume } from './data/defaultResume';

function App() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioData] = useState(defaultResume);
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setShowPortfolio(false);
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header 
        onReset={showPortfolio ? handleReset : undefined} 
        showReset={showPortfolio}
        onFeaturesClick={!showPortfolio ? scrollToFeatures : undefined}
      />
      
      <main className="container mx-auto px-4 py-16">
        {!showPortfolio ? (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your Resume Into A
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"> Cute Portfolio</span>
            </h1>
            
            <p className="text-slate-300 text-xl mb-12">
              Upload your resume and let AI create a stunning portfolio website in seconds.
            </p>

            <div className="bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm border border-slate-700">
              <FileUpload 
                isUploading={false}
                setIsUploading={() => {}}
                onResumeProcessed={() => setShowPortfolio(true)}
              />
            </div>

            <div ref={featuresRef} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Upload className="w-6 h-6 text-purple-400" />}
                title="Easy Upload"
                description="Simply drag and drop your resume in Word format"
              />
              <FeatureCard 
                icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                title="AI-Powered"
                description="Advanced AI extracts and enhances your professional data"
              />
              <FeatureCard 
                icon={<FileText className="w-6 h-6 text-purple-400" />}
                title="Beautiful Result"
                description="Get a professionally designed portfolio in seconds"
              />
            </div>
          </div>
        ) : (
          <Portfolio data={portfolioData} />
        )}
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
      <div className="bg-slate-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

export default App;