import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ────────────────────────────────────────────────────────── */
const T = {
  bg:      "#F5F3EF",
  surface: "#FFFFFF",
  card:    "#FAFAF8",
  border:  "#E8E4DC",
  borderStrong: "#D4CFC5",
  text:    "#1A1714",
  textMid: "#6B6560",
  textSub: "#A09890",
  coral:   "#FF5C4D",
  mint:    "#00C896",
  sky:     "#3B82F6",
  amber:   "#F59E0B",
  lilac:   "#A78BFA",
  // service accents
  netflix: "#E50914",
  unext:   "#0070F3",
  tver:    "#1DC079",
  youtube: "#FF0000",
};

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const now = new Date();
const addDays = d => new Date(now.getTime() + d * 86400000);

const SERVICES = {
  Netflix:  { color: T.netflix, light: "#FFF0F0", icon: "N", label: "Netflix" },
  "U-NEXT": { color: T.unext,   light: "#EEF5FF", icon: "U", label: "U-NEXT" },
  TVer:     { color: T.tver,    light: "#EDFFF7", icon: "T", label: "TVer" },
  YouTube:  { color: T.youtube, light: "#FFF0F0", icon: "▶", label: "YouTube" },
};

const GENRE_CHIPS = {
  ドラマ: { bg: "#FFE8E8", color: "#E05050" },
  アニメ: { bg: "#FFF3E0", color: "#E07820" },
  映画:   { bg: "#FCE8FF", color: "#A050C0" },
  バラエティ: { bg: "#FFFBE0", color: "#C09000" },
  音楽:   { bg: "#E0FFF5", color: "#00A878" },
  教育:   { bg: "#E8EEFF", color: "#4060D0" },
  "教育・エンタメ": { bg: "#E8EEFF", color: "#4060D0" },
  ドキュメンタリー: { bg: "#F0F0F0", color: "#606060" },
};

