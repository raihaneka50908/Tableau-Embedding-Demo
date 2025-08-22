let viz;
const containerDiv = document.getElementById("vizContainer");
const dashboardTitle = document.getElementById("dashboardTitle");
let x;

// URL Dummy Tableau Public (ganti nanti dengan workbook FMCG Anda)
const urls = {
  Summary:"https://public.tableau.com/views/ListOfSheetTableau/Dashboard6?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
    SalesPerformance: "https://public.tableau.com/views/ListOfSheetTableau/SalesPerformenceVsTarget_?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  Channel: "https://public.tableau.com/views/ListOfSheetTableau/ChannelContribution_?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  Geography: "https://public.tableau.com/views/ListOfSheetTableau/GeographicsSalesDistribution_?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  Product: "https://public.tableau.com/views/ListOfSheetTableau/TopProduct?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link",
  Trend: "https://public.tableau.com/views/ListOfSheetTableau/TrendPenjualanHarian_?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
};

function initViz(sheetName) {
  if (viz) viz.dispose();

  viz = new tableau.Viz(containerDiv, urls[sheetName], {
    hideTabs: true,
    hideToolbar: false,
    onFirstInteractive: function () {
      // Paksa resize setelah render
      const iframe = containerDiv.querySelector("iframe");
      if (iframe) {
        iframe.style.width = "1366px";
        iframe.style.height = "700px";
      }
    }
});
if (sheetName==="Summary"){
    x="Summary";
}
else if (sheetName==="SalesPerformance"){
    x = "Sales Performence";
}
else if (sheetName==="Channel"){
    x="Channel";
}
else if (sheetName==="Geography"){
    x="Geography";
}
else if (sheetName==="Product"){
    x="Product";
}
else if (sheetName==="Trend"){
    x="Trend";
}
  dashboardTitle.innerText = x + " Dashboard";
  window.addEventListener("resize", () => viz.resize());
}

function switchViz(sheetName) {
  initViz(sheetName);
}

// Load default dashboard
initViz("Summary");
