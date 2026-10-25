export type Role = 'writer' | 'reviewer' | 'admin';
export type User = { id:string, dept:string, role:Role, name:string };

export const ROLES = {
  writer: ['read:own','write:own','submit:own'],
  reviewer: ['read:all','review','approve','comment'],
  admin: ['read:all','write:all','approve','manage','audit']
};

export function can(user: User, action: string): boolean {
  return (ROLES[user.role] as string[]).includes(action) || ROLES[user.role].includes('manage');
}