const NETFLIX_CATALOG = [
  { id:"nf1", title:"地面師たち",       genre:"ドラマ",  year:2024, episodes:7,  desc:"大胆な詐欺師集団が挑む衝撃のクライムスリラー", rating:4.8, emoji:"🏢" },
  { id:"nf2", title:"幽☆遊☆白書",      genre:"アニメ",  year:2023, episodes:10, desc:"伝説の漫画を実写ドラマ化した大作", rating:4.2, emoji:"👻" },
  { id:"nf3", title:"First Love 初恋",  genre:"ドラマ",  year:2022, episodes:9,  desc:"宇多田ヒカルの楽曲で紡ぐ純愛ストーリー", rating:4.6, emoji:"❤️" },
  { id:"nf4", title:"サンクチュアリ",    genre:"ドラマ",  year:2023, episodes:8,  desc:"相撲界を舞台にしたヒューマンドラマ", rating:4.7, emoji:"🏆" },
  { id:"nf5", title:"今際の国のアリス",  genre:"ドラマ",  year:2022, episodes:16, desc:"命がけのゲームに挑む異世界サバイバル", rating:4.9, emoji:"🃏" },
  { id:"nf6", title:"忍びの家",          genre:"ドラマ",  year:2024, episodes:8,  desc:"現代に生きる忍者一家の笑いと涙", rating:4.3, emoji:"🥷" },
];
const UNEXT_CATALOG = [
  { id:"un1", title:"SHOGUN 将軍",       genre:"ドラマ",  year:2024, episodes:10, desc:"戦国時代を舞台にした壮大なエピックドラマ", rating:4.9, emoji:"⚔️" },
  { id:"un2", title:"岸辺露伴は動かない", genre:"ドラマ",  year:2023, episodes:4,  desc:"漫画家の奇妙な体験を描くジョジョスピンオフ", rating:4.5, emoji:"✒️" },
  { id:"un3", title:"パリピ孔明",         genre:"アニメ",  year:2022, episodes:12, desc:"諸葛孔明が現代渋谷で音楽業界に参戦", rating:4.4, emoji:"🎵" },
  { id:"un4", title:"推しの子",           genre:"アニメ",  year:2023, episodes:11, desc:"芸能界の闇に迫るダークファンタジー", rating:4.8, emoji:"⭐" },
  { id:"un5", title:"THE FIRST SLAM DUNK",genre:"映画",   year:2022, episodes:1,  desc:"伝説のバスケ漫画が映画で復活", rating:4.9, emoji:"🏀" },
  { id:"un6", title:"呪術廻戦 懐玉・玉折",genre:"アニメ",  year:2023, episodes:24, desc:"五条悟の過去編・伝説の始まり", rating:4.7, emoji:"🌀" },
];
const TVER_CATALOG = [
  { id:"tv1", title:"べらぼう〜蔦重栄華乃夢噺〜", genre:"ドラマ",        channel:"NHK総合",    expiresAt:addDays(2),  desc:"大河ドラマ・江戸の出版王の物語", rating:4.3, emoji:"📚" },
  { id:"tv2", title:"ブラックペアン シーズン2",    genre:"ドラマ",        channel:"TBS",         expiresAt:addDays(5),  desc:"天才外科医が挑む最前線の医療バトル", rating:4.6, emoji:"🩺" },
  { id:"tv3", title:"クレイジーダイヤモンド",       genre:"ドラマ",        channel:"フジテレビ",   expiresAt:addDays(1),  desc:"宝石業界を舞台にした痛快クライムコメディ", rating:4.2, emoji:"💎" },
  { id:"tv4", title:"アンメット",                   genre:"ドラマ",        channel:"カンテレ",     expiresAt:addDays(8),  desc:"記憶を失った脳外科医の感動ヒューマンドラマ", rating:4.8, emoji:"🧠" },
  { id:"tv5", title:"くりぃむしちゅーのハナタカ",   genre:"バラエティ",    channel:"テレビ朝日",   expiresAt:addDays(3),  desc:"知って得する情報バラエティの決定版", rating:4.1, emoji:"💡" },
  { id:"tv6", title:"ザ・ノンフィクション",          genre:"ドキュメンタリー",channel:"フジテレビ",  expiresAt:addDays(6),  desc:"リアルな人生に密着したドキュメンタリー", rating:4.5, emoji:"🎥" },
];
const YOUTUBE_CATALOG = [
  { id:"yt1", title:"HIKARU UTADA Live Sessions", genre:"音楽",          channel:"Hikaru Utada", desc:"宇多田ヒカルのライブ音源プレイリスト", rating:4.9, emoji:"🎤" },
  { id:"yt2", title:"東海オンエア",                genre:"バラエティ",    channel:"東海オンエア", desc:"岡崎発の人気グループによる爆笑企画", rating:4.6, emoji:"😂" },
  { id:"yt3", title:"QuizKnock",                   genre:"教育・エンタメ", channel:"QuizKnock",   desc:"東大発のクイズエンタメチャンネル", rating:4.7, emoji:"🧩" },
  { id:"yt4", title:"ヒカキンTV",                  genre:"バラエティ",    channel:"HikakinTV",   desc:"日本最大のYouTuberによる多彩なコンテンツ", rating:4.3, emoji:"🎮" },
  { id:"yt5", title:"水溜りボンド",                genre:"バラエティ",    channel:"水溜りボンド", desc:"カンタとトミーの笑えるリアクション企画", rating:4.4, emoji:"🌊" },
  { id:"yt6", title:"NHK高校講座",                 genre:"教育",          channel:"NHK高校講座", desc:"無料で学べる高校全科目の講座動画", rating:4.2, emoji:"📖" },
];

const CATALOG_MAP = { Netflix: NETFLIX_CATALOG, "U-NEXT": UNEXT_CATALOG, TVer: TVER_CATALOG, YouTube: YOUTUBE_CATALOG };

