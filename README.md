# M365 Portal Picker

Browser extension for Microsoft Edge and Chrome that lets you open a Microsoft 365 admin center and choose which account to use.

Several admin centers, including Exchange, Entra, Intune, Defender, and Purview, do not have the account switcher that the Microsoft 365 admin center has. They reuse whatever session they cached last, so they often open as the wrong tenant. This extension clears only that portal's cached session and opens it in a new tab. Microsoft then shows the accounts you are already signed in with, and you pick one.

It does not sign you out of Microsoft, and it does not clear `login.microsoftonline.com`.

## Portals

| Portal | Opens |
| --- | --- |
| Microsoft 365 | https://admin.microsoft.com |
| Exchange | https://admin.exchange.microsoft.com |
| Entra | https://entra.microsoft.com |
| Intune | https://intune.microsoft.com |
| Defender | https://security.microsoft.com |
| Purview | https://compliance.microsoft.com |
| Teams | https://admin.teams.microsoft.com |
| Azure | https://portal.azure.com |

Exchange also clears `outlook.office.com` and `outlook.office365.com`, because the Exchange admin center reuses those sessions. Intune also clears `endpoint.microsoft.com`. Purview also clears `purview.microsoft.com`.

## Install

This is an unpacked extension. It is not in the Edge Add-ons or Chrome Web Store.

1. Clone this repo, or download it and unzip it, or merely download the pre-packaged "m365-session-switch.zip" file and unzip it.
2. Open `edge://extensions`, `chrome://extensions`, `brave://extensions`, etc.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the folder that contains `manifest.json`. In a clone of this repo, that is the `m365-session-switch` subfolder. If you used the zip, it is the folder you unzipped it into.

After an update, click **Reload** on the extension card. If the icon or name does not change, remove the unpacked extension and load the folder again.

## Use

1. Sign in to the Microsoft 365 accounts you need, as you already do. The Microsoft 365 admin center account switcher is a fine way to add them.
2. Click the extension icon.
3. Click **Choose account** next to the portal you want.
4. A new tab opens and Microsoft prompts you to pick one of the accounts already signed in.

Your other admin tabs are left alone. The next time you want a different account in that portal, click **Choose account** again.

## How it works

Each admin center keeps its own session cookies and site storage, separate from the Microsoft sign-in cookies. Clicking a portal:

1. Removes cookies for that portal's hosts only.
2. Clears that origin's local storage, IndexedDB, cache storage, service workers, and cache.
3. Opens the portal URL in a new tab.

Because the Microsoft login session is still there, the portal asks you to choose an account instead of making you sign in from scratch.

## What it does not do

- It does not store passwords, tokens, or copied session cookies.
- It does not switch accounts inside a portal that is already open. Open a fresh tab from the extension.
- It does not add Microsoft's account switcher to portals that do not have one.
- It cannot keep two accounts active in the same portal at the same time in one browser profile. Use a second click when you need the other account.

## Privacy

Nothing leaves the browser. Account data is not collected, synced, or sent to a server. The extension only deletes site data for the portal you click, on your machine.

Permissions:

- `cookies` and `browsingData` clear the selected portal's session.
- `tabs` opens the portal in a new tab.
- `storage` is reserved for extension state.
- Host access is limited to Microsoft, Office, and Azure admin domains.

## Requirements

- Microsoft Edge, Google Chrome, Brave, or another Chromium browser (Manifest V3)
- The accounts you want to pick must already be signed in to Microsoft in that browser profile

## License

MIT
