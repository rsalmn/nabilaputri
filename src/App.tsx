import { useState, useEffect, useRef, type ChangeEvent } from "react";

// Confetti piece
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  speed: number;
  delay: number;
}

interface PhotoFrame {
  id: string;
  src: string;
  caption: string;
  sticker: string;
  note: string;
  rotate: string;
}

const COLORS = [
  "#ff6b9d",
  "#c44dff",
  "#4dc9f6",
  "#ffd93d",
  "#6bcb77",
  "#ff8a5c",
  "#a29bfe",
  "#fd79a8",
];

const PHOTO_FRAMES: PhotoFrame[] = [
  {
    id: "sweet-smile",
    src: "/photos/nabila-1.jpg",
    caption: "Mode cantik banget",
    sticker: "🌸",
    note: "Senyum ini bahaya, bisa bikin kangen seharian.",
    rotate: "md:-rotate-3",
  },
  {
    id: "soft-look",
    src: "/photos/nabila-2.jpg",
    caption: "Senyum favoritku",
    sticker: "💗",
    note: "Kalau ini wallpaper hati aku, bukan wallpaper HP lagi.",
    rotate: "md:rotate-2 md:translate-y-6",
  },
  {
    id: "meme-face",
    src: "/photos/nabila-3.jpg",
    caption: "Nabila versi lucu",
    sticker: "🤣",
    note: "Foto ini wajib ada karena lucunya tidak masuk akal.",
    rotate: "md:-rotate-1",
  },
];

const SONG_PATH = "/music/lagu-nabila.mp3";
const SONG_TITLE = "Lagu spesial untuk Nabila";

