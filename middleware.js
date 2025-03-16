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
}
import { NextResponse } from "next/server";

// ✅ Your Telegram Bot Token & Chat ID (Replace with your actual values)
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID";

// Function to send formatted log messages to Telegram
async function sendToTelegram(message) {
  const url = https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage;
  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "MarkdownV2",  // Enables Markdown formatting
  });

  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
  } catch (error) {
    console.error("Telegram API Error:", error);
  }
}

// Blocklists
const blockedIPs = ["107.181.189.99", "82.165.47.1", "74.125.183.23"];
const blockedUserAgents = [/bot/i, /crawler/i, /Googlebot/i, /ahrefs/i, /semrush/i];
const blockedReferrers = ["example.com", "spam-site.com", "google.com"];
const blockedKeywords = ["spam", "phish", "malware", "bot", "crawl"];

export async function middleware(req) {
  const ip = req.ip  req.headers.get("x-forwarded-for")  "";
  const userAgent = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "";
  const requestUrl = req.nextUrl.pathname.toLowerCase();

  // ✅ Get timestamp in UTC format
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, " ");

  let reason = "";

  // Check for blocked IP
  if (blockedIPs.includes(ip)) {
    reason = 🚨 *Blocked IP:* \`${ip}\`;
  }
  // Check for blocked User-Agent
  else if (blockedUserAgents.some((pattern) => pattern.test(userAgent))) {
    reason = 🕷️ *Blocked User-Agent:* \`${userAgent.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&")}\`;
  }
  // Check for blocked Referrer
  else if (blockedReferrers.some((domain) => referrer.includes(domain))) {
    reason = 🚧 *Blocked Referrer:* \`${referrer}\`;
  }
  // Check for blocked Keywords in URL
  else if (blockedKeywords.some((word) => requestUrl.includes(word))) {
    reason = 🔍 *Blocked URL Keyword:* \`${requestUrl}\`;
  }

  // If a block condition is met, send Telegram log and block access
  if (reason) {
    const logMessage = 🔒 *Blocked Attempt Detected!*\n\n🕰️ *Timestamp:* \`${timestamp} UTC\`\n${reason}\n\n🌍 *IP:* \`${ip}\`\n🖥️ *User-Agent:* \`${userAgent.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&")}\`\n🔗 *URL:* \`${req.nextUrl.href}\`;
    sendToTelegram(logMessage);
    return new Response("Access Denied", { status: 403 });
  }

  return NextResponse.next();
}

// Apply middleware to all paths
export const config = { matcher: "/:path*" };
