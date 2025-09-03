import { TableauEventType, FilterUpdateType, TableauAuthoringViz } 
  from "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js";

const vizList = [
  "https://prod-apsoutheast-c.online.tableau.com/t/suplosite/views/ExampleWorkbook/SalesDashboard",
  "https://prod-apsoutheast-c.online.tableau.com/t/suplosite/views/ExampleWorkbook/PurchaseDashboard",
  "https://prod-apsoutheast-c.online.tableau.com/t/suplosite/views/ExampleWorkbook/Dashboard3"
];

const titles = [
  "Restaurant Analytics - Sales Overview",
  "Restaurant Analytics - Purchase Control",
  "Restaurant Analytics - Loss Detection",
  "Restaurant Analytics - Custom Viz"
];

let vizEl = null;
let workbook = null;
let currentIndex = 0;

/** Helper: loop semua worksheet */
async function forEachWorksheet(cb) {
  if (!workbook) return;
  const sheet = workbook.activeSheet;
  const worksheets = sheet.worksheets ? sheet.worksheets : [sheet];
  for (const ws of worksheets) {
    await cb(ws);
  }
}

/** Parameter: Tahun */
async function setYearParameterFromUI() {
  if (!workbook) return;
  try {
    const sel = document.getElementById("year");
    const raw = sel.value;
    const value = isNaN(Number(raw)) ? raw : Number(raw);
    await workbook.changeParameterValueAsync("Tahun Hari Ini", value);
    console.log("Parameter Tahun Hari Ini ->", value);
  } catch (err) {
    console.error("Error updating parameter:", err);
  }
}

/** Filter: Cabang */
async function setBranchFilterFromUI() {
  if (!workbook) return;
  try {
    const cabang = document.getElementById("branch").value;
    const isAll = cabang === "" || cabang === "All";

    await forEachWorksheet(async (ws) => {
      try {
        if (isAll) {
          await ws.clearFilterAsync("Branch");
        } else {
          await ws.applyFilterAsync("Branch", [cabang], FilterUpdateType.Replace);
        }
      } catch (e) {
        // worksheet tidak punya field Branch
      }
    });

    console.log("Filter Cabang ->", isAll ? "ALL (clear)" : cabang);
  } catch (err) {
    console.error("Error applying branch filter:", err);
  }
}

/** Apply semua filter setelah interactive */
async function applyAllFilters() {
  await setYearParameterFromUI();
  await setBranchFilterFromUI();
}

/** Load viz sesuai index */
function loadViz(index) {
  currentIndex = index;
  document.getElementById("pageTitle").textContent = titles[index];

  // Jika custom viz → gunakan TableauAuthoringViz

  // Default dashboard
  vizEl.src = vizList[index];
}

/** Event FirstInteractive */
function handleFirstInteractive() {
  console.log("Viz is interactive now");
  workbook = vizEl.workbook;
  applyAllFilters();
}

window.onload = function () {
  vizEl = document.getElementById("tableauViz");

  // Event FirstInteractive
  vizEl.addEventListener(TableauEventType.FirstInteractive, handleFirstInteractive);

  // Initial load
  loadViz(0);

  // Listener UI
  document.getElementById("year").addEventListener("change", setYearParameterFromUI);
  document.getElementById("branch").addEventListener("change", setBranchFilterFromUI);

  document.getElementById("DashboardSales").addEventListener("click", () => loadViz(0));
  document.getElementById("DashboardPurchase").addEventListener("click", () => loadViz(1));
  document.getElementById("LossDetection").addEventListener("click", () => loadViz(2));
};