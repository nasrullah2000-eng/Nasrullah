/**
 * ============================================================================
 * KONFIGURASI GAME UNDANGAN DATE PIXEL-ART
 * ============================================================================
 * Semua data yang perlu diedit (jam, lokasi, nomor WA, isi surat, foto,
 * caption, dan pesan) dikumpulkan di sini agar sangat mudah diubah.
 * 
 * CATATAN PENTING:
 * - Sebutan untuk Ici di seluruh teks: "wanita kesayanganku" (BUKAN "pacar").
 * - Tanggal Acara: Sabtu, 14 November 2026.
 * ============================================================================
 */

export interface CharacterPreset {
  id: string;
  name: string;
  description: string;
  hairColor: string;
  dressColor: string;
  dressAccent: string;
  flowerCrownColor: string;
}

export interface StoryItem {
  id: number;
  xPosition: number; // Posisi horizontal di dalam dunia game (dalam pixel)
  type: 'letter' | 'photo' | 'reasons' | 'chest';
  title: string;
  icon: string;
  summary: string;
  content?: string[];
  caption?: string;
  photoType?: 'sunset_picnic' | 'flower_cafe' | 'custom';
  photoCustomUrl?: string; // Jika ingin memakai URL foto sendiri di masa depan
  reasons?: { icon: string; text: string }[];
  rating?: number;
  ratingText?: string;
}

