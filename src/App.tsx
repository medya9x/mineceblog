import { useState, useEffect, useRef, type FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Instagram } from 'lucide-react';

// ─── Yazı tipi ───────────────────────────────────────────────────────────────
interface Post {
  id: string;
  title: string;
  image: string;
  category: string;
  content: string;
  fullContent: string;
  order: number;
  slug: string;
  date: string;
}

// ─── Başlangıç yazıları ───────────────────────────────────────────────────────
const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'Yenidoğan Bebeklerde Gaz Sancısı (Kolik) İçin 5 Etkili Masaj Yöntemi',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    category: 'beslenme',
    content: 'Yenidoğan bebeğinizin gaz sancısıyla baş etmenin en etkili yollarından biri masajdır...',
    fullContent: 'Yenidoğan bebeğinizin gaz sancısıyla baş etmenin en etkili yollarından biri masajdır. Bebeklerde gaz sancısı, doğumdan sonraki ilk birkaç ayda sıkça görülen ve ebeveynleri oldukça zorlayan bir durumdur.\n\nMasaj, bebeğin sindirim sistemini desteklerken anne-bebek arasındaki bağı da güçlendirir. İşte uygulayabileceğiniz 5 etkili masaj tekniği:\n\n1. Bisiklet Egzersizi: Bebeği sırt üstü yatırın ve bacaklarını nazikçe bisiklet çevirir gibi döndürün. Bu hareket bağırsak hareketlerini uyarır.\n\n2. Karın Masajı (Saat Yönünde): Göbek etrafında saat yönünde nazik daireler çizerek masaj yapın. Bu hareket gazların ilerlemesine yardımcı olur.\n\n3. I-Love-You Masajı: Bebeğin karnında büyük harflerle I, L ve U şekilleri çizerek uygulanan bu teknik Amerika\'da pediatristler tarafından da önerilmektedir.\n\n4. Diz-Göğüs Egzersizi: Bebeğin dizlerini nazikçe karnına doğru katlayın ve birkaç saniye tutun. Bu pozisyon biriken gazların çıkmasını kolaylaştırır.\n\n5. Sıcak Havlu Uygulaması: Ilık bir havluyu bebeğin karnına nazikçe bastırarak tutun. Sıcaklık kasları gevşetir ve gaz çıkışını kolaylaştırır.\n\nÖnemli Not: Masajı her zaman bebek sakin ve uyanıkken, yemekten en az 30 dakika sonra yapın. Masaj öncesi ellerinizi ısıtmayı ve bebek yağı kullanmayı unutmayın.',
    order: 1,
    slug: 'gaz-sancisi',
    date: '2026-03-18',
  },
  {
    id: '2',
    title: 'Ek Gıdaya Geçiş Rehberi: Bebeğinizin İlk Tadımları İçin Bilmeniz Gerekenler',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    category: 'beslenme',
    content: 'Ek gıdaya geçiş süreci bebekler için heyecan verici bir dönem...',
    fullContent: 'Ek gıdaya geçiş, hem bebeğiniz hem de siz için heyecan dolu yeni bir dönemin başlangıcıdır. Bu süreçte doğru adımları atmak, bebeğinizin sağlıklı beslenmesi için büyük önem taşır.\n\nNe Zaman Başlanmalı?\nDünya Sağlık Örgütü (WHO), anne sütü ile beslenmenin en az 6 aya kadar devam etmesini ve ek gıdaya 6. aydan sonra başlanmasını önerir.',
    order: 2,
    slug: 'ek-gida',
    date: '2026-03-15',
  },
  {
    id: '3',
    title: 'Bebeklerde Uyku Düzeni: Kesintisiz Bir Gece Uykusu İçin 7 Altın Kural',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop',
    category: 'uyku',
    content: 'Bebeğinizin uyku düzenini oturtmak için sabır ve tutarlılık şart...',
    fullContent: 'Bebeklerde uyku düzeni, yeni ebeveynlerin en çok mücadele ettiği konuların başında gelir. Sabır ve tutarlılıkla bebeğinizin daha iyi uyumasını sağlayabilirsiniz.',
    order: 3,
    slug: 'uyku-duzeni',
    date: '2026-03-10',
  },
];

const STORAGE_KEY = 'mineceblog_posts';

function loadPosts(): Post[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Post[];
  } catch {}
  return DEFAULT_POSTS;
}

