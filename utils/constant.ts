const MagangStatus = {
  AKTIF: "AKTIF", // Saat ini masih magang
  SELESAI: "SELESAI", // Sudah menyelesaikan magang
  DIBATALKAN: "DIBATALKAN", // Tidak memenuhi syarat kelulusan (tidak dapat sertifikat)
  TIDAK_LULUS: "TIDAK_LULUS", // Magang dibatalkan di tengah jalan
} as const;

type MagangStatus = (typeof MagangStatus)[keyof typeof MagangStatus];

export { MagangStatus };
