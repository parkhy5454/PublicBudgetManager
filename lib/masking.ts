export function maskAmount(text: string): { masked: string, map: Map<string,string> } {
  const map = new Map<string,string>();
  let idx = 0;
  const masked = text.replace(/(\d{1,3}(?:,\d{3})*\s*만원|\d+\s*원)/g, (m) => {
    const token = `AMT_${idx++}`;
    map.set(token, m);
    return token;
  });
  // 주민번호 패턴 차단
  if (/\d{6}[-]\d{7}/.test(text)) throw new Error('개인정보(주민번호) 포함 불가');
  return { masked, map };
}
export function unmaskAmount(text: string, map: Map<string,string>): string {
  let res = text;
  map.forEach((v,k)=>{ res = res.replaceAll(k,v); });
  return res;
}
export function isSensitiveFileName(name: string): boolean {
  return /(주민|개인|급여).*(xlsx|pdf|hwp)/i.test(name);
}