export interface Client {
    id?: number;
    fullName: string;
    address: string;
    phone: string;
    password: string;
    status: boolean;
    person?: {
        fullName: string;
        gender: string;
        age: number;
        identification: string;
        address: string;
        phone: string;
    };
}