function daysLeft(d) { return Math.ceil((d - now) / 86400000); }
function fmtExpiry(d) {
  const n = daysLeft(d);
  if (n < 0)  return "期限切れ";
  if (n === 0) return "今日まで！";
  if (n === 1) return "明日まで";
  return `あと${n}日`;
}
function expiryLevel(d) {
  const n = daysLeft(d);
  if (n <= 1) return "crit";
  if (n <= 3) return "warn";
  return "ok";
}

/* ─── MICRO COMPONENTS ─────────────────────────────────────────────────────── */

function ServiceBadge({ service, small }) {
  const s = SERVICES[service];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap: small ? 4 : 5,
      background: s.light, color: s.color,
      borderRadius: 20, padding: small ? "2px 8px" : "4px 10px",
      fontSize: small ? 10 : 11, fontWeight: 800,
      letterSpacing: "0.02em",
    }}>
      <span style={{ fontWeight:900, fontSize: small ? 9 : 10 }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

function GenreChip({ genre }) {
  const c = GENRE_CHIPS[genre] || { bg:"#F0F0F0", color:"#606060" };
  return (
    <span style={{
      background: c.bg, color: c.color,
      borderRadius: 20, padding:"2px 9px",
      fontSize:10, fontWeight:700,
    }}>{genre}</span>
  );
}

function ExpiryTag({ date }) {
  const lvl = expiryLevel(date);
  const cfg = {
    crit: { bg:"#FFE8E8", color:"#E03030", dot:"#E03030" },
    warn: { bg:"#FFF6E0", color:"#C07800", dot:"#F59E0B" },
    ok:   { bg:"#E8FFF5", color:"#008060", dot:"#00C896" },
  }[lvl];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background: cfg.bg, color: cfg.color,
      borderRadius:20, padding:"3px 9px",
      fontSize:10, fontWeight:700,
    }}>
      <span style={{
        width:6, height:6, borderRadius:"50%",
        background: cfg.dot,
        boxShadow: lvl === "crit" ? `0 0 6px ${cfg.dot}` : "none",
        animation: lvl === "crit" ? "pulse 1.2s infinite" : "none",
        display:"inline-block",
      }}/>
      {fmtExpiry(date)}
    </span>
  );
}

function Stars({ v }) {
  return (
    <span style={{ display:"flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          fontSize:9,
          color: i <= Math.round(v) ? "#FFBC00" : "#E0D8CC",
        }}>★</span>
      ))}
      <span style={{ fontSize:10, color: T.textSub, marginLeft:3, fontWeight:600 }}>{v}</span>
    </span>
  );
}

