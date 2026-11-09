/*
 * Dummy content for the platform showcase. Layouts follow the real EarthCo
 * screens, but every name, address and identifier here is made up and every
 * money value is zero. Do not paste real customer data into this file.
 */

export const ZERO = "$0.00";

export const people = ["Alex Morgan", "Jordan Lee", "Sam Patel", "Taylor Brooks", "Riley Chen", "Casey Diaz", "Morgan Reyes", "Drew Collins"];

export const sites = [
  "OC-101 · Oak Ridge Commons",
  "OC-102 · Willow Creek HOA",
  "OC-103 · Maple Grove Plaza",
  "OC-104 · Cedar Point Villas",
  "OC-105 · Pinecrest Park",
  "OC-106 · Lakeside Terrace",
  "OC-107 · Sunset Gardens",
  "OC-108 · Birchwood Estates",
  "OC-109 · Aspen Meadows",
  "OC-110 · Riverbend Court",
];

export const work = [
  "Replace broken drip line along the front planter bed",
  "Install seasonal color at the main entry",
  "Fertilize turf and apply pre-emergent",
  "Adjust controller schedule for zone 4",
  "Trim hedges along the north walkway",
  "Remove dead shrub near the visitor parking",
];

export const vendors = ["Green Supply Co.", "Valley Nursery", "Pro Irrigation Parts", "Summit Stone & Mulch"];

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  {
    label: "CRM",
    icon: "users",
    children: [
      ["crm", "CRM Dashboard"],
      ["activities", "Activities"],
      ["pipelines", "Pipelines"],
      ["scorecard", "BD Scorecard"],
      ["estimator", "Maint. Estimator"],
    ],
  },
  { id: "kpis", label: "KPIs", icon: "briefcase" },
  { id: "sr", label: "Service Requests", icon: "wrench" },
  { label: "Estimates", icon: "file", children: [["estimates", "Estimates"], ["treemap", "Tree Map"]] },
  { id: "punchlist", label: "Punchlist", icon: "checks" },
  { id: "po", label: "Purchase Order", icon: "cart" },
  { id: "routes", label: "Route Scheduler", icon: "route" },
  { id: "bills", label: "Bills", icon: "store" },
  { id: "invoices", label: "Invoices", icon: "receipt" },
  { label: "Fleet & Equipment", icon: "truck", children: [["fleet", "Fleet Dashboard"], ["pm", "PM Scheduler"]] },
  { id: "jobcal", label: "Job Calendar", icon: "hardhat" },
];

export const ORDER = NAV.flatMap((item) => (item.children ? item.children.map(([id]) => id) : [item.id]));

export const TITLES = Object.fromEntries(
  NAV.flatMap((item) => (item.children ? item.children.map(([id, label]) => [id, label]) : [[item.id, item.label]]))
);

export const groupOf = (id) => NAV.find((item) => item.children?.some(([cid]) => cid === id))?.label || null;
