import { TableauEventType } 
  from "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js";

const vizList = [
  "https://prod-apsoutheast-c.online.tableau.com/t/suplosite/views/DemoDashboard3/Dashboard",
  "https://prod-apsoutheast-c.online.tableau.com/t/suplosite/views/DemoDashboard3/Purchasing",
];

const titles = [
  "Restaurant Analytics - Sales Overview",
  "Restaurant Analytics - Purchase Overview",
];

let vizEl = null;
let currentIndex = 0;

/** 🔹 Ambil token dari token.json */
async function loadToken() {
  try {
    const res = await fetch("/static/token.json?_=" + new Date().getTime()); // cache buster
    if (!res.ok) throw new Error("Gagal ambil token.json");
    const data = await res.json();
    return data.token;
  } catch (err) {
    console.error("Error loadToken:", err);
    return null;
  }
}

/** 🔹 Update token di tableau-viz */
async function refreshToken() {
  const token = await loadToken();
  if (!token) return;
  if (vizEl) {
    vizEl.setAttribute("token", token);
    console.log("Token diperbarui:", new Date().toLocaleTimeString());
  }
}

/** Helper: loop semua worksheet (jika perlu nanti) */
async function forEachWorksheet(cb) {
  if (!vizEl || !vizEl.workbook) return;
  const sheet = vizEl.workbook.activeSheet;
  const worksheets = sheet.worksheets ? sheet.worksheets : [sheet];
  for (const ws of worksheets) {
    await cb(ws);
  }
}

/** Helper umum: set parameter dengan memperhatikan tipe data / alias */
async function setParameterFromUI(paramName, selectId) {
  if (!vizEl || !vizEl.workbook) return;
  const sel = document.getElementById(selectId);
  const raw = sel.value; // selalu string dari <select>

  try {
    const params = await vizEl.workbook.getParametersAsync();
    const param = params.find(p => p.name === paramName);

    let newValue;

    if (param) {
      const domain = param.allowableValues;
      const list = domain && Array.isArray(domain.allowableValues) ? domain.allowableValues : null;

      if (list) {
        const match = list.find(v => {
          return String(v.nativeValue) === raw
              || String(v.value) === raw
              || v.aliasValue === raw
              || String(v.formattedValue) === raw;
        });

        if (match) {
          newValue = match.hasAlias ? match.aliasValue : match.nativeValue;
        } else {
          const cv = param.currentValue;
          if (cv && typeof cv.nativeValue === "number") {
            const n = parseInt(raw, 10);
            newValue = isNaN(n) ? raw : n;
          } else {
            newValue = raw;
          }
        }
      } else {
        const cv = param.currentValue;
        if (cv && typeof cv.nativeValue === "number") {
          const n = parseInt(raw, 10);
          newValue = isNaN(n) ? raw : n;
        } else {
          newValue = raw;
        }
      }
    } else {
      const n = parseInt(raw, 10);
      newValue = isNaN(n) ? raw : n;
    }

    await vizEl.workbook.changeParameterValueAsync(paramName, newValue);
    console.log(`Parameter ${paramName} di-set ->`, newValue);
  } catch (err) {
    console.error(`Error updating parameter ${paramName}:`, err);
  }
}

/** Parameter Tahun */
async function setYearParameterFromUI() {
  await setParameterFromUI("New Year", "year");
}

/** Parameter Bulan */
async function setMonthParameterFromUI() {
  await setParameterFromUI("New Month", "month");
}

/** Apply semua filter setelah viz siap */
async function applyAllFilters() {
  await setYearParameterFromUI();
  await setMonthParameterFromUI();
}

/** Load viz sesuai index */
async function loadViz(index) {
  currentIndex = index;
  document.getElementById("pageTitle").textContent = titles[index];

  const token = await loadToken();
  if (!token) {
    console.error("Token tidak ada, viz gagal dimuat");
    return;
  }

  vizEl.src = vizList[index];
  vizEl.setAttribute("token", token);
}

/** Event FirstInteractive */
function handleFirstInteractive() {
  console.log("Viz is interactive now");
  applyAllFilters();

  vizEl.workbook.getParametersAsync().then(params => {
    console.log("All Parameters:", params);
  });
}

/** Init halaman */
window.onload = async function () {
  vizEl = document.getElementById("tableauViz");

  // Event FirstInteractive
  vizEl.addEventListener(TableauEventType.FirstInteractive, handleFirstInteractive);

  // Initial load
  await loadViz(0);

  // Listener UI
  document.getElementById("year").addEventListener("change", setYearParameterFromUI);
  document.getElementById("month").addEventListener("change", setMonthParameterFromUI);

  document.getElementById("DashboardSales").addEventListener("click", () => loadViz(0));
  document.getElementById("DashboardPurchase").addEventListener("click", () => loadViz(1));

  // Auto refresh token tiap 8 menit
  setInterval(refreshToken, 480 * 1000);
};
