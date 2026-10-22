create table public.knowledge_documents (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 240),
  content text not null check (char_length(content) between 80 and 6000),
  source_name text not null check (char_length(source_name) between 1 and 240),
  source_url text not null check (source_url ~ '^https://'),
  tags text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index knowledge_documents_published_idx on public.knowledge_documents (published);

alter table public.knowledge_documents enable row level security;

create policy "public reads published knowledge documents"
on public.knowledge_documents
for select
to anon
using (published);

insert into public.knowledge_documents (title, content, source_name, source_url, tags) values
(
  'Rumah Limas Palembang',
  'Rumah Limas adalah rumah tradisional Palembang. Kajian arsitektur menempatkannya sebagai warisan budaya yang memuat nilai religius, sosial, status, dan penyesuaian terhadap lingkungan. Pembahasan tentang makna ruang dan bentuknya perlu dibedakan dari cerita rakyat atau fakta sejarah yang belum didukung sumber.',
  'JPTI — Arsitektur Rumah Limas Palembang Sebagai Warisan Budaya',
  'https://jpti.journals.id/index.php/jpti/article/view/296',
  array['rumah limas', 'palembang', 'arsitektur', 'budaya']
),
(
  'Jembatan Ampera',
  'Jembatan Ampera melintasi Sungai Musi dan menghubungkan Seberang Ilir dengan Seberang Ulu di Palembang. Kajian sejarah menyebut konstruksinya dimulai pada April 1962. Jembatan ini pernah bernama Jembatan Bung Karno dan dikenal sebagai ikon kota Palembang.',
  'Historia Madania UIN Sunan Gunung Djati — Sejarah Jembatan Ampera sebagai Ikon Kota Palembang',
  'https://journal.uinsgd.ac.id/index.php/historia/article/view/18548',
  array['jembatan ampera', 'ampera', 'palembang', 'sungai musi', 'sejarah']
),
(
  'Sungai Musi dan lingkungan',
  'Sungai Musi merupakan ruang penting bagi kehidupan Palembang. Penelitian kualitas perairan pada lokasi 5 Ulu dan 7 Ulu melaporkan sejumlah parameter serta koliform yang melampaui batas pada sampel penelitian. Temuan ini tidak dapat digeneralisasi untuk seluruh sungai atau semua waktu tanpa penelitian tambahan.',
  'Bioeksperimen Universitas Muhammadiyah Surakarta — Kualitas Perairan Sungai Musi',
  'https://journals.ums.ac.id/index.php/bioeksperimen/article/view/309',
  array['sungai musi', 'musi', 'palembang', 'lingkungan', 'air']
),
(
  'Legenda Pulau Kemaro',
  'Kajian tentang legenda Pulau Kemaro membahasnya sebagai tradisi lisan dan representasi akulturasi Melayu–Tionghoa di Palembang. Nilai yang dibaca dalam kajian itu mencakup toleransi, kesetiaan, dan pengorbanan. Rincian alur legenda dapat berbeda menurut penutur dan tidak diperlakukan sebagai fakta sejarah literal.',
  'Arif Universitas Negeri Jakarta — Akulturasi Melayu–Tionghoa dalam Legenda Pulau Kemaro',
  'https://journal.unj.ac.id/unj/index.php/arif/article/view/67882',
  array['pulau kemaro', 'kemaro', 'palembang', 'tionghoa', 'legenda', 'akulturasi']
),
(
  'Kesultanan Palembang dan perekonomian',
  'Kajian sejarah tentang Kesultanan Palembang menempatkan jaringan Sungai Musi dan perdagangan sebagai konteks penting bagi kehidupan ekonomi kesultanan. Jawaban tentang tanggal, tokoh, atau kebijakan tertentu harus merujuk ke sumber primer atau kajian khusus yang membahasnya, bukan menyimpulkan hanya dari ringkasan ini.',
  'Jurnal Sejarah Lontar UNJ — Perekonomian Kesultanan Palembang',
  'https://doi.org/10.21009/lontar.061.02',
  array['kesultanan palembang', 'kesultanan', 'palembang', 'ekonomi', 'musi', 'sejarah']
),
(
  'Piagem Kesultanan Palembang',
  'Piagem Kesultanan Palembang dapat dikaji sebagai sumber tekstual untuk memahami administrasi dan epigrafi kesultanan. Kajian epigrafi membantu membaca sumber primer, tetapi tafsir lengkap isi piagem perlu kembali ke penelitian asli dan konteks naskahnya.',
  'Humanis Universitas Udayana — Kajian Epigrafi pada Piagem Kesultanan Palembang',
  'https://doi.org/10.24843/jh.2019.v23.i03.p07',
  array['kesultanan palembang', 'piagem', 'epigrafi', 'palembang', 'sejarah']
),
(
  'Si Pahit Lidah sebagai cerita rakyat',
  'Si Pahit Lidah dikenal sebagai cerita rakyat yang hidup dalam tradisi lisan Sumatera Selatan. Versi tokoh, tempat, dan peristiwa dapat berbeda antardaerah serta penutur. Karena itu, jawaban perlu menyebut variasi tradisi dan tidak menetapkan satu versi sebagai satu-satunya versi yang benar.',
  'Pendas Universitas Pasundan — Media Wayang Berbasis Cerita Rakyat Si Pahit Lidah',
  'https://journal.unpas.ac.id/index.php/pendas/article/view/26505',
  array['si pahit lidah', 'pahit lidah', 'folklor', 'cerita rakyat', 'sumatera selatan']
),
(
  'Pulau Kemaro sebagai ruang budaya',
  'Pulau Kemaro dibahas dalam kajian pariwisata sebagai ruang budaya di Palembang yang dimaknai pengunjung melalui pengalaman tempat, interaksi, dan simbol budaya. Penjelasan mengenai Pulau Kemaro perlu membedakan antara pengalaman wisata, tradisi lisan, dan catatan sejarah.',
  'Jurnal Kajian Komunikasi Universitas Padjadjaran — Makna Pariwisata Pulau Kemaro',
  'https://doi.org/10.24198/jkk.v2i1.6053',
  array['pulau kemaro', 'kemaro', 'palembang', 'pariwisata', 'budaya']
);
