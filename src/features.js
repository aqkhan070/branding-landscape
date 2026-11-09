import { modules } from "./data";

const find = (name) => modules.find((m) => m.name === name);

/**
 * Feature groups for the interactive features section.
 * `shot` is the VIP module image id (same files as the laptop platform).
 */
export const features = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "The day starts in one place.",
    body: find("Dashboard").summary,
    modules: ["Dashboard", "Notifications", "Global search"],
    shot: "dashboard",
  },
  {
    id: "crm",
    label: "CRM",
    title: "Know every opportunity before the site walk.",
    body: find("Pipelines").summary,
    modules: ["CRM Dashboard", "Pipelines", "Activities", "BD Scorecard", "Maint. Estimator"],
    shot: "crm",
  },
  {
    id: "reporting",
    label: "Reporting",
    title: "A soft month shows up before the books close.",
    body: find("Aging report").summary + " " + find("KPIs").summary,
    modules: ["KPIs", "Invoices", "Bills"],
    shot: "kpis",
  },
  {
    id: "estimates",
    label: "Estimates",
    title: "Price it on the property, send it as a PDF.",
    body: find("Estimates").summary,
    modules: ["Estimates", "Tree map", "Maintenance Estimator"],
    shot: "estimates",
  },
  {
    id: "workorders",
    label: "Work orders",
    title: "A breakdown becomes a work order, not a text.",
    body: find("Work orders").summary,
    modules: ["Service requests", "Punch list", "Purchase Order"],
    shot: "punchlist",
  },
  {
    id: "fleet",
    label: "Fleet management",
    title: "The yard is inside the same system.",
    body: find("Trucks").summary,
    modules: ["Fleet dashboard", "PM scheduler", "Purchase Order"],
    shot: "fleet",
  },
  {
    id: "scheduling",
    label: "Job scheduling",
    title: "A day on the calendar is a crew on site.",
    body: find("Route scheduler").summary + " " + find("Job calendar").next,
    modules: ["Job calendar", "Route scheduler", "Service requests"],
    shot: "jobcal",
  },
];

export const story = [
  {
    src: "/photos/aerial.jpg",
    alt: "Aerial view of a commercial campus landscape",
    tag: "Office",
    line: "The office and the crew are looking at the same ground.",
  },
  {
    src: "/photos/crew.jpg",
    alt: "A landscape crew working a commercial planting bed",
    tag: "Crew",
    line: "The visit closes where the work happened.",
  },
  {
    src: "/photos/irrigation.jpg",
    alt: "Irrigated commercial shrub bed",
    tag: "Irrigation",
    line: "Irrigation stays on the property record.",
  },
  {
    src: "/photos/yard.jpg",
    alt: "Landscape trucks in a yard at dawn",
    tag: "Fleet",
    line: "Fleet is in the same system.",
  },
];
