'use client';

import { useState, useEffect } from 'react';
import { FileText, CreditCard, Download, Sparkles, Zap, Shield } from 'lucide-react';
import ResumeForm from '@/components/ResumeForm';
import PaymentScreen from '@/components/PaymentScreen';
import ResumePreview from '@/components/ResumePreview';
import { ResumeData, AppStep } from '@/lib/types';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('form');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    const savedStep = localStorage.getItem('currentStep') as AppStep;
    
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
    
    if (savedStep && savedStep !== 'form') {
      setCurrentStep(savedStep);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (resumeData) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
    localStorage.setItem('currentStep', currentStep);
  }, [resumeData, currentStep]);

  const handleFormSubmit = (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('download');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleNewResume = () => {
    setResumeData(null);
    setCurrentStep('form');
    localStorage.removeItem('resumeData');
    localStorage.removeItem('currentStep');
  };

  const steps = [
    { id: 'form', title: 'Preencher Dados', icon: FileText, description: 'Complete suas informações profissionais' },
    { id: 'payment', title: 'Pagamento', icon: CreditCard, description: 'Pague via PIX de forma segura' },
    { id: 'download', title: 'Download', icon: Download, description: 'Baixe seu currículo em PDF' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Gerador de Currículo
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-purple-500 mr-1" />
                    Profissional
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-blue-500 mr-1" />
                    Rápido
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500 mr-1" />
                    Seguro
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center transition-all duration-300 ${
                      isActive ? 'text-purple-600 scale-105' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                          : isCompleted 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{step.title}</p>
                        <p className="text-xs opacity-75">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-px mx-6 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Progress */}
      <div className="md:hidden bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex justify-between items-center text-sm mb-3">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className={`flex-1 text-center transition-all duration-300 ${
                isActive 
                  ? 'text-purple-600 font-semibold scale-105' 
                  : isCompleted 
                    ? 'text-green-600 font-medium' 
                    : 'text-gray-400'
              }`}>
                {step.title}
              </div>
            );
          })}
        </div>
        <div className="flex space-x-2">
          {steps.map((_, index) => {
            const isActive = steps.findIndex(s => s.id === currentStep) >= index;
            return (
              <div key={index} className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                  : 'bg-gray-200'
              }`} />
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        {currentStep === 'form' && (
          <ResumeForm onSubmit={handleFormSubmit} />
        )}

        {currentStep === 'payment' && (
          <PaymentScreen 
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handleBackToForm}
          />
        )}

        {currentStep === 'download' && resumeData && (
          <ResumePreview 
            resumeData={resumeData}
            onNewResume={handleNewResume}
          />
        )}
      </main>

      {/* Footer - Apenas se estiver na tela inicial */}
      {currentStep === 'form' && (
        <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg mr-3">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Sobre o Gerador
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Crie currículos profissionais de forma rápida e segura. 
                  Seus dados não são armazenados em nossos servidores.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">Características</h3>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                    Design profissional moderno
                  </li>
                  <li className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                    Sem cadastro necessário
                  </li>
                  <li className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                    Pagamento seguro via PIX
                  </li>
                  <li className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                    Download imediato em PDF
                  </li>
                </ul>
              </div>
              
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end mb-4">
                  <h3 className="font-bold text-xl text-gray-800 mr-3">Processo Simples</h3>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-end text-gray-600">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">1</span>
                    Preencha seus dados
                  </div>
                  <div className="flex items-center justify-center md:justify-end text-gray-600">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">2</span>
                    Realize o pagamento
                  </div>
                  <div className="flex items-center justify-center md:justify-end text-gray-600">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">3</span>
                    Baixe seu currículo
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8 mt-8 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-2"></div>
                <p className="text-gray-500">© 2024 Gerador de Currículo. Todos os direitos reservados.</p>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full ml-2"></div>
              </div>
              <p className="text-sm text-gray-400">
                🔒 Pagamentos processados com segurança pela EfiPay
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}