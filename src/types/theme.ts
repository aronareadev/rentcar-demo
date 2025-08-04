export interface ThemeColors {
  primary: string;
  secondary: string;
  dark: string;
  light: string;
  accent: string;
}

export interface NavigationItem {
  title: string;
  link: string;
}

export interface ContactInfo {
  phone: string;
  displayText?: string;
  email?: string;
  hours?: string;
}

export interface SearchField {
  type: 'select' | 'text' | 'tel' | 'email' | 'textarea';
  placeholder: string;
  options?: string[];
  required?: boolean;
}

export interface SearchForm {
  title: string;
  subtitle: string;
  fields: SearchField[];
  buttonText: string;
}

export interface HeroSection {
  backgroundImage: string;
  title: string;
  subtitle: string;
  searchForm: SearchForm;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Vehicle {
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  features?: string[];
  badge?: string;
  isPromoted?: boolean;
}

export interface VehicleCategory {
  name: string;
  active?: boolean;
}

export interface VehicleSection {
  title: string;
  subtitle: string;
  categories: VehicleCategory[];
  vehicles: Vehicle[];
}

export interface ReviewSection {
  title: string;
  subtitle: string;
  reviewImages: string[];
  ctaText: string;
}

export interface ConsultationForm {
  fields: SearchField[];
  submitText: string;
}

export interface ContactSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  form: ConsultationForm;
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface FooterSection {
  companyName: string;
  description: string;
  address: string;
  businessInfo: string[];
  contact: ContactInfo;
  links: FooterLink[];
  copyright: string;
  backgroundImage: string;
}

export interface FloatingButton {
  text?: string;
  phone?: string;
  icon: string;
}

export interface FloatingButtons {
  chat: FloatingButton;
  call: FloatingButton;
  top: FloatingButton;
}

export interface RentCarTheme {
  siteName: string;
  tagline: string;
  phoneNumber: string;
  theme: {
    colors: ThemeColors;
    layout: string;
  };
  header: {
    navigation: NavigationItem[];
    contact: ContactInfo;
  };
  hero: HeroSection;
  features: Feature[];
  vehicleSection: VehicleSection;
  reviewSection: ReviewSection;
  consultationBanner: {
    items: string[];
  };
  contactSection: ContactSection;
  footer: FooterSection;
  floatingButtons: FloatingButtons;
} 