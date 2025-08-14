// types/auth.ts
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  chatToken?: string;
  expiresAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  kind: 'FREELANCER' | 'COMPANY' | 'AGENCY';
  isEmailVerified: boolean;
}

export interface Plan {
  id: string;
  name: string;
  subTitle: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
  modules: string[];
  features: string[];
  type: string;
  userCategory: string;
  image: string;
  description: string;
  price: number;
  trialEnabled: boolean;
  trialDays: number;
}
export interface AddressDetails {
  VATNumber?: string;
  companyName: string;
  street: string;
  country: string;
  postalCode: string;
  houseNumber?: string;
  city: string;
  countryCode: string;
  type: string;
}

export interface RegistrationData {
  addressDetails?: AddressDetails;
  email: string;
  firstName: string;
  kind: 'FREELANCER' | 'COMPANY' | 'AGENCY';
  language: string;
  lastName: string;
  name: string;
  password: string;
  subPriceId?: string;
  receiveEmail: boolean;
  senderId?: string;
  selectedPlan?: Plan;
  termsAccepted?: boolean;
}
export type TraderMatchStatus = 'NOT_PROCESSED' | 'VALID' | 'INVALID';

export interface EUVATValidationResponse {
  countryCode: string;
  vatNumber: string;
  requestDate: string;
  valid: boolean;
  requestIdentifier: string;
  name: string;
  address: string;
  traderName: string;
  traderStreet: string;
  traderPostalCode: string;
  traderCity: string;
  traderCompanyType: string;
  traderNameMatch: TraderMatchStatus;
  traderStreetMatch: TraderMatchStatus;
  traderPostalCodeMatch: TraderMatchStatus;
  traderCityMatch: TraderMatchStatus;
  traderCompanyTypeMatch: TraderMatchStatus;
}

export const isRetryableError = (errorCode?: string): boolean => {
  return ['NETWORK_ERROR', 'SERVER_ERROR'].includes(errorCode ?? '');
};
