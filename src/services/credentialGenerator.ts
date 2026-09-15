import { FormFieldDefinition, IdentityProfile } from '../types';

/**
 * Generates a cryptographically strong random password
 */
export function generateSecurePassword(
  length = 20,
  includeSymbols = true,
  includeNumbers = true
): string {
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'; // excluding easily confused characters
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let charset = lowercase + uppercase;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;

  let password = '';
  // Ensure at least one from each chosen category
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  if (includeNumbers) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  if (includeSymbols) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  const remaining = length - password.length;
  for (let i = 0; i < remaining; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

/**
 * Calculates a password security score (0 - 100)
 */
export function calculatePasswordScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 14) score += 20;
  if (password.length >= 18) score += 15;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  return Math.min(score, 100);
}

/**
 * Generates a site-specific privacy alias email
 */
export function generateAliasEmail(profile: IdentityProfile, domain: string): string {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0].toLowerCase();
  const randomSalt = Math.random().toString(36).substring(2, 6);

  if (profile.persona === 'burner') {
    return `temp_${cleanDomain}_${randomSalt}@${profile.aliasDomain || 'shieldmail.net'}`;
  }

  if (profile.persona === 'work') {
    const base = profile.primaryEmail.split('@')[0] || 'work';
    const host = profile.primaryEmail.split('@')[1] || 'acmecorp.com';
    return `${base}+${cleanDomain}@${host}`;
  }

  if (profile.persona === 'developer') {
    return `dev+${cleanDomain}_${randomSalt}@${profile.aliasDomain || 'devbox.internal'}`;
  }

  // Default / personal: subaddressing alias
  const [localPart, hostPart] = profile.primaryEmail.includes('@')
    ? profile.primaryEmail.split('@')
    : ['user', 'onetap.id'];

  return `${localPart}+${cleanDomain}@${hostPart}`;
}

/**
 * Generates a clean username based on profile persona and site
 */
export function generateUsername(profile: IdentityProfile, domain: string): string {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0].toLowerCase();
  const randomSuffix = Math.floor(100 + Math.random() * 900);

  if (profile.persona === 'burner') {
    return `ghost_${randomSuffix}_${cleanDomain.slice(0, 4)}`;
  }
  if (profile.persona === 'developer') {
    return `${profile.defaultUsername || 'dev'}_${cleanDomain}`;
  }

  return `${profile.defaultUsername || 'alex'}_${cleanDomain}`;
}

/**
 * Fills out form field values matching profile and generated credentials
 */
export function resolveFieldValues(
  fields: FormFieldDefinition[],
  profile: IdentityProfile,
  domain: string
): { values: Record<string, string | boolean>; generatedPassword: string; generatedEmail: string; generatedUsername: string } {
  const generatedPassword = generateSecurePassword(
    profile.passwordLength,
    profile.includeSymbols,
    profile.includeNumbers
  );
  const generatedEmail = generateAliasEmail(profile, domain);
  const generatedUsername = generateUsername(profile, domain);

  const values: Record<string, string | boolean> = {};

  fields.forEach((field) => {
    switch (field.detectedType) {
      case 'fullname':
        values[field.id] = profile.fullName;
        break;
      case 'email':
        values[field.id] = generatedEmail;
        break;
      case 'username':
        values[field.id] = generatedUsername;
        break;
      case 'password':
      case 'confirm_password':
        values[field.id] = generatedPassword;
        break;
      case 'phone':
        values[field.id] = '+1 (555) 019-2834';
        break;
      case 'terms':
        values[field.id] = true;
        break;
      default:
        values[field.id] = 'User Value';
    }
  });

  return {
    values,
    generatedPassword,
    generatedEmail,
    generatedUsername,
  };
}
