export interface CreateClientRequest {
  fullName: string;
  address: string;
  phone: string;
  password: string;
  status: boolean;
}

export interface ClientResponse {
  id: number;
  person: {
    fullName: string;
    gender?: 'HOMBRE' | 'MUJER';
    age?: number;
    identification?: string;
    address: string;
    phone: string;
  };
  password: string;
  status: boolean;
}