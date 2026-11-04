// Branded Avatars for The Storyteller Quiz Night
// 12 fun characters, each wearing the traditional Red Fez hat with a silk tassel!

const FEZ_HAT_SVG = `
  <!-- Red Fez Hat with Tassel -->
  <g class="fez-hat" transform="translate(0, -6)">
    <!-- Shadow under Fez -->
    <ellipse cx="50" cy="22" rx="15" ry="3" fill="rgba(0,0,0,0.25)" />
    <!-- Fez Red Body (Tapered Cylinder) -->
    <path d="M 38 21 L 41 8 L 59 8 L 62 21 Z" fill="url(#fezRedGrad)" stroke="#7A0012" stroke-width="0.8" />
    <!-- Fez Oval Top -->
    <ellipse cx="50" cy="8" rx="9" ry="2.5" fill="#E62E4A" stroke="#7A0012" stroke-width="0.6" />
    <!-- Gold Trim Base -->
    <ellipse cx="50" cy="21" rx="12" ry="2" fill="#FBBF24" stroke="#D97706" stroke-width="0.5" />
    <!-- Top Button / Stem -->
    <circle cx="50" cy="7.5" r="1.5" fill="#1F2937" />
    <!-- Black Silk Tassel String -->
    <path d="M 50 7.5 Q 63 9, 65 18" fill="none" stroke="#111827" stroke-width="1.2" stroke-linecap="round" />
    <!-- Black Silk Tassel Fringe -->
    <path d="M 64 17 L 68 25 L 62 25 Z" fill="#111827" />
    <!-- Tassel Ring -->
    <circle cx="64.5" cy="18" r="1.2" fill="#FBBF24" />
  </g>
`;

const AVATAR_DEFS = `
  <defs>
    <linearGradient id="fezRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="40%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#991B1B" />
    </linearGradient>
    <linearGradient id="bgLion" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF3C7"/><stop offset="100%" stop-color="#FDE68A"/></linearGradient>
    <linearGradient id="bgFalcon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E0E7FF"/><stop offset="100%" stop-color="#C7D2FE"/></linearGradient>
    <linearGradient id="bgCamel" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFEDD5"/><stop offset="100%" stop-color="#FED7AA"/></linearGradient>
    <linearGradient id="bgBear" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FCE7F3"/><stop offset="100%" stop-color="#FBCFE8"/></linearGradient>
    <linearGradient id="bgFox" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEE2E2"/><stop offset="100%" stop-color="#FECACA"/></linearGradient>
    <linearGradient id="bgPanda" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D1FAE5"/><stop offset="100%" stop-color="#A7F3D0"/></linearGradient>
    <linearGradient id="bgCat" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E0F2FE"/><stop offset="100%" stop-color="#BAE6FD"/></linearGradient>
    <linearGradient id="bgStar" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#EDE9FE"/><stop offset="100%" stop-color="#DDD6FE"/></linearGradient>
    <linearGradient id="bgTiger" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF08A"/><stop offset="100%" stop-color="#FDE047"/></linearGradient>
    <linearGradient id="bgWolf" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F1F5F9"/><stop offset="100%" stop-color="#CBD5E1"/></linearGradient>
    <linearGradient id="bgEagle" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF3C7"/><stop offset="100%" stop-color="#FCD34D"/></linearGradient>
    <linearGradient id="bgRabbit" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FDF2F8"/><stop offset="100%" stop-color="#FCE7F3"/></linearGradient>
  </defs>
`;