export const GAME_CONFIG = {
  // Identitas & Panggilan
  recipient: {
    fullName: "Zhaqiela Ainayah",
    nickname: "Ici",
    callSign: "wanita kesayanganku", // Aturan ketat: selalu panggil dengan ini
  },
  sender: {
    name: "Mas",
    callSign: "Mas",
  },

  // Detail Acara Date
  event: {
    title: "A Sweet Date with You",
    dayAndDate: "Sabtu, 14 November 2026",
    time: "16:00 WIB - Menikmati Senja & Bintang ✨",
    location: "Rahasia dulu ✨ (diumumkan nanti)",
    dressCode: "Pastel / Pakaian paling nyaman & bikin Ici bahagia 🌸",
    // Target timestamp untuk hitung mundur: 14 November 2026, 16:00:00 WIB (UTC+7)
    targetTimestamp: new Date("2026-11-14T16:00:00+07:00").getTime(),
    // Nomor WhatsApp tujuan konfirmasi
    whatsAppNumber: "6281252106293",
    whatsAppMessage: "Mau dong Mas! Sampai ketemu Sabtu 14 November 💖✨",
  },

  // Lagu Latar Belakang
  music: {
    title: "I See the Light",
    artist: "Mandy Moore",
    // Jika ingin memakai file MP3 eksternal, cukup isi link di sini (misal: "/i_see_the_light.mp3")
    // Jika kosong (""), game otomatis memainkan versi chiptune retro "I See the Light"
    audioCustomUrl: "",
  },

  // Pilihan Tampilan Karakter (3 variasi gaya gaun & rambut)
  characters: [
    {
      id: "lilac_hazel",
      name: "Lilac Fairy",
      description: "Gaun lilac lembut & rambut hazelnut bermahkota bunga",
      hairColor: "#8b5a2b",
      dressColor: "#d8b4e2",
      dressAccent: "#f3e8ff",
      flowerCrownColor: "#fb7185",
    },
    {
      id: "peach_sunset",
      name: "Peach Blossom",
      description: "Gaun peach senja & rambut raven hitam berkilau",
      hairColor: "#27272a",
      dressColor: "#fbcfe8",
      dressAccent: "#fef08a",
      flowerCrownColor: "#f43f5e",
    },
    {
      id: "sky_breeze",
      name: "Sky Princess",
      description: "Gaun biru pastel & rambut honey blonde keemasan",
      hairColor: "#d97706",
      dressColor: "#bae6fd",
      dressAccent: "#ffffff",
      flowerCrownColor: "#f472b6",
    },
  ] as CharacterPreset[],

  // Pesan Kocak Tombol "TOLAK" yang kabur saat didekati
  rejectButtonTexts: [
    "Yakin nih? 🥺",
    "Bunganya sedih lho... 🌷",
    "Coba pencet yang kiri dong 💕",
    "Jangan tolak Mas dong 🥺",
    "Tombolnya kabur lagi! 🏃‍♂️💨",
    "Eits, gak bisa diklik! 🤭",
  ],

  // Daftar Item Kejutan di Sepanjang Jalan
  storyItems: [
    {
      id: 1,
      xPosition: 420,
      type: "letter",
      title: "Buat Ici, wanita kesayanganku 💌",
      icon: "✉️",
      summary: "Surat kecil di bawah ranting sakura",
      content: [
        "Halo Ici, wanita kesayanganku... 🌸",
        "Mungkin ini cuma game retro pixel sederhana yang Mas rancang khusus untuk Ici. Tapi ketahuilah, setiap baris kode dan melodi di sini dibuat dengan rasa sayang yang tulus.",
        "Terima kasih sudah selalu jadi alasan di balik senyum Mas. Jangan berhenti di sini ya, masih ada pemandangan indah dan kejutan yang menunggu Ici di depan! Jalan terus ke kanan ya →"
      ],
    },
    {
      id: 2,
      xPosition: 920,
      type: "photo",
      title: "Potret Kenangan: Senja Berdua 📸",
      icon: "🖼️",
      summary: "Foto polaroid kenangan indah",
      caption: "Senyum manis Ici yang selalu berhasil membuat hari Mas yang paling sibuk sekalipun terasa hangat dan teduh ✨",
      photoType: "sunset_picnic",
    },
    {
      id: 3,
      xPosition: 1480,
      type: "reasons",
      title: "Alasan Mas Sayang Ici 🌷",
      icon: "🌸",
      summary: "Catatan kecil di taman bunga",
      reasons: [
        {
          icon: "💖",
          text: "Cara Ici tertawa lepas dan selalu membawa keceriaan di manapun Ici berada."
        },
        {
          icon: "✨",
          text: "Ketulusan hati Ici yang selalu membuat Mas merasa beruntung bisa mengenal Ici."
        },
        {
          icon: "🌸",
          text: "Kebaikan dan kelembutan sikap Ici yang bikin Mas selalu rindu mengobrol dengan Ici."
        },
        {
          icon: "🤍",
          text: "Karena Ici adalah Ici: wanita kesayanganku yang istimewa dan tak tergantikan."
        }
      ],
      rating: 5,
      ratingText: "Rating: 5/5 Bintang Tak Terhingga ⭐⭐⭐⭐⭐",
    },
    {
      id: 4,
      xPosition: 2020,
      type: "photo",
      title: "Potret Kenangan: Momen Favorit 📷",
      icon: "🖼️",
      summary: "Polaroid di platform melayang",
      caption: "Setiap langkah bersama Ici selalu terasa seperti halaman dongeng yang ingin Mas baca berulang-ulang tanpa akhir 🍓",
      photoType: "flower_cafe",
    },
    {
      id: 5,
      xPosition: 2580,
      type: "chest",
      title: "Peti Harta Karun Rahasia 🎁",
      icon: "💎",
      summary: "Peti ajaib yang bercahaya keemasan",
      content: [
        "Ting! Ici berhasil membuka peti harta karun tersembunyi! ✨",
        "Di dalam peti ini tidak ada emas atau permata berkilau...",
        "Karena bagi Mas, harta yang paling berharga di seluruh dunia ini adalah waktu yang bisa Mas habiskan bersama Ici.",
        "Lihat ke depan, gerbang kastil impian sudah bercahaya menyambut kedatangan wanita kesayanganku! 🏰💖"
      ],
    },
  ] as StoryItem[],

  // Pesan Surat Undangan Utama di Kastil
  castleInvitation: {
    title: "Undangan Date Spesial untuk Ici 💌",
    greeting: "Misi Utama Berhasil! 🏰✨",
    bodyParagraphs: [
      "Horeee! Ici berhasil namatin game lucu ini sampai ke kastil! 🎉",
      "Sabtu nanti kita rehat sejenak, jalan-jalan berdua, makan enak, dan ketawa bareng yuk!"
    ],
    question: "Maukah Ici pergi date dengan Mas?",
  },
};
