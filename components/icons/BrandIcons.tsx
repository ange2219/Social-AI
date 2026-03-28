// Logos officiels des plateformes sociales en SVG

export function IconInstagram({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="5%" stopColor="#fdf497"/>
          <stop offset="45%" stopColor="#fd5949"/>
          <stop offset="60%" stopColor="#d6249f"/>
          <stop offset="90%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="17.2" cy="6.8" r="1.2" fill="white"/>
    </svg>
  )
}

export function IconFacebook({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#1877F2"/>
      <path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="white"/>
    </svg>
  )
}

export function IconTikTok({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M16.5 5.5c.4.9 1.1 1.6 2 2v2c-.9 0-1.8-.3-2.5-.8v5.3c0 2.5-2 4.5-4.5 4.5S7 16.5 7 14s2-4.5 4.5-4.5c.2 0 .4 0 .5.1v2.1c-.2 0-.3-.1-.5-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V5.5h2z" fill="white"/>
      <path d="M16.5 5.5c.4.9 1.1 1.6 2 2v2c-.9 0-1.8-.3-2.5-.8v5.3c0 2.5-2 4.5-4.5 4.5S7 16.5 7 14s2-4.5 4.5-4.5c.2 0 .4 0 .5.1v2.1c-.2 0-.3-.1-.5-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V5.5h2z" fill="#69C9D0" opacity="0.5"/>
    </svg>
  )
}

export function IconTwitterX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M17.5 5.5h2.5L14.5 11.5 21 19h-4.5L12.5 14 7.5 19H5l5.5-6.5L5 5.5h4.5l3.5 5 4.5-5z" fill="white"/>
    </svg>
  )
}

export function IconLinkedIn({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#0077B5"/>
      <path d="M7 10h2v7H7v-7zm1-1.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" fill="white"/>
      <path d="M11 10h2v1c.5-.8 1.4-1.2 2-1.2 2 0 3 1.2 3 3.2V17h-2v-3.5c0-1-.4-1.7-1.3-1.7-.9 0-1.7.7-1.7 1.8V17h-2v-7z" fill="white"/>
    </svg>
  )
}

export function IconYouTube({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#FF0000"/>
      <path d="M19.5 8.5s-.2-1.3-.8-1.8c-.7-.8-1.5-.8-1.9-.8C14.7 5.8 12 5.8 12 5.8s-2.7 0-4.8.1c-.4 0-1.2.1-1.9.8-.6.6-.8 1.8-.8 1.8S4.3 9.9 4.3 11.3v1.3c0 1.4.2 2.8.2 2.8s.2 1.3.8 1.8c.7.8 1.7.7 2.1.8 1.5.1 6.4.2 6.4.2s2.7 0 4.8-.2c.4 0 1.2-.1 1.9-.8.6-.6.8-1.8.8-1.8s.2-1.4.2-2.8v-1.3c0-1.4-.2-2.8-.2-2.8z" fill="#FF0000"/>
      <path d="M10.5 14.5v-5l4.5 2.5-4.5 2.5z" fill="white"/>
    </svg>
  )
}

export function IconPinterest({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#E60023"/>
      <path d="M12 4C7.6 4 4 7.6 4 12c0 3.4 2.1 6.3 5 7.6-.1-.6-.1-1.6.1-2.3l1-4s-.3-.5-.3-1.3c0-1.2.7-2.1 1.6-2.1.8 0 1.1.6 1.1 1.2 0 .8-.5 1.9-.7 2.9-.2.9.4 1.6 1.3 1.6 1.5 0 2.7-1.6 2.7-3.9 0-2-1.5-3.5-3.6-3.5-2.4 0-3.8 1.8-3.8 3.7 0 .7.3 1.5.6 1.9.1.1.1.2 0 .3l-.2 1c0 .1-.1.2-.2.1-1.3-.6-2.1-2.5-2.1-4C7 8.7 9.4 6 13 6c3 0 5 2.1 5 4.8 0 3-1.8 5.3-4.4 5.3-.9 0-1.7-.4-1.9-1l-.5 2c-.2.7-.6 1.5-.9 2 .7.2 1.4.3 2.1.3 4.4 0 8-3.6 8-8s-3.6-8-8-8z" fill="white"/>
    </svg>
  )
}
