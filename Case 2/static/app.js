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

/** Helper: loop semua worksheet (jika perlu nanti) */
async function forEachWorksheet(cb) {
  if (!vizEl || !vizEl.workbook) return;
  const sheet = vizEl.workbook.activeSheet;
  const worksheets = sheet.worksheets ? sheet.worksheets : [sheet];
  for (const ws of worksheets) {
    await cb(ws);
  }
}

/**
 * Helper umum: set parameter dengan memperhatikan tipe data / alias
 */
async function setParameterFromUI(paramName, selectId) {
  if (!vizEl || !vizEl.workbook) return;
  const sel = document.getElementById(selectId);
  const raw = sel.value; // selalu string dari <select>

  try {
    // ambil metadata parameter
    const params = await vizEl.workbook.getParametersAsync();
    const param = params.find(p => p.name === paramName);

    let newValue;

    if (param) {
      const domain = param.allowableValues;
      const list = domain && Array.isArray(domain.allowableValues) ? domain.allowableValues : null;

      if (list) {
        // cari kecocokan di daftar allowableValues
        const match = list.find(v => {
          return String(v.nativeValue) === raw
              || String(v.value) === raw
              || v.aliasValue === raw
              || String(v.formattedValue) === raw;
        });

        if (match) {
          newValue = match.hasAlias ? match.aliasValue : match.nativeValue;
        } else {
          // fallback: lihat tipe currentValue
          const cv = param.currentValue;
          if (cv && typeof cv.nativeValue === "number") {
            const n = parseInt(raw, 10);
            newValue = isNaN(n) ? raw : n;
          } else {
            newValue = raw;
          }
        }
      } else {
        // bukan list, bisa range / unconstrained
        const cv = param.currentValue;
        if (cv && typeof cv.nativeValue === "number") {
          const n = parseInt(raw, 10);
          newValue = isNaN(n) ? raw : n;
        } else {
          newValue = raw;
        }
      }
    } else {
      // parameter tidak ditemukan
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
function loadViz(index) {
  currentIndex = index;
  document.getElementById("pageTitle").textContent = titles[index];
  vizEl.src = vizList[index];
}

/** Event FirstInteractive */
function handleFirstInteractive() {
  console.log("Viz is interactive now");
  applyAllFilters();

  // debug: tampilkan metadata parameter di console
  vizEl.workbook.getParametersAsync().then(params => {
    console.log("All Parameters:", params);
  });
}

window.onload = function () {
  vizEl = document.getElementById("tableauViz");

  // Event FirstInteractive
  vizEl.addEventListener(TableauEventType.FirstInteractive, handleFirstInteractive);

  // Initial load
  loadViz(0);

  // Listener UI
  document.getElementById("year").addEventListener("change", setYearParameterFromUI);
  document.getElementById("month").addEventListener("change", setMonthParameterFromUI);

  document.getElementById("DashboardSales").addEventListener("click", () => loadViz(0));
  document.getElementById("DashboardPurchase").addEventListener("click", () => loadViz(1));
};
