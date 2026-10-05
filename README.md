# Cerito Wong Dulu

## AI Cerito

1. Salin `.env.example` menjadi `.env.local` lalu isi URL dan anon key proyek Supabase.
2. Simpan Gemini API key hanya di Supabase:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
supabase functions deploy ai-chat
```

3. Opsional, pilih model server-side:

```bash
supabase secrets set GEMINI_MODEL=gemini-2.0-flash
```

Jangan gunakan `VITE_GEMINI_API_KEY`; variabel `VITE_*` dikirim ke browser.

Sebelum produksi, aktifkan autentikasi pengguna atau rate limiting untuk endpoint `ai-chat` agar kuota Gemini tidak disalahgunakan.