function savePosts(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// ANA SAYFA
// ─────────────────────────────────────────────────────────────────────────────
function Home({ posts }: { posts: Post[] }) {
  return (
    <div className="min-h-screen bg-[#FFC107] flex flex-col items-center w-full overflow-x-hidden">
      <header className="w-full bg-white shadow-md py-6 flex justify-center sticky top-0 z-[100]">
        <div className="w-full max-w-6xl px-6 flex justify-between items-center">
          <Link to="/" className="text-3xl font-serif font-bold italic text-gray-900">mineceblog.</Link>
          <a href="https://www.instagram.com/mineceblogg" target="_blank" rel="noopener noreferrer" 
            className="flex items-center justify-center gap-2 !bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] !text-white px-6 py-2 rounded-full font-serif font-bold tracking-wide animate-premium-glow hover:scale-105 transition-all shadow-lg">
            <Instagram size={20} />
            <span>Instagram</span>
          </a>
        </div>
      </header>

      <main className="w-full max-w-6xl px-6 py-20 flex flex-col gap-32 items-center flex-grow">

        {/* HERO */}
        <section className="w-full relative bg-white p-10 rounded-[3rem] shadow-xl text-center overflow-hidden min-h-[400px] flex flex-col justify-center">
          <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=1200&auto=format&fit=crop" alt="Hero" className="absolute inset-0 w-full h-full object-cover z-0" />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="relative z-20 flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">Hafta Hafta Hamilelik Rehberi: Bebeğiniz Bu Hafta Ne Kadar Büyüdü?</h2>
            <p className="text-xl text-gray-100 font-medium drop-shadow-md max-w-3xl">Hamilelik serüveninizin her anında yanınızdayız. Bebeğinizin gelişimi, vücudunuzdaki değişimler ve bilmeniz gereken her şey burada.</p>
          </div>
        </section>

        {/* KATEGORİLER */}
        <section className="w-full flex justify-center gap-6 md:gap-16 flex-wrap">
          <Link to="/kategori/hamilelik" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">🤰</div>
            <span className="font-bold text-gray-800">Hamilelik</span>
          </Link>
          <Link to="/kategori/beslenme" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">🍼</div>
            <span className="font-bold text-gray-800">Beslenme</span>
          </Link>
          <Link to="/kategori/oyun" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">🧸</div>
            <span className="font-bold text-gray-800">Oyun</span>
          </Link>
          <Link to="/kategori/uyku" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">😴</div>
            <span className="font-bold text-gray-800">Uyku</span>
          </Link>
        </section>

        {/* EN YENİ YAZILAR */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {posts
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((post) => (
            <div key={post.id} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col items-center p-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-2xl mb-6"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/fce4ec/c62828?text=Görsel'; }}
              />
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">{post.title}</h3>
              <Link to={`/yazi/${post.slug}`} className="!bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] !text-white !px-10 !py-3 !rounded-full !font-bold !mt-auto flex items-center justify-center gap-2 animate-premium-glow hover:scale-105 transition-all shadow-md">
                <Instagram size={18} />
                <span>Devamını Oku</span>
              </Link>
            </div>
          ))}
        </section>

        {/* MINE KİMDİR? */}
        <section className="w-full bg-white p-10 md:p-16 rounded-[3rem] shadow-xl flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-rose-200 shadow-xl">
              <img src="/mine-profile.jpg" alt="Mine Demirel" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'; }} />
            </div>
          </div>
          <div className="flex flex-col text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mine Kimdir? 👋</h2>
            <p className="text-lg text-gray-600 leading-relaxed italic mb-6">
              "Merhaba, Ben Mine! Bir anne, bir eş ve hayatın içinden bir yolcuyum. Burada tecrübelerimi, bebek bakım tüyolarını ve favori ürünlerimi paylaşıyorum. Hoş geldiniz!"
            </p>
            <span className="text-5xl font-serif text-rose-500 italic font-black" style={{ fontFamily: 'Georgia, serif' }}>Mine</span>
          </div>
        </section>

        {/* INSTAGRAM */}
        <div className="w-full flex justify-center py-20 border-t border-rose-100">
          <a href="https://www.instagram.com/mineceblogg" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 !bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] !text-white !px-16 !py-6 !rounded-full font-serif !font-black !text-2xl !shadow-2xl text-center tracking-widest animate-premium-glow hover:scale-105 transition-all">
            <Instagram size={32} />
            <span>Bizi Instagram'da Takip Edin</span>
          </a>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white py-10 border-t border-gray-200 mt-auto flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">© {new Date().getFullYear()} mineceblog. Tüm Maceralarımız Saklıdır.</p>
        <a href="https://www.instagram.com/mineceblogg" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 !bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] !text-white px-6 py-2 rounded-full font-serif font-bold tracking-wide animate-premium-glow hover:scale-105 transition-all shadow-md">
          <Instagram size={20} />
          <span>Instagram'da Bizi Takip Edin</span>
        </a>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMİN PANELİ – Şifre Ekranı
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === 'mine123') {
      sessionStorage.setItem('admin_ok', '1');
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-[#FFC107] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl p-12 w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-6xl">🔐</div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 text-center">Hoş Geldin Mine!</h1>
        <p className="text-gray-500 text-center">Devam etmek için şifreni gir.</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="password"
            placeholder="Şifren..."
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="w-full border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800"
          />
          {error && <p className="text-rose-500 font-bold text-center">❌ Yanlış şifre! Tekrar dene.</p>}
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-lg py-4 rounded-2xl transition-colors"
          >
            Giriş Yap ✨
          </button>
        </form>
        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Bloga Dön</Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMİN PANELİ – İçerik Yönetimi
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'hamilelik', label: '🤰 Hamilelik' },
  { value: 'beslenme', label: '🍼 Beslenme' },
  { value: 'oyun', label: '🧸 Oyun' },
  { value: 'uyku', label: '😴 Uyku' },
  { value: 'genel', label: '📝 Genel' },
];

function AdminDashboard({ posts, onAdd, onDelete, onUpdate }: {
  posts: Post[];
  onAdd: (p: Post) => void;
  onDelete: (id: string) => void;
  onUpdate: (p: Post) => void;
}) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLElement>(null);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('genel');
  const [order, setOrder] = useState<string>('');
  const [content, setContent] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleLogout() {
    sessionStorage.removeItem('admin_ok');
    navigate('/');
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setTitle(post.title);
    setImage(post.image);
    setCategory(post.category);
    setOrder(post.order?.toString() || '');
    setContent(post.content);
    setFullContent(post.fullContent || '');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setImage('');
    setCategory('genel');
    setOrder('');
    setContent('');
    setFullContent('');
  }

  function handlePublish(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Mevcut yazıyı güncelle
      const existing = posts.find((p) => p.id === editingId)!;
      onUpdate({
        ...existing,
        title: title.trim(),
        image: image.trim() || 'https://placehold.co/600x400/fce4ec/c62828?text=Görsel',
        category,
        order: parseInt(order) || 0,
        content: content.trim(),
        fullContent: fullContent.trim(),
      });
      setEditingId(null);
      setSuccessMsg('✅ Yazı başarıyla güncellendi!');
    } else {
      // Yeni yazı ekle
      const newPost: Post = {
        id: Date.now().toString(),
        title: title.trim(),
        image: image.trim() || 'https://placehold.co/600x400/fce4ec/c62828?text=Görsel',
        category,
        order: parseInt(order) || 0,
        content: content.trim(),
        fullContent: fullContent.trim(),
        slug: toSlug(title.trim()) + '-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      onAdd(newPost);
      setSuccessMsg('✅ Yazı başarıyla yayınlandı! Ana sayfada en başta görünüyor.');
    }

    setTitle('');
    setImage('');
    setCategory('genel');
    setOrder('');
    setContent('');
    setFullContent('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  function confirmDelete(id: string) {
    setDeleteId(id);
  }

  function doDelete() {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFC107] flex flex-col items-center w-full overflow-x-hidden">

      {/* Üst Bar */}
      <header className="w-full bg-white shadow-md py-6 flex justify-center sticky top-0 z-[100]">
        <div className="w-full max-w-5xl px-6 flex justify-between items-center">
          <div>
            <span className="text-2xl font-serif font-bold italic text-gray-900">mineceblog.</span>
            <span className="ml-3 text-sm font-bold text-amber-500 bg-amber-100 px-3 py-1 rounded-full">Yönetim Paneli</span>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2 rounded-full border border-gray-200 hover:border-gray-400 transition-colors">
              ← Bloga Git
            </Link>
            <button onClick={handleLogout} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full transition-colors">
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl px-6 py-16 flex flex-col gap-12">

        {/* ─── YENİ YAZI / DÜZENLEME FORMU ─── */}
        <section ref={formRef} className="bg-white rounded-[2rem] shadow-xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            {editingId ? '✏️' : '✍️'} <span>{editingId ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</span>
          </h2>

          <form onSubmit={handlePublish} className="flex flex-col gap-6">

            {/* Başlık */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 text-lg">📌 Yazının Başlığı</label>
              <input
                type="text"
                placeholder="Örn: Bebeğim İçin En İyi 5 Uyku Rutini..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800 w-full"
              />
            </div>

            {/* Görsel URL */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 text-lg">🖼️ Görsel Linki <span className="text-gray-400 font-normal text-sm">(isteğe bağlı)</span></label>
              <input
                type="url"
                placeholder="https://... (boş bırakırsan otomatik görsel eklenir)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800 w-full"
              />
            </div>

            {/* Kategori ve Sıra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700 text-lg">📂 Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800 w-full bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700 text-lg">🔢 Sıra Numarası <span className="text-gray-400 font-normal text-sm">(Örn: 1 en üstte)</span></label>
                <input
                  type="number"
                  placeholder="1, 2, 3..."
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800 w-full"
                />
              </div>
            </div>

            {/* Kısa Özet */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 text-lg">📝 Yazı İçeriği <span className="text-gray-400 font-normal text-sm">(Kısa Özet — kart üzerinde görünür)</span></label>
              <textarea
                placeholder="Yazının kısa bir özeti (1-2 cümle)..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
                className="border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800 w-full resize-y"
              />
            </div>

            {/* Tam Makale */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-gray-700 text-lg">📖 Yazının Tamamı <span className="text-gray-400 font-normal text-sm">(Detaylı Makale — 'Devamını Oku'da görünür)</span></label>
              <textarea
                placeholder="Yazının tamamını buraya yaz. Her paragrafı boş bir satırla ayırabilirsin..."
                value={fullContent}
                onChange={(e) => setFullContent(e.target.value)}
                rows={12}
                className="border-2 border-amber-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-amber-400 text-gray-800 w-full resize-y"
              />
            </div>

            {success && (
              <div className="bg-green-50 border-2 border-green-300 text-green-700 font-bold rounded-2xl px-6 py-4 text-center text-lg">
                {successMsg}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-black text-xl py-5 rounded-2xl transition-colors shadow-md hover:shadow-lg"
              >
                {editingId ? '💾 Değişiklikleri Kaydet' : '🚀 Yayınla!'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg px-8 rounded-2xl transition-colors"
                >
                  Vazgeç
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ─── MEVCUT YAZILAR ─── */}
        <section className="bg-white rounded-[2rem] shadow-xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            📚 <span>Yayında Olan Yazılar <span className="text-amber-500">({posts.length})</span></span>
          </h2>

          {posts.length === 0 && (
            <p className="text-gray-400 text-center py-10 text-lg">Henüz hiç yazı yok. Yukarıdan ilk yazını ekle! 👆</p>
          )}

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-amber-100 hover:border-amber-300 transition-colors bg-amber-50">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-20 h-16 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x64/fce4ec/c62828?text=📷'; }}
                />
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    <span className="text-amber-600 mr-2">[Sıra: {post.order || 0}]</span>
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold capitalize">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(post)}
                  title="Yazıyı Düzenle"
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-amber-100 hover:text-amber-600 transition-colors text-xl"
                >
                  ✏️
                </button>
                <button
                  onClick={() => confirmDelete(post.id)}
                  title="Yazıyı Sil"
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-rose-100 hover:text-rose-500 transition-colors text-xl"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Silme Onay Modalı */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] shadow-2xl p-10 w-full max-w-sm flex flex-col items-center gap-6 text-center">
            <div className="text-6xl">🗑️</div>
            <h3 className="text-xl font-bold text-gray-900">Bu yazıyı silmek istediğine emin misin?</h3>
            <p className="text-gray-500">Bu işlem geri alınamaz.</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={doDelete}
                className="flex-1 !bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 animate-premium-glow transition-all"
              >
                <Instagram size={20} />
                <span>Evet, Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMİN WRAPPER – Şifre kontrolü
// ─────────────────────────────────────────────────────────────────────────────
function AdminPage({ posts, onAdd, onDelete, onUpdate }: {
  posts: Post[];
  onAdd: (p: Post) => void;
  onDelete: (id: string) => void;
  onUpdate: (p: Post) => void;
}) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('admin_ok') === '1'
  );

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard posts={posts} onAdd={onAdd} onDelete={onDelete} onUpdate={onUpdate} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// YAZI DETAY SAYFASI
// ─────────────────────────────────────────────────────────────────────────────
function PostDetail({ posts }: { posts: Post[] }) {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FFC107] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Yazı Bulunamadı</h2>
        <p className="text-gray-600 text-lg mb-8">Bu yazı kaldırılmış ya da hiç yayınlanmamış olabilir.</p>
        <Link to="/" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-700 transition-colors">← Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    hamilelik: '🤰 Hamilelik',
    beslenme: '🍼 Beslenme',
    oyun: '🧸 Oyun',
    uyku: '😴 Uyku',
    genel: '📝 Genel',
  };

  const paragraphs = (post.fullContent || post.content).split('\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FFC107] flex flex-col items-center w-full overflow-x-hidden">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-6 flex justify-center sticky top-0 z-[100]">
        <div className="w-full max-w-4xl px-6 flex justify-between items-center">
          <Link to="/" className="text-3xl font-serif font-bold italic text-gray-900">mineceblog.</Link>
          <a href="https://www.instagram.com/mineceblogg" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 !bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] !text-white px-6 py-2 rounded-full font-serif font-bold tracking-wide animate-premium-glow hover:scale-105 transition-all shadow-lg">
            <Instagram size={20} />
            <span>Instagram</span>
          </a>
        </div>
      </header>

      {/* Hero Görsel */}
      <div className="w-full max-w-4xl px-6 pt-12">
        <div className="w-full rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[480px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/1200x480/fce4ec/c62828?text=Görsel'; }}
          />
        </div>
      </div>

      {/* İçerik */}
      <main className="w-full max-w-4xl px-6 py-12 flex flex-col gap-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-10 md:p-16 flex flex-col gap-6">

          {/* Kategori + Tarih */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-amber-100 text-amber-800 font-bold px-4 py-1.5 rounded-full text-sm">
              {categoryLabels[post.category] ?? post.category}
            </span>
            <span className="text-gray-400 text-sm">{post.date}</span>
          </div>

          {/* Başlık */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">{post.title}</h1>

          {/* İmza */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <img
              src="/mine-profile.jpg"
              alt="Mine"
              className="w-10 h-10 rounded-full object-cover border-2 border-rose-200"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100'; }}
            />
            <span className="font-bold text-gray-700">Mine tarafından</span>
          </div>

          {/* Makale Metni */}
          <div className="flex flex-col gap-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-gray-700 text-lg leading-relaxed">{para}</p>
            ))}
          </div>
        </div>

        {/* Alt Navigasyon */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold text-center hover:bg-gray-700 transition-colors">
            ← Ana Sayfaya Dön
          </Link>
          <a href="https://www.instagram.com/mineceblogg" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 !bg-gradient-to-r !from-[#FF007F] !to-[#DB00D6] !text-white px-10 py-4 rounded-full font-serif font-bold tracking-widest animate-premium-glow hover:scale-105 transition-all shadow-xl text-center">
            <Instagram size={24} />
            <span>Instagram'da Takip Et</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-8 border-t border-gray-200 mt-auto flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500 font-medium">© {new Date().getFullYear()} mineceblog. Tüm Maceralarımız Saklıdır.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KATEGORİ PLACEHOLDER
// ─────────────────────────────────────────────────────────────────────────────
function PlaceholderPage() {
  return (
    <div className="min-h-screen bg-[#FFC107] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Yakında!</h2>
      <p className="text-gray-600 text-lg mb-8">Bu kategori sayfası yakında hazır olacak.</p>
      <Link to="/" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-700 transition-colors">Ana Sayfaya Dön</Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANA APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [posts, setPosts] = useState<Post[]>(() => loadPosts());

  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  function handleAdd(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleUpdate(updated: Post) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route
          path="/admin"
          element={<AdminPage posts={posts} onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />}
        />
        <Route path="/kategori/:slug" element={<PlaceholderPage />} />
        <Route path="/yazi/:slug" element={<PostDetail posts={posts} />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
