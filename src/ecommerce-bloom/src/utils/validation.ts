// Email validation regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Turkish phone number regex (starts with 0, 10-11 digits)
export const phoneRegex = /^0?[0-9]{10,11}$/;

// Turkish postal code regex (5 digits)
export const postalCodeRegex = /^[0-9]{5}$/;

// Card number regex (basic validation)
export const cardNumberRegex = /^[0-9]{13,19}$/;

// CVV regex (3-4 digits)
export const cvvRegex = /^[0-9]{3,4}$/;

// Expiry date regex (MM/YY format)
export const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

// Validation functions
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'E-posta adresi gerekli' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Geçerli bir e-posta adresi girin' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: false, error: 'Telefon numarası gerekli' };
  }
  // Remove spaces, dashes, parentheses
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (!phoneRegex.test(cleanedPhone)) {
    return { isValid: false, error: 'Geçerli bir Türk telefon numarası girin (05XX XXX XX XX)' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Şifre gerekli' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Şifre en az 6 karakter olmalı' };
  }
  if (password.length > 20) {
    return { isValid: false, error: 'Şifre 20 karakterden uzun olamaz' };
  }
  return { isValid: true };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Şifre tekrarı gerekli' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Şifreler eşleşmiyor' };
  }
  return { isValid: true };
};

export const validateRequired = (
  value: string,
  fieldName: string
): { isValid: boolean; error?: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} gerekli` };
  }
  return { isValid: true };
};

export const validatePostalCode = (
  postalCode: string
): { isValid: boolean; error?: string } => {
  if (!postalCode) {
    return { isValid: false, error: 'Posta kodu gerekli' };
  }
  if (!postalCodeRegex.test(postalCode)) {
    return { isValid: false, error: 'Geçerli bir 5 haneli posta kodu girin' };
  }
  return { isValid: true };
};

export const validateCardNumber = (
  cardNumber: string
): { isValid: boolean; error?: string } => {
  if (!cardNumber) {
    return { isValid: false, error: 'Kart numarası gerekli' };
  }
  const cleanedNumber = cardNumber.replace(/\s/g, '');
  if (!cardNumberRegex.test(cleanedNumber)) {
    return { isValid: false, error: 'Geçerli bir kart numarası girin' };
  }
  return { isValid: true };
};

export const validateCVV = (cvv: string): { isValid: boolean; error?: string } => {
  if (!cvv) {
    return { isValid: false, error: 'CVV gerekli' };
  }
  if (!cvvRegex.test(cvv)) {
    return { isValid: false, error: 'Geçerli bir CVV girin (3-4 hane)' };
  }
  return { isValid: true };
};

export const validateExpiryDate = (
  expiryDate: string
): { isValid: boolean; error?: string } => {
  if (!expiryDate) {
    return { isValid: false, error: 'Son kullanma tarihi gerekli' };
  }
  if (!expiryDateRegex.test(expiryDate)) {
    return { isValid: false, error: 'Geçerli bir tarih girin (MM/YY formatında)' };
  }

  // Check if date is in the future
  const [month, year] = expiryDate.split('/').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: 'Kartın süresi dolmuş veya dolmak üzere' };
  }

  return { isValid: true };
};

// Generic form validator
export const validateForm = <T extends Record<string, any>>(
  formData: T,
  validators: Record<keyof T, (value: any) => { isValid: boolean; error?: string }>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(validators)) {
    const result = validator(formData[field]);
    if (!result.isValid) {
      errors[field] = result.error || 'Geçersiz değer';
      isValid = false;
    }
  }

  return { isValid, errors };
};