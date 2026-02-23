// Fungsi utilitas: generate warna deterministik dari string
export function getColorFromString(str: string): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const s = 65;
  const l = 55;

  return `hsl(${h}, ${s}%, ${l}%)`;
}
