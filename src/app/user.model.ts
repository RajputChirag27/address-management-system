// src/app/user.model.ts
export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }
  
  export interface User {
    _id: string,
    userName: string;
    email: string;
    addresses: Address[];
  }
  