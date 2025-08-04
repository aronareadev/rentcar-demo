export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: CarType;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  pricePerDay: number;
  image: string;
  features: string[];
  rating: number;
  reviewCount: number;
  location: string;
  available: boolean;
}

export type CarType = 
  | 'economy'
  | 'compact'
  | 'mid-size'
  | 'full-size'
  | 'luxury'
  | 'suv'
  | 'van'
  | 'convertible'
  | 'sports';

export type FuelType = 
  | 'gasoline'
  | 'diesel'
  | 'hybrid'
  | 'electric';

export type TransmissionType = 
  | 'manual'
  | 'automatic'
  | 'cvt'; 