export type PropertyType = 'house' | 'apartment' | 'plot' | 'shop' | 'building' | 'villa';
export type PropertyStatus = 'available' | 'sold' | 'rented';
export type UserRole = 'admin' | 'agent' | 'user';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  size: string;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  agentName: string;
  agentPhone: string;
  createdAt: string;
  features: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  userId: string;
  message: string;
  createdAt: string;
}
