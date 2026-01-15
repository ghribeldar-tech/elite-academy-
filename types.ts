export interface Message { role: 'user' | 'model'; text: string; }
export interface Session { id: string; name: string; messages: Message[]; timestamp: number; }
