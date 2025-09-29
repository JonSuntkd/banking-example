export interface Person {
  fullName: string;
  gender?: 'HOMBRE' | 'MUJER';
  age?: number;
  identification?: string;
  address: string;
  phone: string;
}

export interface Client {
  id?: number;
  person: Person;
  password: string;
  status: boolean;
}