function PlusButton({ added, onClick }) {
  return (
    <button onClick={added ? undefined : onClick} style={{
      width:36, height:36, borderRadius:18,
      border: "none",
      background: added ? T.mint : T.coral,
      color:"#fff",
      cursor: added ? "default" : "pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: added ? 16 : 22,
      fontWeight:300,
      flexShrink:0,
      boxShadow: added
        ? `0 2px 12px ${T.mint}55`
        : `0 4px 16px ${T.coral}44`,
      transition:"all 0.2s",
      transform: added ? "scale(1)" : "scale(1)",
    }}
      onMouseEnter={e => { if (!added) e.currentTarget.style.transform = "scale(1.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {added ? "✓" : "+"}
    </button>
  );
}

/* ─── CATALOG CARD ─────────────────────────────────────────────────────────── */
function CatalogCard({ item, service, added, onAdd, idx }) {
  const s = SERVICES[service];
  return (
    <div style={{
      background: T.surface,
      border: `1.5px solid ${T.border}`,
      borderRadius:20,
      padding:"16px 18px",
      display:"flex", gap:14, alignItems:"center",
      transition:"all 0.2s",
      animation:`slideUp 0.3s ease both`,
      animationDelay:`${idx * 0.04}s`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = s.color + "66";
        e.currentTarget.style.boxShadow = `0 8px 32px ${s.color}14`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Emoji thumb */}
      <div style={{
        width:52, height:52, borderRadius:16,
        background: s.light,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:26, flexShrink:0,
      }}>{item.emoji}</div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:5, lineHeight:1.3 }}>
          {item.title}
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}>
          <GenreChip genre={item.genre} />
          {item.year && (
            <span style={{ background:T.bg, color:T.textSub, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:600 }}>
              {item.year}
            </span>
          )}
          {item.episodes > 1 && (
            <span style={{ background:T.bg, color:T.textSub, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:600 }}>
              全{item.episodes}話
            </span>
          )}
          {item.channel && (
            <span style={{ background: s.light, color: s.color, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700 }}>
              {item.channel}
            </span>
          )}
          {item.expiresAt && <ExpiryTag date={item.expiresAt} />}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Stars v={item.rating} />
          <span style={{ fontSize:11, color:T.textSub, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {item.desc}
          </span>
        </div>
      </div>

      <PlusButton added={added} onClick={() => onAdd(item, service)} />
    </div>
  );
}

/* ─── MY LIST CARD ─────────────────────────────────────────────────────────── */
function MyListCard({ item, onRemove, onToggleStatus, onUpdateProgress }) {
  const s = SERVICES[item.service];
  const [showEps, setShowEps] = useState(false);
  const pct = item.totalEpisodes > 1 ? Math.round(item.watchedEpisodes / item.totalEpisodes * 100) : null;
  const STATUS = {
    unwatched: { label:"未視聴", bg:"#F2F0EC", color:T.textSub },
    watching:  { label:"視聴中", bg:`${T.sky}18`, color:T.sky },
    completed: { label:"完了 ✓", bg:`${T.mint}18`, color:T.mint },
  };
  const nextStatus = { unwatched:"watching", watching:"completed", completed:"unwatched" };
  const st = STATUS[item.status];

  return (
    <div style={{
      background: T.surface,
      border: `1.5px solid ${item.status === "completed" ? T.mint + "44" : T.border}`,
      borderRadius:20,
      overflow:"hidden",
      transition:"all 0.2s",
    }}>
      <div style={{ padding:"16px 18px" }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          {/* Thumb */}
          <div style={{
            width:50, height:50, borderRadius:15,
            background: s.light,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, flexShrink:0,
            position:"relative",
          }}>
            {item.emoji}
            {item.status === "completed" && (
              <div style={{
                position:"absolute", inset:0, borderRadius:15,
                background:"rgba(0,200,150,0.18)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14,
              }}>✓</div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, flexWrap:"wrap" }}>
              <span style={{ fontWeight:800, fontSize:14, color: item.status === "completed" ? T.textMid : T.text }}>
                {item.title}
              </span>
              <ServiceBadge service={item.service} small />
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom: pct !== null ? 8 : 0 }}>
              <GenreChip genre={item.genre} />
              {item.expiresAt && <ExpiryTag date={item.expiresAt} />}
            </div>

            {/* Progress bar */}
            {pct !== null && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:10, color:T.textSub, fontWeight:600 }}>
                    {item.watchedEpisodes}/{item.totalEpisodes}話
                  </span>
                  <span style={{ fontSize:10, color: s.color, fontWeight:700 }}>{pct}%</span>
                </div>
                <div style={{ height:5, background:T.bg, borderRadius:10, overflow:"hidden" }}>
                  <div style={{
                    height:"100%",
                    width:`${pct}%`,
                    background: item.status === "completed"
                      ? `linear-gradient(90deg, ${T.mint}, #00E5B0)`
                      : `linear-gradient(90deg, ${s.color}, ${s.color}BB)`,
                    borderRadius:10,
                    transition:"width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                  }}/>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end", flexShrink:0 }}>
            <button onClick={() => onToggleStatus(item.id, nextStatus[item.status])} style={{
              background: st.bg, color: st.color,
              border:"none", borderRadius:20,
              padding:"5px 12px", fontSize:11, fontWeight:700,
              cursor:"pointer", whiteSpace:"nowrap",
              transition:"all 0.15s",
            }}>{st.label}</button>
            {item.totalEpisodes > 1 && (
              <button onClick={() => setShowEps(!showEps)} style={{
                background: T.bg, color: T.textMid,
                border:"none", borderRadius:20,
                padding:"5px 12px", fontSize:10, fontWeight:600,
                cursor:"pointer",
              }}>{showEps ? "閉じる ▲" : "話数 ▼"}</button>
            )}
          </div>
        </div>

        {/* Episode grid */}
        {showEps && item.totalEpisodes > 1 && (
          <div style={{
            marginTop:14, paddingTop:14,
            borderTop:`1.5px dashed ${T.border}`,
          }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {Array.from({ length: item.totalEpisodes }, (_,i) => i+1).map(ep => {
                const done = ep <= item.watchedEpisodes;
                return (
                  <button key={ep} onClick={() => onUpdateProgress(item.id, ep)} style={{
                    width:34, height:34, borderRadius:10,
                    background: done ? s.color : T.bg,
                    color: done ? "#fff" : T.textSub,
                    border: done ? "none" : `1.5px solid ${T.border}`,
                    fontSize:11, fontWeight:700, cursor:"pointer",
                    transition:"all 0.15s",
                    boxShadow: done ? `0 2px 8px ${s.color}44` : "none",
                  }}
                    onMouseEnter={e => { if (!done) { e.currentTarget.style.background = s.light; e.currentTarget.style.color = s.color; }}}
                    onMouseLeave={e => { if (!done) { e.currentTarget.style.background = T.bg; e.currentTarget.style.color = T.textSub; }}}
                  >{ep}</button>
                );
              })}
            </div>
            <p style={{ color:T.textSub, fontSize:10, marginTop:8, marginBottom:0 }}>
              話数をタップするとその話まで視聴済みになります
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: T.bg,
        borderTop:`1.5px solid ${T.border}`,
        padding:"9px 18px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <span style={{ fontSize:11, color:T.textSub }}>
          {item.service === "TVer" ? "📡 TVer" :
           item.service === "Netflix" ? "🎬 Netflix" :
           item.service === "U-NEXT" ? "📺 U-NEXT" : "▶ YouTube"}
        </span>
        <button onClick={() => onRemove(item.id)} style={{
          background:"none", border:"none",
          color:T.textSub, fontSize:11, cursor:"pointer",
          padding:"2px 4px",
          transition:"color 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = T.coral}
          onMouseLeave={e => e.currentTarget.style.color = T.textSub}
        >削除</button>
      </div>
    </div>
  );
}

/* ─── TOAST ─────────────────────────────────────────────────────────────────── */
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position:"fixed", top:24, left:"50%", transform:"translateX(-50%)",
      background: T.text, color:"#fff",
      borderRadius:40, padding:"12px 22px",
      fontSize:13, fontWeight:700, whiteSpace:"nowrap",
      zIndex:9999,
      boxShadow:"0 8px 40px rgba(0,0,0,0.2)",
      animation:"toastIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
    }}>{msg}</div>
  );
}

/* ─── EMPTY STATE ─────────────────────────────────────────────────────────── */
function EmptyState({ icon, title, sub }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"60px 20px", gap:12,
    }}>
      <div style={{
        width:72, height:72, borderRadius:24,
        background: T.border,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:32,
      }}>{icon}</div>
      <div style={{ fontWeight:800, fontSize:15, color:T.textMid }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:T.textSub, textAlign:"center", lineHeight:1.6 }}>{sub}</div>}
    </div>
  );
}

