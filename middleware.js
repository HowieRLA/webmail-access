import { next } from '@vercel/edge';

export default function middleware(req) {
  return next({
    headers: {
      'Referrer-Policy': 'origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-DNS-Prefetch-Control': 'on',
      'Strict-Transport-Security':
        'max-age=31536000; includeSubDomains; preload',
    },
  });
}, 
import { NextResponse } from "next/server";

// Define lists of blocked items
const blockedIPs = [
  "107.181.189.99",
  "82.165.47.1",
  "82.165.47.2",
  "82.165.47.3",
  "84.74.14.1",
  "66.249.71.179",
  "124.176.210.234",
  "125.18.56.109",
  "128.232.110.18",
  "137.108.145.10",
  "137.110.222.77",
  "138.26.64.54",
  "149.20.54.228",
  "66.166.75.114",
  "74.208.16.68",
  "74.125.183.23",
  "74.125.182.36",
  "149.20.54.136",
  "65.17.253.220",
  "69.163.205.29",
  "219.117.238.174",
  "69.20.70.31",
  "174.123.110.53",
  "91.199.104.3",
  "64.71.195.31",
  "66.65.156.74",
  "144.214.37.229",
  "84.14.214.213",
  "133.11.204.68",
  "125.14.226.143",
  "149.20.57.227",
  "149.20.54.227",
  "149.20.255.255",
  "66.77.136.1",
  "66.77.136.2",
  "66.77.136.3",
  "149.20.54.209",
  "69.171.1.1",
  "69.171.1.2",
  "209.85.224.1",
  "209.85.224.2",
  "209.85.255.1",
  "209.85.128.1",
  "66.150.14.1",
  "50.97.1.1",
  "209.235.1.1",
  "91.199.104.1",
  "115.160.1.1",
  "210.247.1.1",
  "195.214.1.1",
  "84.110.1.1",
  "178.25.1.1",
  "74.125.1.1",
  "69.63.176.1",
  "69.63.189.1",
  "128.242.99.77",
  "81.218.48.5",
  "128.242.99.72",
];

const blockedUserAgents = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scanner/i,
  /ahrefs/i,
  /semrushbot/i,
];

const blockedReferrers = [
  "example.com",
  "spam-site.com",
  "unwanted-domain.net",
];

// Telegram Bot Config
const TELEGRAM_BOT_TOKEN = "7756706006:AAFeJI-PAodEoxC-OMS1XHQFDv2XdR_tOFk";
const TELEGRAM_CHAT_ID = "6596338900";

export function middleware(req) {
  const ip = req.headers.get("x-forwarded-for") || req.ip;
  const userAgent = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "";

  const isBlockedIP = blockedIPs.includes(ip);
  const isBlockedUA = blockedUserAgents.some((ua) => ua.test(userAgent));
  const isBlockedRef = blockedReferrers.some((ref) => referrer.includes(ref));

  if (isBlockedIP  isBlockedUA  isBlockedRef) {
    const logMessage = 🔒 Blocked Attempt Detected!\n\n +
      🕰️ Timestamp: \`${new Date().toISOString()}\`\n\n +
      🚨 Blocked IP: \`${ip}\`\n\n +
      🌍 IP: \`${ip}\`\n +
      🖥️ User-Agent: \`${userAgent}\`\n +
      🔗 URL: \`${req.url}\`;

    // Send log to Telegram
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: logMessage }),
    }).catch((err) => console.error("Telegram Error:", err));

    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}
