const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { app, BrowserWindow, ipcMain, shell, screen } = require("electron");

const API_BASE = "https://api.mcsrranked.com";
const allowedPath = /^\/(?:leaderboard|phase-leaderboard|record-leaderboard|weekly-race(?:\/\d+)?|matches(?:\/\d+)?|users\/[^/?#]+(?:\/(?:matches|seasons|live|versus\/[^/?#]+(?:\/matches)?))?)(?:\?.*)?$/;
const SPEEDRUN_BASE = "https://www.speedrun.com/api/v1";
const SPEEDRUN_ORIGIN = "https://www.speedrun.com";
const allowedSpeedrunPath = /^\/(?:users(?:\/[a-zA-Z0-9_-]+(?:\/personal-bests)?)?|games\/[a-zA-Z0-9_-]+\/categories|categories\/[a-zA-Z0-9_-]+\/variables)(?:\?.*)?$/;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;
  const window = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    width,
    height,
    minWidth: 640,
    minHeight: 480,
    fullscreen: true,
    show: false,
    backgroundColor: "#101512",
    title: "MCSR Rank",
    icon: path.join(__dirname, "assets", "branding", "app-icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.once("ready-to-show", () => {
    window.setFullScreen(true);
    window.show();
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const target = new URL(url);
      if (target.protocol === "https:") shell.openExternal(target.href);
    } catch {
      // Ignore malformed external URLs.
    }
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (url !== window.webContents.getURL()) event.preventDefault();
  });
  window.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("mcsr:get", async (event, endpoint) => {
  const senderUrl = event.senderFrame?.url || "";
  const senderDocument = senderUrl.split(/[?#]/, 1)[0];
  const trustedDocument = pathToFileURL(path.join(__dirname, "index.html")).href;
  if (senderDocument !== trustedDocument) {
    throw new Error("Origem da solicitação inválida.");
  }
  if (typeof endpoint !== "string" || !allowedPath.test(endpoint)) {
    throw new Error("Endpointo da API inválido.");
  }

  const url = new URL(endpoint, API_BASE);
  if (url.origin !== API_BASE) {
    throw new Error("Origem da API inválida.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("A API do MCSR Ranked retornou uma resposta inválida.");
    }

    if (!response.ok || result?.status !== "success") {
      throw new Error(result?.message || `A API respondeu com HTTP ${response.status}.`);
    }
    if (!Object.hasOwn(result, "data")) {
      throw new Error("A resposta da API não contém dados.");
    }

    return result.data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("A API do MCSR Ranked demorou demais para responder.");
    }
    throw new Error(error.message || "Não foi possível carregar os dados do MCSR Ranked.");
  } finally {
    clearTimeout(timeout);
  }
});

ipcMain.handle("speedrun:get", async (event, endpoint) => {
  const senderUrl = event.senderFrame?.url || "";
  const senderDocument = senderUrl.split(/[?#]/, 1)[0];
  const trustedDocument = pathToFileURL(path.join(__dirname, "index.html")).href;
  if (senderDocument !== trustedDocument) throw new Error("Origem da solicitaÃ§Ã£o invÃ¡lida.");
  if (typeof endpoint !== "string" || !allowedSpeedrunPath.test(endpoint)) {
    throw new Error("Endpoint do Speedrun.com invÃ¡lido.");
  }

  const url = new URL(endpoint.replace(/^\//, ""), `${SPEEDRUN_BASE}/`);
  if (url.origin !== SPEEDRUN_ORIGIN) throw new Error("Invalid Speedrun.com origin.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "MCSR-Rank-Desktop/1.0" },
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || !Array.isArray(result?.data)) {
      throw new Error(result?.message || `O Speedrun.com respondeu com HTTP ${response.status}.`);
    }
    return result.data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("O Speedrun.com demorou demais para responder.");
    throw new Error(error.message || "NÃ£o foi possÃ­vel carregar os PBs do Speedrun.com.");
  } finally {
    clearTimeout(timeout);
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
