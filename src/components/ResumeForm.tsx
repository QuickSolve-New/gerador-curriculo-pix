'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, User, Briefcase, GraduationCap, Award, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { ResumeData } from '@/lib/types';

const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, 'Nome completo é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    address: z.string().min(5, 'Endereço é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    zipCode: z.string().min(8, 'CEP inválido'),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.string().min(50, 'Resumo deve ter pelo menos 50 caracteres'),
  experiences: z.array(z.object({
    id: z.string(),
    company: z.string().min(2, 'Nome da empresa é obrigatório'),
    position: z.string().min(2, 'Cargo é obrigatório'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string(),
    current: z.boolean(),
    description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres'),
  })).min(1, 'Adicione pelo menos uma experiência'),
  education: z.array(z.object({
    id: z.string(),
    institution: z.string().min(2, 'Nome da instituição é obrigatório'),
    degree: z.string().min(2, 'Grau é obrigatório'),
    field: z.string().min(2, 'Área de estudo é obrigatória'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string(),
    current: z.boolean(),
  })).min(1, 'Adicione pelo menos uma formação'),
  skills: z.array(z.object({
    id: z.string(),
    name: z.string().min(2, 'Nome da habilidade é obrigatório'),
    level: z.enum(['Básico', 'Intermediário', 'Avançado', 'Especialista']),
  })).min(3, 'Adicione pelo menos 3 habilidades'),
});

interface ResumeFormProps {
  onSubmit: (data: ResumeData) => void;
}

