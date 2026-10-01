const list = document.querySelector("#list");
const status = document.querySelector("#status");

function setStatus(text) {
  status.textContent = text;
}

async function openPortal(name, button) {
  button.disabled = true;
  setStatus(`Opening ${name} so you can choose an account…`);
  try {
    const response = await chrome.runtime.sendMessage({ type: "open", name });
    if (!response?.ok) {
      setStatus(response?.error || "Could not open that portal.");
      button.disabled = false;
      return;
    }
    setStatus(`${name} opened in a new tab.`);
    button.disabled = false;
  } catch (err) {
    setStatus(err.message);
    button.disabled = false;
  }
}

async function load() {
  const response = await chrome.runtime.sendMessage({ type: "portals" });
  list.replaceChildren();
  for (const portal of response.portals) {
    const item = document.createElement("li");
    const copy = document.createElement("div");
    const title = document.createElement("div");
    title.className = "name";
    title.textContent = portal.name;
    const detail = document.createElement("div");
    detail.className = "detail";
    detail.textContent = portal.detail;
    copy.append(title, detail);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Choose account";
    button.addEventListener("click", () => openPortal(portal.name, button));
    item.append(copy, button);
    list.append(item);
  }
}

load().catch((err) => setStatus(err.message));