const AVATARS = [
  {
    id: "fez_lion",
    name: "Fez Lion",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgLion)" stroke="#F59E0B" stroke-width="2.5" />
      <circle cx="50" cy="56" r="28" fill="#D97706" />
      <circle cx="32" cy="38" r="8" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
      <circle cx="68" cy="38" r="8" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />
      <circle cx="50" cy="58" r="22" fill="#FBBF24" />
      <ellipse cx="50" cy="64" rx="10" ry="7" fill="#FEF3C7" />
      <polygon points="46,60 54,60 50,65" fill="#78350F" />
      <path d="M 50 65 L 50 68 M 47 67 Q 50 70 53 67" stroke="#78350F" stroke-width="1.2" fill="none" />
      <circle cx="42" cy="54" r="3.5" fill="#1F2937" /><circle cx="43.5" cy="52.5" r="1.2" fill="#FFF" />
      <circle cx="58" cy="54" r="3.5" fill="#1F2937" /><circle cx="59.5" cy="52.5" r="1.2" fill="#FFF" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_falcon",
    name: "Fez Falcon",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgFalcon)" stroke="#6366F1" stroke-width="2.5" />
      <circle cx="50" cy="56" r="24" fill="#475569" />
      <circle cx="50" cy="58" r="20" fill="#F8FAFC" />
      <path d="M 38 52 L 35 68 L 42 62 Z" fill="#334155" />
      <path d="M 62 52 L 65 68 L 58 62 Z" fill="#334155" />
      <circle cx="42" cy="52" r="4.5" fill="#F59E0B" /><circle cx="42" cy="52" r="2.8" fill="#0F172A" /><circle cx="43" cy="51" r="1" fill="#FFF" />
      <circle cx="58" cy="52" r="4.5" fill="#F59E0B" /><circle cx="58" cy="52" r="2.8" fill="#0F172A" /><circle cx="59" cy="51" r="1" fill="#FFF" />
      <path d="M 46 56 Q 50 56 54 56 L 50 68 Q 48 64 46 56 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_camel",
    name: "Fez Camel",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgCamel)" stroke="#F97316" stroke-width="2.5" />
      <ellipse cx="50" cy="62" rx="20" ry="24" fill="#D97706" />
      <ellipse cx="50" cy="68" rx="14" ry="12" fill="#FDE68A" />
      <ellipse cx="32" cy="45" rx="5" ry="9" transform="rotate(-20 32 45)" fill="#B45309" />
      <ellipse cx="68" cy="45" rx="5" ry="9" transform="rotate(20 68 45)" fill="#B45309" />
      <ellipse cx="40" cy="55" rx="3.5" ry="3" fill="#1F2937" /><circle cx="41.5" cy="54" r="1" fill="#FFF" />
      <ellipse cx="60" cy="55" rx="3.5" ry="3" fill="#1F2937" /><circle cx="61.5" cy="54" r="1" fill="#FFF" />
      <ellipse cx="46" cy="66" rx="1.5" ry="2.5" fill="#92400E" /><ellipse cx="54" cy="66" rx="1.5" ry="2.5" fill="#92400E" />
      <path d="M 45 72 Q 50 76 55 72" stroke="#92400E" stroke-width="1.5" fill="none" stroke-linecap="round" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_tiger",
    name: "Fez Tiger",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgTiger)" stroke="#EA580C" stroke-width="2.5" />
      <circle cx="30" cy="38" r="8" fill="#F97316" />
      <circle cx="70" cy="38" r="8" fill="#F97316" />
      <circle cx="50" cy="58" r="23" fill="#FB923C" />
      <path d="M 30 52 L 40 54 L 30 56 Z" fill="#1F2937" />
      <path d="M 70 52 L 60 54 L 70 56 Z" fill="#1F2937" />
      <ellipse cx="50" cy="66" rx="12" ry="7" fill="#FEF3C7" />
      <polygon points="47,62 53,62 50,65" fill="#1F2937" />
      <circle cx="42" cy="54" r="3.2" fill="#1F2937" /><circle cx="43" cy="53" r="1" fill="#FFF" />
      <circle cx="58" cy="54" r="3.2" fill="#1F2937" /><circle cx="59" cy="53" r="1" fill="#FFF" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_bear",
    name: "Fez Bear",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgBear)" stroke="#EC4899" stroke-width="2.5" />
      <circle cx="30" cy="35" r="9" fill="#78350F" /><circle cx="30" cy="35" r="5" fill="#F472B6" />
      <circle cx="70" cy="35" r="9" fill="#78350F" /><circle cx="70" cy="35" r="5" fill="#F472B6" />
      <circle cx="50" cy="58" r="23" fill="#92400E" />
      <ellipse cx="50" cy="65" rx="11" ry="8" fill="#FDE68A" />
      <ellipse cx="50" cy="62" rx="4" ry="2.5" fill="#1F2937" />
      <circle cx="41" cy="54" r="3" fill="#1F2937" /><circle cx="59" cy="54" r="3" fill="#1F2937" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_fox",
    name: "Fez Fox",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgFox)" stroke="#EF4444" stroke-width="2.5" />
      <polygon points="26,45 32,24 44,38" fill="#EA580C" stroke="#C2410C" stroke-width="1" />
      <polygon points="74,45 68,24 56,38" fill="#EA580C" stroke="#C2410C" stroke-width="1" />
      <path d="M 28 50 Q 50 36 72 50 Q 80 68 50 80 Q 20 68 28 50 Z" fill="#F97316" />
      <path d="M 32 58 Q 40 74 50 76 Q 44 60 36 55 Z" fill="#FFF" />
      <path d="M 68 58 Q 60 74 50 76 Q 56 60 64 55 Z" fill="#FFF" />
      <circle cx="50" cy="74" r="2.5" fill="#1F2937" />
      <ellipse cx="40" cy="56" rx="3.5" ry="2.5" transform="rotate(-15 40 56)" fill="#1F2937" />
      <ellipse cx="60" cy="56" rx="3.5" ry="2.5" transform="rotate(15 60 56)" fill="#1F2937" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_panda",
    name: "Fez Panda",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgPanda)" stroke="#10B981" stroke-width="2.5" />
      <circle cx="30" cy="35" r="9" fill="#1F2937" /><circle cx="70" cy="35" r="9" fill="#1F2937" />
      <circle cx="50" cy="58" r="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <ellipse cx="38" cy="55" rx="6" ry="7.5" transform="rotate(-15 38 55)" fill="#1F2937" /><circle cx="39" cy="54" r="2" fill="#FFF" />
      <ellipse cx="62" cy="55" rx="6" ry="7.5" transform="rotate(15 62 55)" fill="#1F2937" /><circle cx="61" cy="54" r="2" fill="#FFF" />
      <ellipse cx="50" cy="65" rx="3.5" ry="2.2" fill="#1F2937" />
      <path d="M 47 69 Q 50 72 53 69" stroke="#1F2937" stroke-width="1.2" fill="none" stroke-linecap="round" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_cat",
    name: "Fez Cat",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgCat)" stroke="#0EA5E9" stroke-width="2.5" />
      <polygon points="28,45 34,25 45,38" fill="#FBBF24" /><polygon points="72,45 66,25 55,38" fill="#FBBF24" />
      <circle cx="50" cy="58" r="22" fill="#FDE047" />
      <ellipse cx="42" cy="54" rx="3.5" ry="4" fill="#0284C7" /><circle cx="43" cy="52.5" r="1" fill="#FFF" />
      <ellipse cx="58" cy="54" rx="3.5" ry="4" fill="#0284C7" /><circle cx="59" cy="52.5" r="1" fill="#FFF" />
      <polygon points="48,62 52,62 50,64" fill="#F472B6" />
      <path d="M 47 66 Q 50 68 53 66" stroke="#92400E" stroke-width="1" fill="none" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_wolf",
    name: "Fez Wolf",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgWolf)" stroke="#64748B" stroke-width="2.5" />
      <polygon points="26,45 32,24 44,38" fill="#475569" /><polygon points="74,45 68,24 56,38" fill="#475569" />
      <circle cx="50" cy="58" r="23" fill="#64748B" />
      <polygon points="50,68 45,62 55,62" fill="#0F172A" />
      <circle cx="41" cy="53" r="3.5" fill="#F59E0B" /><circle cx="41" cy="53" r="2" fill="#0F172A" />
      <circle cx="59" cy="53" r="3.5" fill="#F59E0B" /><circle cx="59" cy="53" r="2" fill="#0F172A" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_eagle",
    name: "Fez Eagle",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgEagle)" stroke="#D97706" stroke-width="2.5" />
      <circle cx="50" cy="58" r="24" fill="#FFFFFF" />
      <circle cx="41" cy="53" r="4" fill="#F59E0B" /><circle cx="41" cy="53" r="2.5" fill="#0F172A" />
      <circle cx="59" cy="53" r="4" fill="#F59E0B" /><circle cx="59" cy="53" r="2.5" fill="#0F172A" />
      <path d="M 45 56 Q 50 56 55 56 L 50 70 Q 47 64 45 56 Z" fill="#F59E0B" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_rabbit",
    name: "Fez Rabbit",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgRabbit)" stroke="#F472B6" stroke-width="2.5" />
      <ellipse cx="36" cy="30" rx="6" ry="16" fill="#FFFFFF" /><ellipse cx="36" cy="30" rx="3" ry="11" fill="#F472B6" />
      <ellipse cx="64" cy="30" rx="6" ry="16" fill="#FFFFFF" /><ellipse cx="64" cy="30" rx="3" ry="11" fill="#F472B6" />
      <circle cx="50" cy="58" r="23" fill="#FFFFFF" />
      <circle cx="42" cy="54" r="3.2" fill="#1F2937" /><circle cx="58" cy="54" r="3.2" fill="#1F2937" />
      <polygon points="48,63 52,63 50,65" fill="#F472B6" />
      ${FEZ_HAT_SVG}
    </svg>`
  },
  {
    id: "fez_star",
    name: "Fez Hero",
    svg: `<svg viewBox="0 0 100 100" class="avatar-svg">
      ${AVATAR_DEFS}
      <circle cx="50" cy="50" r="48" fill="url(#bgStar)" stroke="#8B5CF6" stroke-width="2.5" />
      <path d="M 50 32 L 56 46 L 71 47 L 59 57 L 63 72 L 50 63 L 37 72 L 41 57 L 29 47 L 44 46 Z" fill="#FBBF24" stroke="#D97706" stroke-width="1.5" />
      <circle cx="45" cy="52" r="3" fill="#1F2937" /><circle cx="55" cy="52" r="3" fill="#1F2937" />
      <path d="M 46 58 Q 50 62 54 58" stroke="#78350F" stroke-width="1.5" fill="none" stroke-linecap="round" />
      ${FEZ_HAT_SVG}
    </svg>`
  }
];

function getRandomNickname() {
  const names = ["Zayd", "Maryam", "Ali", "Amina", "Bilal", "Fatima", "Hamza", "Khadija", "Yusuf", "Aisha", "Omar", "Sara", "Ibrahim", "Zaynab", "Tariq", "Layla"];
  const name = names[Math.floor(Math.random() * names.length)];
  const num = Math.floor(Math.random() * 89) + 10;
  return `${name}${num}`;
}

function getAvatarSvg(avatarId) {
  const found = AVATARS.find(a => a.id === avatarId);
  return found ? found.svg : AVATARS[0].svg;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { AVATARS, getRandomNickname, getAvatarSvg };
}
