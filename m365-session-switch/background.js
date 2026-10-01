const PORTALS = [
  { name: "Microsoft 365", detail: "Admin center", url: "https://admin.microsoft.com", origins: ["https://admin.microsoft.com", "https://admin.cloud.microsoft"] },
  { name: "Exchange", detail: "Mail and recipients", url: "https://admin.exchange.microsoft.com", origins: ["https://admin.exchange.microsoft.com", "https://outlook.office.com", "https://outlook.office365.com"] },
  { name: "Entra", detail: "Identity", url: "https://entra.microsoft.com", origins: ["https://entra.microsoft.com"] },
  { name: "Intune", detail: "Devices", url: "https://intune.microsoft.com", origins: ["https://intune.microsoft.com", "https://endpoint.microsoft.com"] },
  { name: "Defender", detail: "Security", url: "https://security.microsoft.com", origins: ["https://security.microsoft.com"] },
  { name: "Purview", detail: "Compliance", url: "https://compliance.microsoft.com", origins: ["https://compliance.microsoft.com", "https://purview.microsoft.com"] },
  { name: "Teams", detail: "Teams admin", url: "https://admin.teams.microsoft.com", origins: ["https://admin.teams.microsoft.com"] },
  { name: "Azure", detail: "Portal", url: "https://portal.azure.com", origins: ["https://portal.azure.com"] }
];

function hostOf(origin) {
  return new URL(origin).hostname;
}

async function clearOrigins(origins) {
  const hosts = origins.map(hostOf);
  const batches = await Promise.all(hosts.map((domain) => chrome.cookies.getAll({ domain })));
  await Promise.all(
    batches.flat().map((cookie) => {
      const host = cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain;
      return chrome.cookies.remove({
        url: `${cookie.secure ? "https" : "http"}://${host}${cookie.path || "/"}`,
        name: cookie.name
      });
    })
  );
  await chrome.browsingData.remove(
    { origins },
    { cookies: true, localStorage: true, indexedDB: true, cacheStorage: true, serviceWorkers: true, cache: true }
  );
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    if (message.type === "portals") {
      sendResponse({ ok: true, portals: PORTALS.map(({ name, detail, url }) => ({ name, detail, url })) });
      return;
    }
    if (message.type === "open") {
      const portal = PORTALS.find((item) => item.name === message.name);
      if (!portal) {
        sendResponse({ ok: false, error: "Unknown portal." });
        return;
      }
      await clearOrigins(portal.origins);
      await chrome.tabs.create({ url: portal.url });
      sendResponse({ ok: true });
      return;
    }
    sendResponse({ ok: false, error: "Unknown request." });
  })().catch((err) => sendResponse({ ok: false, error: err.message }));
  return true;
});
