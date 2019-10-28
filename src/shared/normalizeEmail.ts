export default function normalizeEmail(email: string): string {
  const emailArr = email ? email.split('@') : [];
  return [String(emailArr[0]).toLocaleLowerCase(), emailArr[1]].join('@');
}
