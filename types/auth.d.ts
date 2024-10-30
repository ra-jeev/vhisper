declare module '#auth-utils' {
  interface User {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  }
}

export {};
