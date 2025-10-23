export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface PaymentData {
  txid: string;
  qrCode: string;
  qrCodeImage: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired';
}

export type AppStep = 'form' | 'payment' | 'download';