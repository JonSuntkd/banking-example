// Domain Entity for Person (base for Client)
export interface Person {
  fullName: string;
  gender?: 'HOMBRE' | 'MUJER';
  age?: number;
  identification?: string;
  address: string;
  phone: string;
}

// Domain Entity for Client
export interface Client {
  id?: number;
  person: Person;
  password: string;
  status: boolean;
}

// DTO for basic client creation
export interface ClientBasicDto {
  fullName: string;
  address: string;
  phone: string;
  password: string;
  status: boolean;
}

// DTO for client update
export interface ClientUpdateDto {
  person: Person;
  password: string;
  status: boolean;
}