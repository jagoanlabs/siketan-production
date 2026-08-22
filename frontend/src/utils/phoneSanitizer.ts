/**
 * Utility untuk sanitasi dan normalisasi nomor WhatsApp / telepon Indonesia
 */

export interface SanitizedWhatsApp {
  display: string;
  waLink: string;
}

/**
 * Membersihkan dan memvalidasi nomor telepon ke format WhatsApp yang valid
 * Menolak teks alamat (misal "Jl. Sukowati No 12"), angka terlalu pendek ("0", "123"), atau null/undefined
 */
export function sanitizeWhatsAppNumber(rawPhone: any): SanitizedWhatsApp | null {
  if (!rawPhone) return null;

  // 1. Ambil hanya karakter angka
  const digits = String(rawPhone).replace(/\D/g, "");

  // 2. Filter panjang digit: No HP seluler Indonesia valid berukuran 10 - 14 digit
  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  let waNumber = digits;

  // 3. Normalisasi awalan ke kode negara 628...
  if (waNumber.startsWith("08")) {
    waNumber = "62" + waNumber.slice(1);
  } else if (waNumber.startsWith("8")) {
    waNumber = "62" + waNumber;
  } else if (waNumber.startsWith("628")) {
    // Format sudah sesuai
  } else {
    // Awalan tidak valid untuk seluler Indonesia
    return null;
  }

  // 4. Format display standar Indonesia (08xxxxxxxxxx)
  const display = "0" + waNumber.slice(2);

  return {
    display,
    waLink: `https://wa.me/${waNumber}`,
  };
}

/**
 * Mencari nomor WhatsApp penyuluh yang valid dari berbagai sumber kandidat fallback
 */
export function resolvePenyuluhWhatsApp(item: any): SanitizedWhatsApp | null {
  if (!item) return null;

  const candidateSources = [
    item.kelompok?.dataPenyuluh?.noTelp,
    item.creator?.penyuluh?.noTelp,
    item.creator?.operator?.noHp,
    item.creator?.noWa,
    item.dataPenyuluh?.noTelp,
  ];

  for (const source of candidateSources) {
    const sanitized = sanitizeWhatsAppNumber(source);

    if (sanitized) {
      return sanitized;
    }
  }

  return null;
}