export default function ResumeForm({ onSubmit }: ResumeFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        linkedin: '',
        website: '',
      },
      summary: '',
      experiences: [{ 
        id: '1', 
        company: '', 
        position: '', 
        startDate: '', 
        endDate: '', 
        current: false, 
        description: '' 
      }],
      education: [{ 
        id: '1', 
        institution: '', 
        degree: '', 
        field: '', 
        startDate: '', 
        endDate: '', 
        current: false 
      }],
      skills: [
        { id: '1', name: '', level: 'Intermediário' },
        { id: '2', name: '', level: 'Intermediário' },
        { id: '3', name: '', level: 'Intermediário' }
      ],
    }
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experiences'
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const sections = [
    { title: 'Dados Pessoais', icon: User, color: 'from-blue-500 to-cyan-500' },
    { title: 'Resumo Profissional', icon: User, color: 'from-purple-500 to-pink-500' },
    { title: 'Experiências', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
    { title: 'Formação', icon: GraduationCap, color: 'from-orange-500 to-red-500' },
    { title: 'Habilidades', icon: Award, color: 'from-indigo-500 to-purple-500' },
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-30"></div>
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl">
            <Sparkles className="w-12 h-12 text-white mx-auto" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Crie Seu Currículo
          </span>
          <br />
          <span className="text-gray-800">Profissional</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Transforme sua experiência em um currículo impactante que destaca suas qualidades e conquista oportunidades
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = index === currentSection;
            const isCompleted = index < currentSection;
            
            return (
              <div key={index} className="flex flex-col items-center relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 transform ${
                  isActive 
                    ? `bg-gradient-to-r ${section.color} text-white shadow-2xl scale-110` 
                    : isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                      : 'bg-white text-gray-400 shadow-md border-2 border-gray-200'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <Icon className="w-8 h-8" />
                  )}
                </div>
                <span className={`text-sm mt-3 font-medium text-center transition-all duration-300 ${
                  isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {section.title}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          />
        </div>
        <div className="text-center mt-3">
          <span className="text-sm font-medium text-gray-600">
            Etapa {currentSection + 1} de {sections.length}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Seção 0: Dados Pessoais */}
        {currentSection === 0 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Dados Pessoais</h2>
                <p className="text-gray-600">Vamos começar com suas informações básicas</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                <input
                  {...register('personalInfo.fullName')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="Seu nome completo"
                />
                {errors.personalInfo?.fullName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.fullName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  {...register('personalInfo.email')}
                  type="email"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="seu@email.com"
                />
                {errors.personalInfo?.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                <input
                  {...register('personalInfo.phone')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="(11) 99999-9999"
                />
                {errors.personalInfo?.phone && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CEP *</label>
                <input
                  {...register('personalInfo.zipCode')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="00000-000"
                />
                {errors.personalInfo?.zipCode && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.zipCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade *</label>
                <input
                  {...register('personalInfo.city')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="Sua cidade"
                />
                {errors.personalInfo?.city && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.city.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço *</label>
                <input
                  {...register('personalInfo.address')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="Rua, número, bairro"
                />
                {errors.personalInfo?.address && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
                <input
                  {...register('personalInfo.state')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="SP"
                />
                {errors.personalInfo?.state && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.personalInfo.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                <input
                  {...register('personalInfo.linkedin')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="linkedin.com/in/seuperfil"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                <input
                  {...register('personalInfo.website')}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50"
                  placeholder="www.seusite.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Seção 1: Resumo Profissional */}
        {currentSection === 1 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Resumo Profissional</h2>
                <p className="text-gray-600">Conte sua história profissional de forma impactante</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descreva brevemente sua experiência e objetivos profissionais *
              </label>
              <textarea
                {...register('summary')}
                rows={8}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 resize-none"
                placeholder="Ex: Profissional com 5 anos de experiência em desenvolvimento web, especializado em React e Node.js. Busco oportunidades para aplicar minhas habilidades em projetos desafiadores que impactem positivamente a vida das pessoas..."
              />
              {errors.summary && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.summary.message}
                </p>
              )}
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-500">
                  Caracteres: <span className={`font-semibold ${(watch('summary')?.length || 0) >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                    {watch('summary')?.length || 0}
                  </span> (mínimo 50)
                </p>
                {(watch('summary')?.length || 0) >= 50 && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Perfeito!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Seção 2: Experiências */}
        {currentSection === 2 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl mr-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Experiências Profissionais</h2>
                  <p className="text-gray-600">Destaque suas conquistas e responsabilidades</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => appendExperience({ 
                  id: Date.now().toString(), 
                  company: '', 
                  position: '', 
                  startDate: '', 
                  endDate: '', 
                  current: false, 
                  description: '' 
                })}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar
              </button>
            </div>

            <div className="space-y-6">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="border-2 border-gray-200 rounded-2xl p-6 bg-white/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                        {index + 1}
                      </span>
                      Experiência {index + 1}
                    </h3>
                    {experienceFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Empresa *</label>
                      <input
                        {...register(`experiences.${index}.company`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/70"
                        placeholder="Nome da empresa"
                      />
                      {errors.experiences?.[index]?.company && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.experiences[index]?.company?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo *</label>
                      <input
                        {...register(`experiences.${index}.position`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/70"
                        placeholder="Seu cargo"
                      />
                      {errors.experiences?.[index]?.position && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.experiences[index]?.position?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Início *</label>
                      <input
                        {...register(`experiences.${index}.startDate`)}
                        type="month"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/70"
                      />
                      {errors.experiences?.[index]?.startDate && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.experiences[index]?.startDate?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Fim</label>
                      <input
                        {...register(`experiences.${index}.endDate`)}
                        type="month"
                        disabled={watch(`experiences.${index}.current`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/70 disabled:bg-gray-100"
                      />
                      <label className="flex items-center mt-3 cursor-pointer">
                        <input
                          {...register(`experiences.${index}.current`)}
                          type="checkbox"
                          className="mr-3 w-5 h-5 text-green-500 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Trabalho aqui atualmente</span>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição das Atividades *</label>
                      <textarea
                        {...register(`experiences.${index}.description`)}
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/70 resize-none"
                        placeholder="Descreva suas principais responsabilidades e conquistas..."
                      />
                      {errors.experiences?.[index]?.description && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.experiences[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção 3: Formação */}
        {currentSection === 3 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl mr-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Formação Acadêmica</h2>
                  <p className="text-gray-600">Mostre sua base educacional</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => appendEducation({ 
                  id: Date.now().toString(), 
                  institution: '', 
                  degree: '', 
                  field: '', 
                  startDate: '', 
                  endDate: '', 
                  current: false 
                })}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar
              </button>
            </div>

            <div className="space-y-6">
              {educationFields.map((field, index) => (
                <div key={field.id} className="border-2 border-gray-200 rounded-2xl p-6 bg-white/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                        {index + 1}
                      </span>
                      Formação {index + 1}
                    </h3>
                    {educationFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instituição *</label>
                      <input
                        {...register(`education.${index}.institution`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70"
                        placeholder="Nome da instituição"
                      />
                      {errors.education?.[index]?.institution && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.education[index]?.institution?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Grau *</label>
                      <select
                        {...register(`education.${index}.degree`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70"
                      >
                        <option value="">Selecione o grau</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Tecnólogo">Tecnólogo</option>
                        <option value="Bacharelado">Bacharelado</option>
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Especialização">Especialização</option>
                        <option value="MBA">MBA</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                      </select>
                      {errors.education?.[index]?.degree && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.education[index]?.degree?.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Área de Estudo *</label>
                      <input
                        {...register(`education.${index}.field`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70"
                        placeholder="Ex: Ciência da Computação, Administração, etc."
                      />
                      {errors.education?.[index]?.field && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.education[index]?.field?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Início *</label>
                      <input
                        {...register(`education.${index}.startDate`)}
                        type="month"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70"
                      />
                      {errors.education?.[index]?.startDate && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                          {errors.education[index]?.startDate?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Conclusão</label>
                      <input
                        {...register(`education.${index}.endDate`)}
                        type="month"
                        disabled={watch(`education.${index}.current`)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70 disabled:bg-gray-100"
                      />
                      <label className="flex items-center mt-3 cursor-pointer">
                        <input
                          {...register(`education.${index}.current`)}
                          type="checkbox"
                          className="mr-3 w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Cursando atualmente</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção 4: Habilidades */}
        {currentSection === 4 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-2xl mr-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Habilidades</h2>
                  <p className="text-gray-600">Destaque suas competências técnicas e pessoais</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => appendSkill({ 
                  id: Date.now().toString(), 
                  name: '', 
                  level: 'Intermediário' 
                })}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-2xl bg-white/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex-1">
                    <input
                      {...register(`skills.${index}.name`)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70"
                      placeholder="Ex: JavaScript, Photoshop, Gestão de Projetos"
                    />
                    {errors.skills?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                        {errors.skills[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  
                  <select
                    {...register(`skills.${index}.level`)}
                    className="p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white/70"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Especialista">Especialista</option>
                  </select>

                  {skillFields.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.skills && (
              <p className="text-red-500 text-sm mt-4 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.skills.message}
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 0}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
          >
            Anterior
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              type="button"
              onClick={nextSection}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center"
            >
              Próximo
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Finalizar Currículo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}