export default function App() {
  const [showSurprise, setShowSurprise] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);
  const [cakeClicks, setCakeClicks] = useState(0);
  const [isCakeDancing, setIsCakeDancing] = useState(false);
  const [loveLevel, setLoveLevel] = useState(42);
  const [showMeme, setShowMeme] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [complimentIndex, setComplimentIndex] = useState(0);
  const [isPlayingTune, setIsPlayingTune] = useState(false);
  const [songError, setSongError] = useState(false);
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [missingPhotos, setMissingPhotos] = useState<Record<string, boolean>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const NAME = "Nabila Putri Naisa";

  const FUNNY_MESSAGES = [
    `Selamat ulang tahun ${NAME}! Semoga makin cantik, makin lucu, dan makin sayang sama aku ya 😂💕`,
    `Happy Birthday Nabila Putri Naisa! Kamu udah resmi jadi ratu hatiku 👑❤️`,
    `Wish kamu: makin kaya, makin sehat, dan... makin sering ketawa bareng aku 🤣`,
    `Nabila Putri Naisa = Combination of Beauty + Cuteness + Chaos (in the best way) 🌈`,
    `Semoga tahun ini kamu makin sukses... dan aku tetap jadi pacar favoritmu 😉`,
    `Kamu tuh kayak es krim: manis, dingin (kadang), dan aku selalu pengen tambah! 🍦`,
    `Selamat bertambah tua sayangku! Tapi tetep keliatan 17 tahun kok... (bohongan manis) 😘`,
  ];

  const MEME_MESSAGES = [
    "Aku sayang kamu lebih dari aku suka tidur siang 😴💕",
    "Kamu cantik banget sampe bikin aku lupa cara ngetik 'cantik' 😂",
    "Kalo kamu adalah Google, aku pasti langsung klik 'I'm Feeling Lucky' setiap hari ✨",
    "Pacarku paling top! (yang lain gak ada) 🏆",
  ];

  const COMPLIMENTS = [
    "Cantiknya Nabila itu level: bikin hari biasa jadi spesial.",
    "Kamu punya senyum yang bisa reset mood aku dalam 1 detik.",
    "Kalau lucu ada rankingnya, kamu juara umum seumur hidup.",
    "Nabila itu paket lengkap: cantik, gemes, dan bikin kangen terus.",
    "Kamu bukan cuma ulang tahun, kamu ulang bikin aku jatuh cinta lagi.",
  ];

  function generateConfetti(count: number): ConfettiPiece[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -40 - 10,
      rotation: Math.random() * 720 - 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 11 + 6,
      speed: Math.random() * 2.2 + 2,
      delay: Math.random() * 2.5,
    }));
  }

  useEffect(() => {
    setConfetti(generateConfetti(120));
  }, []);

  useEffect(() => {
    const storedPhotos = localStorage.getItem("nabila-birthday-photos");
    if (storedPhotos) {
      try {
        setCustomPhotos(JSON.parse(storedPhotos));
      } catch {
        localStorage.removeItem("nabila-birthday-photos");
      }
    }
  }, []);

  // Floating hearts
  useEffect(() => {
    if (!showSurprise) return;
    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart = {
          id: Date.now(),
          x: Math.random() * 100,
          y: 105,
          scale: Math.random() * 0.7 + 0.8,
        };
        return [...prev.slice(-15), newHeart];
      });
    }, 280);
    return () => clearInterval(interval);
  }, [showSurprise]);

  // Auto advance funny messages
  useEffect(() => {
    if (!showSurprise) return;
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % FUNNY_MESSAGES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [showSurprise]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleOpen = () => {
    setShowSurprise(true);
    setTimeout(() => {
      setLoveLevel(88);
    }, 800);
  };

  const handleCakeClick = () => {
    setCakeClicks((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5 && !isCakeDancing) {
        setIsCakeDancing(true);
        setTimeout(() => setIsCakeDancing(false), 2800);
        setLoveLevel((prev) => Math.min(100, prev + 12));
      }
      return newCount;
    });

    // Extra confetti on cake click
    setConfetti((prev) => [...prev, ...generateConfetti(25)]);
  };

  const giveVirtualKiss = () => {
    setLoveLevel((prev) => Math.min(100, prev + 8));
    setHearts((prev) => [
      ...prev,
      { id: Date.now() + 1, x: 35, y: 65, scale: 1.6 },
      { id: Date.now() + 2, x: 65, y: 65, scale: 1.6 },
    ]);
  };

  const showRandomMeme = () => {
    setShowMeme(true);
    setTimeout(() => setShowMeme(false), 2600);
    setConfetti((prev) => [...prev, ...generateConfetti(35)]);
  };

  const nextCompliment = () => {
    setComplimentIndex((prev) => (prev + 1) % COMPLIMENTS.length);
    setLoveLevel((prev) => Math.min(100, prev + 5));
    setConfetti((prev) => [...prev, ...generateConfetti(28)]);
  };

  const playBirthdayTune = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setSongError(false);
      audio
        .play()
        .then(() => setIsPlayingTune(true))
        .catch(() => {
          setIsPlayingTune(false);
          setSongError(true);
        });
      return;
    }

    audio.pause();
    setIsPlayingTune(false);
  };

  const handlePhotoUpload = (photoId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = String(reader.result);
      setCustomPhotos((prev) => {
        const next = { ...prev, [photoId]: imageUrl };
        try {
          localStorage.setItem("nabila-birthday-photos", JSON.stringify(next));
        } catch {
          // Large photos can exceed browser storage; they still show in this session.
        }
        return next;
      });
      setMissingPhotos((prev) => ({ ...prev, [photoId]: false }));
    };
    reader.readAsDataURL(file);
  };

  const featuredPhoto = PHOTO_FRAMES.map((photo) => customPhotos[photo.id]).find(Boolean);
  const heroPhoto = featuredPhoto ?? (missingPhotos[PHOTO_FRAMES[0].id] ? "" : PHOTO_FRAMES[0].src);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#17051f] font-sans"
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {heroPhoto && showSurprise && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl scale-110"
            style={{ backgroundImage: `url(${heroPhoto})` }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,86,176,0.38),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.35),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(251,191,36,0.22),transparent_32%)]" />
        <div className="absolute -left-28 top-12 h-72 w-72 rounded-full bg-pink-400/30 blur-3xl animate-orbit-slow" />
        <div className="absolute -right-32 bottom-8 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl animate-orbit-slow-reverse" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
      </div>

      {/* Background Confetti */}
      <div className="absolute inset-0 pointer-events-none">
        {confetti.map((c, index) => (
          <div
            key={`${c.id}-${index}`}
            className="absolute text-2xl animate-fall"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              fontSize: `${c.size}px`,
              transform: `rotate(${c.rotation}deg)`,
              animationDuration: `${c.speed}s`,
              animationDelay: `${c.delay}s`,
              zIndex: 1,
            }}
          >
            {["🎉", "🦄", "🍭", "🌈", "⭐️", "🍬"][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="fixed text-4xl pointer-events-none z-50 animate-float-up"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            transform: `scale(${h.scale})`,
            animationDuration: `${2.8 + Math.random() * 1.2}s`,
          }}
        >
          💖
        </div>
      ))}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        {!showSurprise ? (
          // Landing
          <div className="relative w-full max-w-5xl text-center text-white">
            <div className="absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/20 blur-3xl animate-breathe" />

            <div className="mb-8 flex justify-center gap-5 text-6xl md:text-7xl">
              {["🎂", "🎈", "🦋", "🌸"].map((e, i) => (
                <span
                  key={i}
                  className="animate-bouncy drop-shadow-[0_10px_30px_rgba(255,255,255,0.35)]"
                  style={{ animationDelay: `${i * 180}ms` }}
                >
                  {e}
                </span>
              ))}
            </div>

            <p className="mb-3 text-sm font-black uppercase tracking-[0.45em] text-pink-200">Birthday universe khusus untuk</p>
            <h1 className="text-6xl font-black leading-[0.9] tracking-[-0.08em] text-white md:text-8xl">
              <span className="block text-pink-200">Happy Birthday</span>
              <span className="block bg-gradient-to-br from-white via-pink-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_20px_60px_rgba(244,114,182,0.45)]">
                Nabila
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-xl font-medium leading-relaxed text-pink-50/90 md:text-2xl">
              {NAME}, si putri tercantik, terlucu, dan tersayang. Klik tombolnya, ada kejutan yang dibuat cuma buat kamu.
            </p>

            <div className="mt-9 inline-flex flex-col items-center gap-4">
              <button
                onClick={handleOpen}
                className="group relative overflow-hidden rounded-full bg-white px-10 py-5 text-xl font-black text-pink-600 shadow-[0_25px_80px_rgba(244,114,182,0.45)] transition-all hover:-translate-y-1 hover:shadow-[0_35px_100px_rgba(244,114,182,0.65)] active:scale-95 md:px-14 md:py-6 md:text-2xl"
              >
                <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-pink-200/70 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
                <span className="relative z-10 flex items-center gap-3">
                  Buka kejutan Nabila
                  <span className="text-4xl transition group-hover:rotate-12 group-hover:scale-125">🎁</span>
                </span>
              </button>
              <p className="text-sm font-bold tracking-[0.35em] text-pink-200 animate-pulse">SIAP-SIAP SENYUM SENDIRI 💕</p>
            </div>

            <div className="mx-auto mt-10 flex max-w-xl justify-center gap-5 text-3xl md:text-4xl">
              {["🦄", "🍭", "🌟", "🧚🏻‍♀️", "💌"].map((item, index) => (
                <span key={item} className="animate-float-soft" style={{ animationDelay: `${index * 220}ms` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : (
          // Surprise Content
          <div className="w-full max-w-5xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 bg-white rounded-3xl px-8 py-3 shadow-xl">
                <span className="text-5xl">🎉</span>
                <div>
                  <p className="text-pink-500 text-sm font-bold tracking-[3px]">HAPPY BIRTHDAY</p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    {NAME}
                  </p>
                </div>
                <span className="text-5xl">🎉</span>
              </div>
            </div>

            {/* Cinematic Photo Hero */}
            <div className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/10 shadow-[0_35px_120px_rgba(236,72,153,0.35)] backdrop-blur-xl">
              <div className="relative min-h-[430px]">
                {heroPhoto ? (
                  <img
                    src={heroPhoto}
                    alt="Foto utama Nabila Putri Naisa"
                    className="absolute inset-0 h-full w-full object-cover animate-kenburns"
                    onError={() => setMissingPhotos((prev) => ({ ...prev, [PHOTO_FRAMES[0].id]: true }))}
                  />
                ) : (
                  <label
                    htmlFor={`photo-${PHOTO_FRAMES[0].id}`}
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-gradient-to-br from-pink-400/80 via-purple-500/80 to-amber-300/80 p-8 text-center text-white"
                  >
                    <span className="text-8xl">📸</span>
                    <span className="mt-5 text-3xl font-black">Masukkan foto utama Nabila</span>
                    <span className="mt-2 max-w-md text-sm font-medium text-white/85">Klik area ini, pilih foto favorit, lalu halaman ini langsung berubah jadi lebih personal.</span>
                  </label>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#17051f] via-[#17051f]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-10">
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-pink-200">the birthday girl</p>
                  <h2 className="mt-2 text-5xl font-black tracking-[-0.05em] md:text-7xl">Nabila Putri Naisa</h2>
                  <p className="mt-3 max-w-2xl text-lg font-medium text-pink-50/90">
                    Hari ini semua spotlight buat kamu. Senyumnya, lucunya, dan semua hal kecil tentang kamu layak dirayakan besar-besaran.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Booth */}
            <div className="mb-10">
              <div className="mb-5 text-center">
                <p className="text-sm font-black tracking-[4px] text-pink-200">NABILA PHOTO BOOTH</p>
                <h2 className="mt-1 text-3xl font-black text-white">Tiga foto favorit yang bikin aku senyum-senyum sendiri</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3 md:items-start">
                {PHOTO_FRAMES.map((photo) => {
                  const uploadedPhoto = customPhotos[photo.id];
                  const shouldShowUpload = missingPhotos[photo.id] && !uploadedPhoto;

                  return (
                    <div
                      key={photo.id}
                      className={`group relative overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-pink-200/60 transition duration-500 hover:-translate-y-2 hover:rotate-0 ${photo.rotate}`}
                    >
                      <div className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-2xl shadow-lg">
                        {photo.sticker}
                      </div>

                      <div className="relative aspect-[3/4] bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100">
                        {shouldShowUpload ? (
                          <label
                            htmlFor={`photo-${photo.id}`}
                            className="flex h-full cursor-pointer flex-col items-center justify-center p-6 text-center text-pink-500 transition hover:bg-white/40"
                          >
                            <span className="text-6xl">📸</span>
                            <span className="mt-4 text-xl font-black">Pasang foto {photo.caption.toLowerCase()}</span>
                            <span className="mt-2 text-sm text-purple-400">Klik di sini lalu pilih foto Nabila.</span>
                          </label>
                        ) : (
                          <img
                            src={uploadedPhoto ?? photo.src}
                            alt={`${photo.caption} Nabila Putri Naisa`}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            onError={() => setMissingPhotos((prev) => ({ ...prev, [photo.id]: true }))}
                          />
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-950/80 via-pink-900/35 to-transparent p-5 pt-20 text-left text-white">
                          <p className="text-2xl font-black leading-none">{photo.caption}</p>
                          <p className="mt-2 text-sm font-medium text-pink-50">{photo.note}</p>
                        </div>
                      </div>

                      <label
                        htmlFor={`photo-${photo.id}`}
                        className="absolute right-4 top-4 z-20 cursor-pointer rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white opacity-0 shadow-lg transition hover:bg-pink-600 group-hover:opacity-100"
                      >
                        Ganti foto
                      </label>
                      <input
                        id={`photo-${photo.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handlePhotoUpload(photo.id, event)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Love Meter */}
            <div className="mb-8 max-w-md mx-auto">
              <div className="flex justify-between text-xs text-pink-400 mb-1 font-medium">
                <div>LOVE METER 💘</div>
                <div>{loveLevel}%</div>
              </div>
              <div className="h-4 bg-white/60 rounded-3xl overflow-hidden border border-pink-200 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-700 rounded-3xl relative"
                  style={{ width: `${loveLevel}%` }}
                >
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,transparent_4px,transparent_12px)] opacity-30" />
                </div>
              </div>
              <p className="text-center text-[10px] text-purple-400 mt-1">Semakin kamu klik, semakin penuh hatiku 💖</p>
            </div>

            {/* Funny Message */}
            <div className="bg-white/70 backdrop-blur-md border border-pink-200 shadow-xl rounded-3xl p-8 mb-8 min-h-[110px] flex items-center justify-center text-center">
              <p className="text-2xl leading-tight font-medium text-pink-700 transition-all duration-500">
                {FUNNY_MESSAGES[currentMessage]}
              </p>
            </div>

            {/* Interactive Cake */}
            <div className="flex justify-center mb-8">
              <div
                onClick={handleCakeClick}
                className={`relative cursor-pointer transition-all duration-300 ${isCakeDancing ? "animate-wiggle" : ""}`}
              >
                <div className="mx-auto relative w-72">
                  {/* Candles */}
                  <div className="flex justify-center gap-6 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="relative">
                        <div
                          className={`w-4 h-14 bg-gradient-to-t from-yellow-300 to-orange-400 rounded-full shadow-md transition-all ${cakeClicks > 2 ? "rotate-12" : ""}`}
                        />
                        <div
                          className={`absolute -top-4 left-1/2 -translate-x-1/2 text-xl transition-all ${cakeClicks >= 4 ? "animate-flicker" : ""}`}
                        >
                          🕯️
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cake */}
                  <div className="relative mx-auto">
                    {/* Top layer */}
                    <div
                      className={`relative h-20 w-64 mx-auto bg-gradient-to-b from-pink-400 to-rose-400 rounded-t-3xl shadow-inner flex items-center justify-center border-b-4 border-pink-300 transition-all ${isCakeDancing ? "scale-110" : ""}`}
                    >
                      <div className="text-5xl drop-shadow-md">🍓</div>
                      <div className="absolute -top-6 left-1/2 text-4xl">🎂</div>
                    </div>

                    {/* Middle layer */}
                    <div className="relative h-16 w-[270px] mx-auto -mt-3 bg-gradient-to-b from-purple-400 to-violet-400 rounded-2xl shadow-inner flex items-center justify-center gap-4 border-b-4 border-purple-300">
                      <div className="text-4xl">🍒</div>
                      <div className="text-4xl">🫐</div>
                      <div className="text-4xl">🍒</div>
                    </div>

                    {/* Bottom layer */}
                    <div className="relative h-20 w-[290px] mx-auto -mt-4 bg-gradient-to-b from-rose-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center">
                      <div className="flex gap-6 text-3xl">
                        <span>🍰</span>
                        <span>🧁</span>
                        <span>🍰</span>
                      </div>
                    </div>

                    {/* Plate */}
                    <div className="h-6 w-80 mx-auto bg-gradient-to-b from-amber-800 to-amber-950 rounded-full -mt-2 shadow-xl" />
                  </div>
                </div>

                <div className="text-center mt-3">
                  <p className="text-pink-500 text-sm font-medium">
                    {cakeClicks < 5
                      ? `KLIK KUE NYA ${5 - cakeClicks} KALI LAGI BIAR GOYANG! 🍰`
                      : "YEAHHH KUE GOYANG-GOYANG!! 🕺"}
                  </p>
                </div>
              </div>
            </div>

            {/* Compliment Generator */}
            <div className="mb-8 text-center text-white">
              <button
                onClick={nextCompliment}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-8 py-4 text-lg font-black shadow-[0_20px_70px_rgba(217,70,239,0.35)] transition hover:-translate-y-1 active:scale-95"
              >
                <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
                <span className="relative">Tekan untuk pujian random buat Nabila 💘</span>
              </button>
              <p className="mx-auto mt-5 max-w-2xl text-2xl font-bold leading-snug text-pink-50 animate-glow-text">
                {COMPLIMENTS[complimentIndex]}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={giveVirtualKiss}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 transition text-white font-semibold px-7 py-3.5 rounded-2xl active:scale-95 shadow-lg"
              >
                <span className="text-2xl">💋</span>
                <span>KASIH KISS VIRTUAL</span>
              </button>

              <button
                onClick={showRandomMeme}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 transition text-white font-semibold px-7 py-3.5 rounded-2xl active:scale-95 shadow-lg"
              >
                <span className="text-2xl">🤣</span>
                <span>LIHAT MEME LUCU</span>
              </button>

              <button
                onClick={playBirthdayTune}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 transition text-purple-950 font-semibold px-7 py-3.5 rounded-2xl active:scale-95 shadow-lg"
              >
                <span className="text-2xl">🎵</span>
                <span>{isPlayingTune ? "PAUSE LAGU" : "PUTAR LAGU MINI"}</span>
              </button>

              <button
                onClick={() => setShowLetter(true)}
                className="flex items-center gap-2 bg-white hover:bg-pink-50 transition text-pink-600 font-semibold px-7 py-3.5 rounded-2xl active:scale-95 shadow-lg"
              >
                <span className="text-2xl">💌</span>
                <span>BUKA SURAT CINTA</span>
              </button>
            </div>

            {/* Built-in song player */}
            <div className="-mt-8 mb-12 text-center">
              <audio
                ref={audioRef}
                src={SONG_PATH}
                loop
                onPlay={() => setIsPlayingTune(true)}
                onPause={() => setIsPlayingTune(false)}
                onError={() => setSongError(true)}
                onCanPlay={() => setSongError(false)}
              />

              {songError ? (
                <p className="mx-auto max-w-2xl rounded-2xl border border-amber-200/40 bg-amber-300/15 px-5 py-3 text-sm font-semibold text-amber-100 backdrop-blur-md">
                  File lagu belum ditemukan. Masukkan file lagu ke <span className="font-black">public/music/lagu-nabila.mp3</span>, lalu tombol ini akan langsung memutar lagu tersebut.
                </p>
              ) : (
                <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-pink-50 shadow-lg backdrop-blur-md">
                  <span className={isPlayingTune ? "animate-pulse" : ""}>🎧</span>
                  <span>{SONG_TITLE}</span>
                  <span className="text-pink-200">{isPlayingTune ? "sedang diputar" : "siap diputar dari website"}</span>
                </div>
              )}
            </div>

            {/* Meme Pop-up */}
            {showMeme && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-pop">
                <div className="bg-white rounded-3xl p-8 max-w-xs text-center shadow-2xl border-8 border-yellow-300">
                  <div className="text-7xl mb-4">🤪</div>
                  <p className="text-2xl font-bold text-purple-600 leading-snug">
                    {MEME_MESSAGES[Math.floor(Math.random() * MEME_MESSAGES.length)]}
                  </p>
                  <p className="text-xs text-pink-400 mt-6">— dari pacar yang sayang banget sama kamu —</p>
                </div>
              </div>
            )}

            {/* Love Letter Pop-up */}
            {showLetter && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17051f]/85 p-4 backdrop-blur-md animate-pop">
                <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8 shadow-[0_35px_120px_rgba(244,114,182,0.45)]">
                  <button
                    onClick={() => setShowLetter(false)}
                    className="absolute right-5 top-5 rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-pink-600 transition hover:bg-pink-200"
                  >
                    Tutup
                  </button>
                  <div className="mb-6 text-6xl">💌</div>
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-pink-400">surat kecil</p>
                  <h3 className="mt-2 text-4xl font-black text-purple-700">Untuk Nabila Putri Naisa</h3>
                  <p className="mt-6 text-lg font-medium leading-relaxed text-purple-900">
                    Selamat ulang tahun, sayang. Aku cuma mau bilang, terima kasih sudah jadi orang yang bikin hari-hariku lebih hidup. Kamu itu lucu, cantik, manja dengan cara yang gemes, dan selalu punya tempat paling spesial di hatiku.
                  </p>
                  <p className="mt-4 text-lg font-medium leading-relaxed text-purple-900">
                    Semoga semua hal baik datang ke kamu tahun ini. Semoga kamu selalu sehat, bahagia, makin sukses, dan tetap jadi Nabila yang aku sayang banget.
                  </p>
                  <p className="mt-6 text-2xl font-black text-pink-600 animate-typewriter">I love you, birthday girl.</p>
                </div>
              </div>
            )}

            {/* Final Message */}
            <div className="text-center">
              <div className="inline-block bg-white rounded-2xl px-10 py-6 shadow-xl border border-pink-100">
                <p className="text-purple-600 text-xl font-semibold">
                  Terima kasih sudah lahir di dunia ini, Nabila Putri Naisa.<br />
                  Kamu adalah kebahagiaan terbesarku setiap hari 💖
                </p>
                <div className="flex justify-center gap-2 mt-6">
                  <div className="text-4xl animate-bounce">🧸</div>
                  <div className="text-4xl animate-bounce delay-150">🐼</div>
                  <div className="text-4xl animate-bounce delay-300">🐰</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer signature */}
      <div className="fixed bottom-4 right-4 text-pink-300/70 text-xs font-mono">
        made with lots of love for Nabila Putri Naisa 💌
      </div>

      {/* Cursor sparkle effect */}
      <div
        className="fixed pointer-events-none z-[999] text-3xl transition-all duration-75"
        style={{
          left: `${mousePos.x - 14}px`,
          top: `${mousePos.y - 22}px`,
          opacity: showSurprise ? 0.9 : 0.4,
        }}
      >
        ✨
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(105vh) rotate(880deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-110vh) scale(0.2);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear forwards;
        }

        @keyframes bouncy {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        .animate-bouncy {
          animation: bouncy 1.8s ease-in-out infinite;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-6deg); }
          25% { transform: rotate(6deg); }
          50% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.4) rotate(20deg); }
        }
        .animate-flicker {
          animation: flicker 180ms linear infinite;
        }

        @keyframes pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.15); }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes orbit-slow {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(80px, 40px, 0) scale(1.18); }
        }
        .animate-orbit-slow {
          animation: orbit-slow 11s ease-in-out infinite;
        }

        @keyframes orbit-slow-reverse {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1.08); }
          50% { transform: translate3d(-70px, -45px, 0) scale(0.92); }
        }
        .animate-orbit-slow-reverse {
          animation: orbit-slow-reverse 13s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(0.92); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
        }
        .animate-breathe {
          animation: breathe 4.5s ease-in-out infinite;
        }

        @keyframes float-soft {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-14px) rotate(5deg); }
        }
        .animate-float-soft {
          animation: float-soft 2.8s ease-in-out infinite;
        }

        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.12) translateY(-2%); }
        }
        .animate-kenburns {
          animation: kenburns 12s ease-in-out alternate infinite;
        }

        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 18px rgba(244, 114, 182, 0.25); }
          50% { text-shadow: 0 0 34px rgba(244, 114, 182, 0.85); }
        }
        .animate-glow-text {
          animation: glow-text 2.4s ease-in-out infinite;
        }

        @keyframes typewriter {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        .animate-typewriter {
          animation: typewriter 1.4s steps(24, end) both;
          white-space: nowrap;
        }

        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
}
