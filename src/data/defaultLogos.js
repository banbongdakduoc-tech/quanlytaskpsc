// High-quality sports club vector logos for each department in PharmacySportCLB (PSC)

function createSvgDataUri(svgContent) {
  const cleanSvg = svgContent.trim().replace(/\s+/g, ' ');
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

export const DEFAULT_DEPT_LOGOS = {
  // 1. Ban Chủ Nhiệm (BCN) - Shield, Gold Trophy, Stars & Obsidian/Emerald Gradient
  'bcn': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-bcn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064E3B" />
          <stop offset="50%" stop-color="#022C22" />
          <stop offset="100%" stop-color="#061214" />
        </linearGradient>
        <linearGradient id="gold-trophy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047" />
          <stop offset="50%" stop-color="#EAB308" />
          <stop offset="100%" stop-color="#CA8A04" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-bcn)" stroke="#10B981" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Trophy Icon -->
      <path d="M58 48 H102 V68 C102 80 92 88 80 88 C68 88 58 80 58 68 Z" fill="url(#gold-trophy)" />
      <path d="M58 54 H46 C46 64 54 70 58 70 Z" fill="none" stroke="#FDE047" stroke-width="3" stroke-linecap="round" />
      <path d="M102 54 H114 C114 64 106 70 102 70 Z" fill="none" stroke="#FDE047" stroke-width="3" stroke-linecap="round" />
      <path d="M74 88 H86 V102 H74 Z" fill="url(#gold-trophy)" />
      <rect x="62" y="102" width="36" height="8" rx="4" fill="url(#gold-trophy)" />
      <polygon points="80,56 83,63 90,63 85,68 87,75 80,71 73,75 75,68 70,63 77,63" fill="#022C22" />
      <!-- Text -->
      <text x="80" y="128" text-anchor="middle" fill="#34D399" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" letter-spacing="1">BCN</text>
      <text x="80" y="142" text-anchor="middle" fill="#A7F3D0" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">PHARMACY SPORT</text>
    </svg>
  `),

  // 2. Ban Cầu Lông (Badminton) - Shuttlecock & Sporty Amber Gradient
  'cau-long': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-caulong" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#78350F" />
          <stop offset="50%" stop-color="#451A03" />
          <stop offset="100%" stop-color="#140902" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-caulong)" stroke="#F59E0B" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Shuttlecock Icon -->
      <polygon points="56,44 104,44 94,84 66,84" fill="none" stroke="#FDE68A" stroke-width="3" stroke-linejoin="round" />
      <line x1="68" y1="44" x2="73" y2="84" stroke="#FDE68A" stroke-width="2" />
      <line x1="80" y1="44" x2="80" y2="84" stroke="#FDE68A" stroke-width="2" />
      <line x1="92" y1="44" x2="87" y2="84" stroke="#FDE68A" stroke-width="2" />
      <line x1="61" y1="64" x2="99" y2="64" stroke="#F59E0B" stroke-width="2" />
      <!-- Cork base -->
      <ellipse cx="80" cy="94" rx="14" ry="10" fill="#F59E0B" stroke="#FDE68A" stroke-width="2" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#FBBF24" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" letter-spacing="1">CẦU LÔNG</text>
      <text x="80" y="140" text-anchor="middle" fill="#FDE68A" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">BADMINTON • PSC</text>
    </svg>
  `),

  // 3. Ban Bóng Đá (Football) - Classic Soccer Ball & Neon Emerald Gradient
  'bong-da': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-bongda" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064E3B" />
          <stop offset="60%" stop-color="#062820" />
          <stop offset="100%" stop-color="#02140F" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-bongda)" stroke="#10B981" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Football Ball -->
      <circle cx="80" cy="68" r="32" fill="#F8FAFC" stroke="#0F172A" stroke-width="2" />
      <!-- Center Pentagon -->
      <polygon points="80,58 91,66 87,78 73,78 69,66" fill="#0F172A" />
      <!-- Inner Lines to Border -->
      <line x1="80" y1="58" x2="80" y2="40" stroke="#0F172A" stroke-width="2" />
      <line x1="91" y1="66" x2="108" y2="60" stroke="#0F172A" stroke-width="2" />
      <line x1="87" y1="78" x2="100" y2="92" stroke="#0F172A" stroke-width="2" />
      <line x1="73" y1="78" x2="60" y2="92" stroke="#0F172A" stroke-width="2" />
      <line x1="69" y1="66" x2="52" y2="60" stroke="#0F172A" stroke-width="2" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#34D399" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" letter-spacing="1">BÓNG ĐÁ</text>
      <text x="80" y="140" text-anchor="middle" fill="#A7F3D0" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">FOOTBALL • PSC</text>
    </svg>
  `),

  // 4. Ban Bóng Chuyền (Volleyball) - Classic Curved Lines & Electric Cyan Gradient
  'bong-chuyen': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-bongchuyen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E7490" />
          <stop offset="50%" stop-color="#155E75" />
          <stop offset="100%" stop-color="#082F49" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-bongchuyen)" stroke="#06B6D4" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(6, 182, 212, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Volleyball Ball -->
      <circle cx="80" cy="68" r="32" fill="#F8FAFC" stroke="#082F49" stroke-width="2.5" />
      <path d="M80 36 C80 56 64 68 48 68" fill="none" stroke="#082F49" stroke-width="2.5" />
      <path d="M80 36 C80 48 92 60 108 60" fill="none" stroke="#082F49" stroke-width="2.5" />
      <path d="M80 100 C80 80 96 68 112 68" fill="none" stroke="#082F49" stroke-width="2.5" />
      <path d="M80 100 C80 88 68 76 52 76" fill="none" stroke="#082F49" stroke-width="2.5" />
      <path d="M48 68 C64 68 72 84 80 100" fill="none" stroke="#082F49" stroke-width="2.5" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#22D3EE" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13" letter-spacing="1">BÓNG CHUYỀN</text>
      <text x="80" y="140" text-anchor="middle" fill="#A5F3FC" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">VOLLEYBALL • PSC</text>
    </svg>
  `),

  // 5. Ban Cheerleading - PomPoms, Megaphone, Stars & Neon Rose Gradient
  'cheerleading': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-cheer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9F1239" />
          <stop offset="50%" stop-color="#4C0519" />
          <stop offset="100%" stop-color="#1F020A" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-cheer)" stroke="#F43F5E" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(244, 63, 94, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Megaphone Icon -->
      <path d="M54 74 L94 56 V88 L54 74 Z" fill="#FDA4AF" stroke="#FFF" stroke-width="2.5" />
      <path d="M94 56 C102 56 108 63 108 72 C108 81 102 88 94 88 Z" fill="#F43F5E" stroke="#FFF" stroke-width="2.5" />
      <rect x="48" y="70" width="8" height="8" rx="2" fill="#FFF" />
      <!-- Stars around -->
      <polygon points="62,48 64,52 68,52 65,55 66,59 62,57 58,59 59,55 56,52 60,52" fill="#FFE4E6" />
      <polygon points="102,44 104,48 108,48 105,51 106,55 102,53 98,55 99,51 96,48 100,48" fill="#FDE047" />
      <polygon points="112,88 113,91 116,91 114,93 115,96 112,94 109,96 110,93 108,91 111,91" fill="#FFE4E6" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#FB7185" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="12" letter-spacing="1">CHEERLEADING</text>
      <text x="80" y="140" text-anchor="middle" fill="#FECDD3" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">DANCE • CHEER • PSC</text>
    </svg>
  `),

  // 6. Ban Tập Sự - Rising Star / Rocket / Growth & Vibrant Purple Gradient
  'tap-su': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-tapsu" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6B21A8" />
          <stop offset="50%" stop-color="#3B0764" />
          <stop offset="100%" stop-color="#140224" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-tapsu)" stroke="#A855F7" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(168, 85, 247, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Rocket Icon -->
      <path d="M80 40 C70 52 68 74 68 84 L80 90 L92 84 C92 74 90 52 80 40 Z" fill="#F3E8FF" stroke="#C084FC" stroke-width="2" />
      <circle cx="80" cy="62" r="6" fill="#9333EA" stroke="#FFF" stroke-width="1.5" />
      <!-- Wings -->
      <path d="M68 76 L56 86 L68 86 Z" fill="#A855F7" />
      <path d="M92 76 L104 86 L92 86 Z" fill="#A855F7" />
      <!-- Flame -->
      <polygon points="76,90 80,102 84,90" fill="#F59E0B" />
      <polygon points="78,90 80,98 82,90" fill="#FDE047" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#C084FC" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" letter-spacing="1">BAN TẬP SỰ</text>
      <text x="80" y="140" text-anchor="middle" fill="#E9D5FF" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">ROOKIE • INTERN • PSC</text>
    </svg>
  `),

  // 7. Ban Pickleball - Pickleball Paddle & Perforated Ball & Lime Spark Gradient
  'pickleball': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-pickle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3F6212" />
          <stop offset="50%" stop-color="#1A2E05" />
          <stop offset="100%" stop-color="#0A1202" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-pickle)" stroke="#84CC16" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(132, 204, 22, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Pickleball Paddle -->
      <rect x="58" y="42" width="40" height="46" rx="16" fill="#4D7C0F" stroke="#BEF264" stroke-width="3" transform="rotate(-15 78 65)" />
      <!-- Handle -->
      <rect x="68" y="86" width="8" height="22" rx="3" fill="#D9F99D" stroke="#365314" stroke-width="1.5" transform="rotate(-15 72 96)" />
      <!-- Pickleball Perforated Ball -->
      <circle cx="102" cy="58" r="16" fill="#FACC15" stroke="#365314" stroke-width="2" />
      <circle cx="98" cy="52" r="2" fill="#713F12" />
      <circle cx="106" cy="54" r="2" fill="#713F12" />
      <circle cx="102" cy="60" r="2" fill="#713F12" />
      <circle cx="96" cy="62" r="2" fill="#713F12" />
      <circle cx="106" cy="65" r="2" fill="#713F12" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#A3E635" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13" letter-spacing="1">PICKLEBALL</text>
      <text x="80" y="140" text-anchor="middle" fill="#D9F99D" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">SMASH & DINK • PSC</text>
    </svg>
  `),

  // 8. Ban Truyền Thông (Media) - Camera Lens, Waves & Dark Teal Gradient
  'truyen-thong': createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="bg-media" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#115E59" />
          <stop offset="50%" stop-color="#042F2E" />
          <stop offset="100%" stop-color="#021717" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="76" fill="url(#bg-media)" stroke="#14B8A6" stroke-width="4" />
      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(20, 184, 166, 0.3)" stroke-width="1.5" stroke-dasharray="4 3" />
      <!-- Camera Body -->
      <rect x="52" y="52" width="56" height="38" rx="8" fill="#042F2E" stroke="#2DD4BF" stroke-width="2.5" />
      <!-- Top Flash/Finder -->
      <rect x="66" y="44" width="18" height="8" rx="3" fill="#2DD4BF" />
      <!-- Lens -->
      <circle cx="80" cy="71" r="14" fill="#0D9488" stroke="#5EEAD4" stroke-width="2.5" />
      <circle cx="80" cy="71" r="7" fill="#CCFBF1" />
      <!-- Broadcast Wave lines -->
      <path d="M112 50 C116 56 116 66 112 72" fill="none" stroke="#2DD4BF" stroke-width="2" stroke-linecap="round" />
      <path d="M118 44 C124 53 124 73 118 82" fill="none" stroke="#5EEAD4" stroke-width="2" stroke-linecap="round" />
      <!-- Text -->
      <text x="80" y="126" text-anchor="middle" fill="#2DD4BF" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="13" letter-spacing="1">TRUYỀN THÔNG</text>
      <text x="80" y="140" text-anchor="middle" fill="#99F6E4" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1.5">MEDIA & CONTENT • PSC</text>
    </svg>
  `),
};

export function getDefaultDeptLogo(deptId) {
  return DEFAULT_DEPT_LOGOS[deptId] || DEFAULT_DEPT_LOGOS['bcn'];
}
