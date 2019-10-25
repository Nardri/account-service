export default function normalizeEmail(email: string): string {
  const [user, rest] = email.split('@');
  return `${user.toLocaleLowerCase()}@${rest.toLocaleLowerCase()}`;
}
