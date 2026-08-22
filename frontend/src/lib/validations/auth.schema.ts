import { z } from "zod";

const NIP_OR_NIK_MESSAGE =
  "Nomor identitas tidak valid. Masukkan 16 digit angka untuk NIK atau 18 digit angka untuk NIP.";

const phoneOnlyDigits = (value: string) => value.replace(/\D/g, "");

const nipOrNikSchema = z
  .string()
  .min(1, "Nomor identitas (NIK/NIP) wajib diisi")
  .refine((value) => /^\d+$/.test(value), {
    message: "Nomor identitas hanya boleh berisi angka",
  })
  .refine(
    (value) => {
      const isNip = value.length === 18;
      const isNik = value.length === 16;

      return isNip || isNik;
    },
    {
      message: NIP_OR_NIK_MESSAGE,
    },
  );

const noWaSchema = z
  .string()
  .min(1, "No. HP/WhatsApp wajib diisi")
  .refine((value) => /^\d+$/.test(phoneOnlyDigits(value)), {
    message: "No. HP/WhatsApp hanya boleh berisi angka",
  })
  .refine((value) => {
    const digits = phoneOnlyDigits(value);

    return digits.startsWith("08");
  }, "No. HP/WhatsApp harus diawali dengan 08")
  .refine((value) => {
    const digits = phoneOnlyDigits(value);

    return digits.length >= 10 && digits.length <= 13;
  }, "No. HP/WhatsApp harus 10-13 digit angka");

const emailSchema = z
  .string()
  .min(1, "Email wajib diisi")
  .refine(
    (value) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value.trim()),
    "Hanya email Gmail yang diterima. Contoh: nama@gmail.com",
  );

const passwordSchema = z
  .string()
  .min(1, "Password wajib diisi")
  .min(8, "Password minimal 8 karakter");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
});

export const petaniRegisterSchema = z
  .object({
    NIK: z
      .string()
      .min(1, "NIK wajib diisi")
      .regex(/^\d+$/, "NIK hanya boleh berisi angka")
      .length(16, "NIK harus terdiri dari 16 digit angka"),
    NKK: z.string().optional(),
    nama: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama lengkap minimal 3 karakter"),
    email: emailSchema,
    NoWa: noWaSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib dipilih"),
    desa: z.string().min(1, "Desa wajib dipilih"),
    kecamatanId: z.any().optional(),
    desaId: z.any().optional(),
    gapoktan: z.string().min(1, "Gapoktan wajib diisi"),
    namaKelompok: z.string().min(1, "Nama kelompok wajib diisi"),
    penyuluh: z
      .any()
      .refine((val) => val !== undefined && val !== null && val !== "", {
        message: "Penyuluh wajib dipilih",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const penyuluhRegisterSchema = z
  .object({
    NIP: nipOrNikSchema,
    nama: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .min(3, "Nama lengkap minimal 3 karakter"),
    email: emailSchema,
    NoWa: noWaSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib dipilih"),
    kecamatanId: z.any().nullable(),
    desa: z.string().min(1, "Desa wajib dipilih"),
    desaId: z.any().nullable(),
    kecamatanBinaan: z.string().min(1, "Kecamatan binaan wajib dipilih"),
    kecamatanBinaanId: z.any().nullable(),
    desaBinaan: z.array(z.string()).min(1, "Minimal pilih satu desa binaan"),
    selectedKelompokIds: z
      .array(z.string())
      .min(1, "Minimal pilih satu kelompok tani"),
    tipe: z.string().min(1, "Tipe penyuluh wajib dipilih"),
    namaProduct: z.string().optional().default(""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password.length >= 8) {
      const strength = [
        data.password.length >= 8,
        /[A-Z]/.test(data.password),
        /[a-z]/.test(data.password),
        /[0-9]/.test(data.password),
        /[!@#$%^&*]/.test(data.password),
      ].filter(Boolean).length;

      if (strength < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message:
            "Password terlalu lemah. Gunakan minimal 8 karakter, kombinasi huruf besar, kecil, dan angka.",
        });
      }
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type PetaniRegisterFormValues = z.infer<typeof petaniRegisterSchema>;
export type PenyuluhRegisterFormValues = z.infer<typeof penyuluhRegisterSchema>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function flattenZodErrors<T extends z.ZodTypeAny>(
  error: z.ZodError<z.infer<T>>,
): FieldErrors<z.infer<T>> {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");

    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  }

  return errors as FieldErrors<z.infer<T>>;
}
