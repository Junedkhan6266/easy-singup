export type PersonaType = 'personal' | 'work' | 'burner' | 'developer';

export interface IdentityProfile {
  id: string;
  name: string;
  persona: PersonaType;
  fullName: string;
  primaryEmail: string;
  aliasDomain: string;
  defaultUsername: string;
  autoSubmit: boolean;
  passwordLength: number;
  includeSymbols: boolean;
  includeNumbers: boolean;
  color: string;
}

export interface RegisteredAccount {
  id: string;
  siteName: string;
  domain: string;
  category: 'saas' | 'social' | 'shopping' | 'developer' | 'entertainment' | 'other';
  emailUsed: string;
  username: string;
  password: string;
  createdAt: string;
  lastLoginAt: string;
  status: 'active' | 'archived';
  notes?: string;
  securityScore: number; // 0 - 100
  method: 'bookmarklet' | 'simulator' | 'sdk' | 'extension';
}

export interface FormFieldDefinition {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'checkbox';
  placeholder: string;
  required: boolean;
  value: string;
  detectedType: 'fullname' | 'email' | 'username' | 'password' | 'confirm_password' | 'terms' | 'phone';
}

export interface SimulatedSite {
  id: string;
  name: string;
  domain: string;
  category: 'saas' | 'social' | 'shopping' | 'developer';
  tagline: string;
  logoColor: string;
  fields: FormFieldDefinition[];
  termsText: string;
  submitButtonText: string;
}

export interface AutomationStep {
  id: number;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp?: string;
}