/* ─── MAIN ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("catalog");
  const [svc, setSvc] = useState("Netflix");
  const [myList, setMyList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("added");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("wl_mylist");
        if (r?.value) {
          const p = JSON.parse(r.value);
          setMyList(p.map(x => ({
            ...x,
            expiresAt: x.expiresAt ? new Date(x.expiresAt) : undefined,
            addedAt: new Date(x.addedAt),
          })));
        }
      } catch {}
    })();
  }, []);

  const persist = list => {
    try { window.storage.set("wl_mylist", JSON.stringify(list)); } catch {}
  };

  const fire = msg => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2200);
  };

  const isAdded = id => myList.some(x => x.id === id);

  const handleAdd = (item, service) => {
    const next = [{ ...item, service, status:"unwatched", watchedEpisodes:0, totalEpisodes:item.episodes||1, addedAt:new Date() }, ...myList];
    setMyList(next); persist(next);
    fire(`「${item.title}」を追加しました ✅`);
  };

  const handleRemove = id => {
    const next = myList.filter(x => x.id !== id);
    setMyList(next); persist(next);
    fire("削除しました");
  };

  const handleToggle = (id, status) => {
    const next = myList.map(x => x.id === id
      ? { ...x, status, watchedEpisodes: status === "completed" ? x.totalEpisodes : x.watchedEpisodes }
      : x);
    setMyList(next); persist(next);
    const msg = { unwatched:"未視聴に戻しました", watching:"視聴中にしました ▶️", completed:"視聴完了！🎉" };
    fire(msg[status]);
  };

  const handleProgress = (id, ep) => {
    const next = myList.map(x => x.id === id
      ? { ...x, watchedEpisodes:ep, status: ep >= x.totalEpisodes ? "completed" : "watching" }
      : x);
    setMyList(next); persist(next);
  };

  const catalog = (CATALOG_MAP[svc] || []).filter(x =>
    !search || x.title.includes(search) || x.genre.includes(search)
  );

  const visibleList = myList
    .filter(x => {
      if (filter === "all") return true;
      if (filter === "tver") return x.service === "TVer";
      return x.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === "expiry") {
        if (!a.expiresAt && !b.expiresAt) return 0;
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return a.expiresAt - b.expiresAt;
      }
      return b.addedAt - a.addedAt;
    });

  const urgentCnt = myList.filter(x => x.expiresAt && daysLeft(x.expiresAt) <= 3).length;
  const currentSvc = SERVICES[svc];

  const statCounts = {
    all: myList.length,
    unwatched: myList.filter(x => x.status === "unwatched").length,
    watching:  myList.filter(x => x.status === "watching").length,
    completed: myList.filter(x => x.status === "completed").length,
  };

  return (
    <div style={{
      minHeight:"100vh",
      background: T.bg,
      fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",
      color: T.text,
    }}>
      <Toast msg={toast} />

      {/* ── HEADER ── */}
      <header style={{
        background: T.surface,
        borderBottom:`1.5px solid ${T.border}`,
        padding:"0 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        height:58,
        position:"sticky", top:0, zIndex:100,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{
            width:32, height:32, borderRadius:10,
            background: T.coral,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:16, color:"#fff", fontWeight:900,
            boxShadow:`0 4px 12px ${T.coral}55`,
          }}>W</div>
          <span style={{ fontWeight:900, fontSize:16, letterSpacing:"-0.04em", color:T.text }}>
            Watch<span style={{ color:T.coral }}>List</span>
          </span>
        </div>

        {/* Tab switcher */}
        <div style={{
          display:"flex", gap:2,
          background: T.bg, borderRadius:40,
          padding:3,
          border:`1.5px solid ${T.border}`,
        }}>
          {[
            { key:"catalog", label:"カタログ" },
            { key:"mylist",  label:`マイリスト${myList.length > 0 ? ` ${myList.length}` : ""}` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? T.surface : "transparent",
              color: tab === t.key ? T.text : T.textSub,
              border:"none", borderRadius:40,
              padding:"6px 18px", fontSize:12, fontWeight:800,
              cursor:"pointer",
              boxShadow: tab === t.key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition:"all 0.2s",
              display:"flex", alignItems:"center", gap:5,
            }}>
              {t.label}
              {t.key === "mylist" && urgentCnt > 0 && (
                <span style={{
                  width:16, height:16, borderRadius:8,
                  background: T.coral, color:"#fff",
                  fontSize:9, fontWeight:900,
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  animation:"pulse 1.5s infinite",
                }}>{urgentCnt}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth:680, margin:"0 auto", padding:"24px 16px 60px" }}>

        {/* ════ CATALOG ════ */}
        {tab === "catalog" && (<>
          {/* Service Pills */}
          <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            {Object.entries(SERVICES).map(([name, s]) => {
              const active = svc === name;
              return (
                <button key={name} onClick={() => { setSvc(name); setSearch(""); }} style={{
                  background: active ? s.color : T.surface,
                  color: active ? "#fff" : T.textMid,
                  border: `1.5px solid ${active ? s.color : T.border}`,
                  borderRadius:40, padding:"8px 18px",
                  fontSize:13, fontWeight:800, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:6,
                  transition:"all 0.2s",
                  boxShadow: active ? `0 4px 20px ${s.color}44` : "none",
                }}>
                  <span style={{ fontSize:12 }}>{s.icon}</span>
                  {name}
                </button>
              );
            })}
          </div>

          {/* Service hero banner */}
          <div style={{
            background: `linear-gradient(135deg, ${currentSvc.light}, ${T.surface})`,
            border: `1.5px solid ${currentSvc.color}30`,
            borderRadius:24, padding:"18px 22px",
            marginBottom:16,
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <div>
              <div style={{ fontWeight:900, fontSize:20, color:currentSvc.color, letterSpacing:"-0.04em" }}>
                {svc}
              </div>
              <div style={{ color:T.textSub, fontSize:12, marginTop:3 }}>
                {svc === "TVer"
                  ? "視聴期限あり・無料配信中"
                  : `${catalog.length}作品を配信中`}
              </div>
            </div>
            <div style={{
              width:48, height:48, borderRadius:16,
              background: currentSvc.color + "18",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, fontWeight:900, color:currentSvc.color,
            }}>{currentSvc.icon}</div>
          </div>

          {/* TVer notice */}
          {svc === "TVer" && (
            <div style={{
              background:"#FFF8E8",
              border:`1.5px solid #F59E0B44`,
              borderRadius:16, padding:"11px 16px",
              marginBottom:16,
              display:"flex", alignItems:"center", gap:10,
              fontSize:12, color:"#A07000", fontWeight:600,
            }}>
              <span style={{ fontSize:18 }}>⏰</span>
              <span>赤バッジは今日・明日が期限！見忘れ注意</span>
            </div>
          )}

          {/* Search */}
          <div style={{ position:"relative", marginBottom:16 }}>
            <span style={{
              position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
              color:T.textSub, fontSize:14, pointerEvents:"none",
            }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="タイトル・ジャンルで検索"
              style={{
                width:"100%", boxSizing:"border-box",
                background:T.surface, border:`1.5px solid ${T.border}`,
                borderRadius:40, padding:"11px 16px 11px 40px",
                fontSize:13, color:T.text, outline:"none",
                transition:"border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = currentSvc.color}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>

          {/* Cards */}
          {catalog.length === 0
            ? <EmptyState icon="🔍" title="該当作品なし" />
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {catalog.map((item, i) => (
                  <CatalogCard key={item.id} item={item} service={svc}
                    added={isAdded(item.id)} onAdd={handleAdd} idx={i} />
                ))}
              </div>
          }
        </>)}

        {/* ════ MY LIST ════ */}
        {tab === "mylist" && (<>
          {/* Stats row */}
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {[
              { key:"all",       label:"全作品", color:T.textMid },
              { key:"unwatched", label:"未視聴",  color:T.textSub },
              { key:"watching",  label:"視聴中",  color:T.sky },
              { key:"completed", label:"完了",    color:T.mint },
            ].map(s => (
              <button key={s.key} onClick={() => setFilter(s.key)} style={{
                flex:1,
                background: filter === s.key ? T.surface : "transparent",
                border: filter === s.key ? `1.5px solid ${T.border}` : `1.5px solid transparent`,
                borderRadius:16, padding:"10px 4px",
                cursor:"pointer", transition:"all 0.2s",
                boxShadow: filter === s.key ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
              }}>
                <div style={{ fontWeight:900, fontSize:20, color:s.color }}>{statCounts[s.key]}</div>
                <div style={{ fontSize:10, color:T.textSub, fontWeight:600, marginTop:2 }}>{s.label}</div>
              </button>
            ))}
          </div>

          {/* Urgent */}
          {urgentCnt > 0 && (
            <div style={{
              background:"#FFF0EE",
              border:`1.5px solid ${T.coral}33`,
              borderRadius:20, padding:"14px 18px",
              marginBottom:16,
              display:"flex", alignItems:"center", gap:12,
            }}>
              <div style={{
                width:40, height:40, borderRadius:12,
                background:`${T.coral}18`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:20, flexShrink:0,
              }}>🚨</div>
              <div>
                <div style={{ fontWeight:800, fontSize:13, color:T.coral }}>
                  期限切れ間近の作品があります
                </div>
                <div style={{ color:T.textSub, fontSize:11, marginTop:2 }}>
                  TVer {urgentCnt}作品が3日以内に視聴期限を迎えます
                </div>
              </div>
            </div>
          )}

          {/* Filter & Sort bar */}
          <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
            <div style={{ display:"flex", gap:5, flex:1, flexWrap:"wrap" }}>
              {[
                { k:"all",       l:"すべて" },
                { k:"tver",      l:"⏰ TVer" },
              ].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)} style={{
                  background: filter === f.k ? T.text : T.surface,
                  color: filter === f.k ? "#fff" : T.textMid,
                  border:`1.5px solid ${filter === f.k ? T.text : T.border}`,
                  borderRadius:40, padding:"6px 14px",
                  fontSize:11, fontWeight:700, cursor:"pointer",
                  transition:"all 0.15s",
                }}>{f.l}</button>
              ))}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              background: T.surface,
              border:`1.5px solid ${T.border}`,
              borderRadius:40, padding:"7px 14px",
              fontSize:11, fontWeight:700, color:T.text,
              cursor:"pointer", outline:"none",
            }}>
              <option value="added">追加が新しい順</option>
              <option value="expiry">視聴期限が近い順 ⏰</option>
            </select>
          </div>

          {/* List */}
          {visibleList.length === 0
            ? (myList.length === 0
                ? <EmptyState icon="🎬" title="マイリストは空です"
                    sub={"カタログから「+」ボタンを押して\n作品を追加しましょう"} />
                : <EmptyState icon="🔍" title="該当する作品がありません" />
              )
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {visibleList.map(item => (
                  <MyListCard key={item.id} item={item}
                    onRemove={handleRemove}
                    onToggleStatus={handleToggle}
                    onUpdateProgress={handleProgress}
                  />
                ))}
              </div>
          }
        </>)}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap');
        @keyframes slideUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes toastIn {
          from { opacity:0; transform:translateX(-50%) scale(0.92); }
          to   { opacity:1; transform:translateX(-50%) scale(1); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50% { opacity:0.5; }
        }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        button { font-family:inherit; }
        input  { font-family:inherit; }
        select { font-family:inherit; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:4px; }
      `}</style>
    </div>
  );
}
