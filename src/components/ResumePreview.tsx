'use client';

import { useRef } from 'react';
import { Download, Mail, Phone, MapPin, Globe, Linkedin, Calendar, Award } from 'lucide-react';
import { ResumeData } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumePreviewProps {
  resumeData: ResumeData;
  onNewResume: () => void;
}

export default function ResumePreview({ resumeData, onNewResume }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!resumeRef.current) return;

    try {
      // Configurar para alta qualidade
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: resumeRef.current.scrollWidth,
        height: resumeRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Se o conteúdo for muito alto, adicionar páginas
      if (imgHeight * ratio > pdfHeight) {
        let position = pdfHeight;
        while (position < imgHeight * ratio) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', imgX, -position, imgWidth * ratio, imgHeight * ratio);
          position += pdfHeight;
        }
      }

      // Download do PDF
      const fileName = `curriculo-${resumeData.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${months[parseInt(month) - 1]}/${year}`;
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Básico': return 'bg-gray-300';
      case 'Intermediário': return 'bg-blue-400';
      case 'Avançado': return 'bg-green-500';
      case 'Especialista': return 'bg-purple-600';
      default: return 'bg-gray-300';
    }
  };

  const getSkillWidth = (level: string) => {
    switch (level) {
      case 'Básico': return 'w-1/4';
      case 'Intermediário': return 'w-1/2';
      case 'Avançado': return 'w-3/4';
      case 'Especialista': return 'w-full';
      default: return 'w-1/4';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">✅ Pagamento Confirmado!</h1>
          <p className="text-gray-600">Seu currículo está pronto para download</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar PDF
          </button>
          <button
            onClick={onNewResume}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Novo Currículo
          </button>
        </div>
      </div>

      {/* Preview do Currículo */}
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
        <div 
          ref={resumeRef}
          className="bg-white p-8 min-h-[297mm]"
          style={{ width: '210mm', margin: '0 auto' }}
        >
          {/* Header do Currículo */}
          <div className="border-b-4 border-blue-600 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {resumeData.personalInfo.fullName}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm">{resumeData.personalInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm">{resumeData.personalInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm">
                    {resumeData.personalInfo.city}, {resumeData.personalInfo.state}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">{resumeData.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo Profissional */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 border-l-4 border-blue-600 pl-3">
              RESUMO PROFISSIONAL
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {resumeData.summary}
            </p>
          </div>

          {/* Experiências Profissionais */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
              EXPERIÊNCIA PROFISSIONAL
            </h2>
            <div className="space-y-4">
              {resumeData.experiences.map((exp, index) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{exp.position}</h3>
                      <p className="text-blue-600 font-semibold">{exp.company}</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formação Acadêmica */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
              FORMAÇÃO ACADÊMICA
            </h2>
            <div className="space-y-3">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {edu.degree} em {edu.field}
                      </h3>
                      <p className="text-blue-600">{edu.institution}</p>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {formatDate(edu.startDate)} - {edu.current ? 'Cursando' : formatDate(edu.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">
              HABILIDADES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.skills.map((skill, index) => (
                <div key={skill.id} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getSkillColor(skill.level)} ${getSkillWidth(skill.level)}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Currículo gerado em {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Próximos passos:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Clique em "Baixar PDF" para salvar seu currículo</li>
          <li>• Revise todas as informações antes de enviar para empresas</li>
          <li>• Personalize o currículo para cada vaga que se candidatar</li>
          <li>• Mantenha sempre atualizado com novas experiências</li>
        </ul>
      </div>

      {/* Avaliação */}
      <div className="mt-6 bg-green-50 rounded-lg p-4 text-center">
        <h3 className="font-semibold text-green-800 mb-2">⭐ Gostou do resultado?</h3>
        <p className="text-green-700 text-sm mb-3">
          Compartilhe com amigos que também precisam de um currículo profissional!
        </p>
        <button
          onClick={onNewResume}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          Criar Outro Currículo
        </button>
      </div>
    </div>
  );
}