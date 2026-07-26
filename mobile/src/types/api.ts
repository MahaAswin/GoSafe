/**
 * TypeScript contract interfaces matching Spring Boot DTO request/response payloads.
 */

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export type ComplaintCategory =
  | 'ACCIDENT'
  | 'ROAD_DAMAGE'
  | 'STREET_LIGHT'
  | 'GARBAGE'
  | 'FLOOD'
  | 'FIRE'
  | 'SUSPICIOUS_ACTIVITY'
  | 'OTHER';

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface ComplaintRequestDTO {
  title: string;
  description: string;
  category: ComplaintCategory;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrl?: string;
}

export interface ComplaintResponseDTO {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrl?: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt?: string;
}
