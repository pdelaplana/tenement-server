export interface User {
  uid: string;
  name: string;
  email: string;
}
export interface UserService<T extends User>{
  createUser: (email: string, password: string, name: string) => Promise<T>;
}
