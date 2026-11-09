import { useState } from "react";
import { motion } from "framer-motion";
import { ZERO, people, sites, work, vendors } from "./data";
import { Bars, Btn, Card, Count, Donut, Field, Gauge, Head, I, Icon, Line, MiniCal, Pill, Seg, Stagger, Stat, Table } from "./ui";

const P = (i) => people[i % people.length];
const S = (i) => sites[i % sites.length];
const W = (i) => work[i % work.length];
const date = (d) => `Oct ${d}, 2026`;
const link = (t) => <span className="pf-link">{t}</span>;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ------------------------------------------------------------------ */
function Dashboard() {
  return (
    <Stagger className="pf-split">
      <div className="pf-col">
        <Card title="Service Requests" right={<Btn ghost icon="plus">New request</Btn>}>
          <Table
            widths={["24%", "14%", "13%", "9%", "28%", "12%"]}
            cols={["Customer", "Assigned", "SR #", "Status", "Work requested", "Created"]}
            rows={[0, 1, 2, 3, 4].map((i) => [link(S(i)), P(i), `SR-2026-00${41 - i}`, <Pill tone="amber">Open</Pill>, W(i), date(29)])}
          />
        </Card>
        <Card title="Estimates" right={<Btn ghost icon="plus">New estimate</Btn>}>
          <Table
            widths={["26%", "15%", "11%", "11%", "25%", "12%"]}
            cols={["Customer", "Assigned", "Estimate #", "Amount", "Note", "Status"]}
            rows={[5, 6, 7, 8, 9].map((i, r) => [link(S(i)), P(i + 2), `EST-${1080 + r}`, ZERO, W(i + 1), <Pill tone="amber">Pending</Pill>])}
          />
        </Card>
      </div>
      <div className="pf-col pf-aside">
        <Card title="Monthly Goals">
          <Gauge pct={0} label="0% of goal" />
          <div className="pf-kv">
            <span>Achieved</span>
            <b>{ZERO}</b>
            <span>Remaining</span>
            <b>{ZERO}</b>
          </div>
          <p className="pf-muted">2 days left this month</p>
        </Card>
        <Card title="Upcoming Events" right={<Icon name="refresh" size={14} />}>
          <MiniCal dots={[2, 8, 14, 21, 27, 30]} />
        </Card>
      </div>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Crm() {
  return (
    <Stagger className="pf-stack">
      <I className="pf-filters">
        <Field label="Pipeline" value="Sales Pipeline" w={170} />
        <Field label="Sub-pipeline" value="Maintenance" w={150} />
        <span className="pf-field-seg">
          <small>Timeframe</small>
          <Seg items={["Weekly", "Monthly", "Yearly", "Custom"]} active="Yearly" />
        </span>
        <Field label="Year" value="2026" w={110} />
      </I>
      <div className="pf-g4">
        <Stat icon="file" label="Submitted (RFP)" count={48} sub="Goal: 96" progress={50} />
        <Stat icon="receipt" label="Proposed value" value={ZERO} sub={`Goal: ${ZERO}`} progress={0} />
        <Stat icon="checks" label="Won" count={12} sub="Win rate 25%" progress={25} tone="green" />
        <Stat icon="briefcase" label="Revenue won" value={ZERO} sub="Revenue win rate 0%" progress={0} />
      </div>
      <p className="pf-section">1. Proposals &amp; submissions</p>
      <div className="pf-g2">
        <Card title="Opportunities submitted (RFP)" right={<Btn ghost>Goals</Btn>}>
          <Table
            cols={["Pipeline", "Records", "Goal", "%"]}
            rows={[
              ["Maintenance", "48", "96", <Pill tone="amber">50%</Pill>],
              ["Enhancements", "14", "30", <Pill tone="amber">47%</Pill>],
              [<b>Total</b>, <b>62</b>, <b>126</b>, <Pill tone="amber">49%</Pill>],
            ]}
          />
        </Card>
        <Card title="Opportunities by stage" right={<span className="pf-legend"><i /> Actual <i className="lt" /> Goal</span>}>
          <Bars data={[10, 18, 14, 8, 12, 6]} labels={["Prospect", "Lead", "RFP", "Proposed", "Verbal", "Won"]} h={150} />
        </Card>
      </div>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
const TASKS = ["Site walk", "Follow-up call", "Proposal due", "QC visit", "Client meeting", "Send estimate"];

function Activities() {
  const cells = [
    ...[28, 29, 30].map((d) => ({ d, out: true })),
    ...Array.from({ length: 31 }, (_, i) => ({ d: i + 1 })),
    { d: 1, out: true },
  ];
  return (
    <Stagger className="pf-split wide">
      <Card className="pf-cal-card">
        <div className="pf-cal-top">
          <Btn ghost>Today</Btn>
          <b>October 2026</b>
          <Seg items={["Month", "Week", "Day"]} active="Month" />
        </div>
        <div className="pf-month">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <small key={d}>{d}</small>
          ))}
          {cells.map((c, i) => (
            <motion.span
              key={i}
              className={`${c.out ? "out" : ""} ${c.d === 29 && !c.out ? "today" : ""} ${i % 7 > 4 ? "wk" : ""}`}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            >
              <em>{c.d}</em>
              {!c.out && (
                <>
                  <i className={`ev t${i % 3}`}>{TASKS[i % TASKS.length]}</i>
                  {i % 2 === 0 && <i className={`ev t${(i + 1) % 3}`}>{TASKS[(i + 2) % TASKS.length]}</i>}
                  {i % 4 === 1 && <small className="more">+{(i % 5) + 2} more</small>}
                </>
              )}
            </motion.span>
          ))}
        </div>
      </Card>
      <div className="pf-col pf-aside">
        <Card>
          <MiniCal dots={[5, 9, 13, 16, 20, 22, 27, 29]} />
        </Card>
        <Card title="Activity types">
          <div className="pf-checks">
            <span className="on">Tasks</span>
            <span className="on">Events</span>
          </div>
          <h4 className="pf-sub-h">Ownership</h4>
          <div className="pf-radios">
            <span>My activities</span>
            <span className="on">All activities</span>
          </div>
          <h4 className="pf-sub-h">Status</h4>
          <div className="pf-radios">
            <span>Open</span>
            <span>Closed</span>
            <span className="on">All</span>
          </div>
        </Card>
      </div>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
const STAGES = [
  ["Prospect", "#9aa69a", 0],
  ["Lead", "#3a7bd5", 4],
  ["RFP", "#8a5cd6", 3],
  ["Proposed", "#e0a12b", 4],
  ["Verbal approval", "#e07b39", 3],
  ["Closed won", "#2f9e5a", 3],
];

function Pipelines() {
  let k = 0;
  return (
    <Stagger className="pf-pipe">
      <Card className="pf-pipe-side" title="Pipelines">
        <span className="pf-btn">
          <Icon name="plus" size={12} /> Create pipeline
        </span>
        <ul>
          <li className="on">Sales Pipeline</li>
          <li>Enhancements</li>
          <li>Construction</li>
        </ul>
      </Card>
      <div className="pf-pipe-main">
        <I className="pf-pipe-bar">
          <b>Opportunities</b>
          <span className="pf-search">
            <Icon name="search" size={13} /> Search opportunities
          </span>
          <span className="pf-grow" />
          <Field value="Sort: Closing date" />
          <span className="pf-btn">
            <Icon name="plus" size={12} /> Opportunity
          </span>
        </I>
        <div className="pf-kanban">
          {STAGES.map(([name, color, n]) => (
            <I className="pf-lane" key={name} style={{ "--c": color }}>
              <header>
                <b>{name}</b>
                <small>
                  {ZERO} · {n}
                </small>
              </header>
              {n === 0 && <p className="pf-empty">No opportunities</p>}
              {Array.from({ length: n }, () => {
                const i = k++;
                return (
                  <motion.div className="pf-deal" key={i} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -2 }}>
                    <b>{S(i).split(" · ")[1]}</b>
                    <small>{P(i)}</small>
                    <span>
                      <em>{ZERO}</em>
                      <i>{`${10 + (i % 18)}/0${1 + (i % 9)}/2026`}</i>
                      <Pill>{(i * 7) % 40}%</Pill>
                    </span>
                  </motion.div>
                );
              })}
            </I>
          ))}
        </div>
        <I className="pf-subtabs">
          {["Maintenance", "Arbor Care", "Construction", "Water Mgmt", "Plant Health"].map((t, i) => (
            <span key={t} className={i === 0 ? "on" : ""}>
              {t}
            </span>
          ))}
        </I>
      </div>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Scorecard() {
  return (
    <Stagger className="pf-stack">
      <Head title="EarthCo BD Scorecard">
        <Seg items={["Dashboard", "Month Grid", "Spend"]} active="Dashboard" />
      </Head>
      <I className="pf-filters">
        <Btn icon="down">Export backup</Btn>
        <Btn ghost icon="down">Export 2026 as Excel</Btn>
        <Field value="2026" w={90} />
        <Seg items={["Weekly", "Monthly", "Yearly", "Custom"]} active="Weekly" />
        <Field value="Week of Oct 26" w={140} />
        <Field value="Sales Pipeline" w={140} />
      </I>
      <div className="pf-g5">
        <Stat label="Total leads" count={6} sub="Week of Oct 26" progress={30} tone="t1" />
        <Stat label="Proposed amount" value={ZERO} sub="Week of Oct 26" progress={0} tone="t2" />
        <Stat label="This week" value={ZERO} sub="1 lead this week" progress={0} tone="t3" />
        <Stat label="This month" value={ZERO} sub="9 leads this month" progress={0} tone="t4" />
        <Stat label="This year" value={ZERO} sub="45 leads YTD" progress={0} tone="t5" />
      </div>
      <div className="pf-g2 r">
        <Card title="Goals hit per week — October">
          <Bars data={[5, 2, 3, 5, 2]} labels={["Oct 2", "Oct 9", "Oct 16", "Oct 23", "Oct 30"]} h={170} max={6} />
        </Card>
        <Card title="Leads overview">
          <Line points={[1, 6, 3, 2, 4, 2, 1, 3, 3, 1, 0.4, 0.4]} labels={MONTHS} h={170} />
        </Card>
      </div>
      <Card title="Goal attainment (week of Oct 26)">
        {[
          ["Client lunch / coffee", 86],
          ["Office visits", 100],
          ["Marketing events", 34],
        ].map(([label, v]) => (
          <div className="pf-hbar" key={label}>
            <small>{label}</small>
            <span>
              <motion.i initial={{ width: 0 }} animate={{ width: `${v}%` }} transition={{ duration: 1, delay: 0.3 }} />
            </span>
          </div>
        ))}
      </Card>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Estimator() {
  const tasks = [
    ["Mowing", "0.09"],
    ["Edging", "0.05"],
    ["Blowing", "0.61"],
    ["Bed detail", "4.97"],
    ["Slope", "3.48"],
    ["Drive time", "1.50"],
  ];
  const pl = ["Foreman wages", "Laborer wages", "Additional laborer wages", "Payroll burden", "Workers' comp", "Total direct cost", "Gross profit", "Overhead"];
  return (
    <Stagger className="pf-stack">
      <Head title="Maintenance Estimator" sub="Bid from custom target net %">
        <Field value="Demo account · Draft" w={190} />
        <Btn icon="plus">New</Btn>
        <Btn>Save</Btn>
        <Btn ghost icon="down">Export PDF</Btn>
      </Head>
      <div className="pf-g2 eq">
        <div className="pf-col">
          <Card title="Account details">
            <div className="pf-row">
              <Field label="Account name" value="Demo Account" w="50%" />
              <Field label="Estimator" value="Demo Admin" w="50%" />
            </div>
          </Card>
          <Card title="Property size & hours" right={<Btn icon="pin">SiteRecon</Btn>}>
            <div className="pf-row">
              <Field label="Turf (sq ft)" value="4,500" w="33%" />
              <Field label="Shrubs (sq ft)" value="12,000" w="33%" />
              <Field label="Slope (sq ft)" value="8,200" w="33%" />
            </div>
            <div className="pf-row mt">
              <small className="pf-lbl">Site difficulty</small>
              <Seg items={["Normal", "Easy", "Hard"]} active="Normal" />
            </div>
            <Table
              cols={["Task", "Man-hrs / visit"]}
              rows={[...tasks.map(([t, v]) => [t, v]), [<b>Total man-hrs / visit</b>, <b>10.70</b>]]}
            />
          </Card>
        </div>
        <Card title="Pricing output">
          <div className="pf-callout">
            This account — monthly bid (target net <b>15%</b>): <strong>{ZERO}</strong> at 15.0% net
          </div>
          <div className="pf-g3 tight">
            <Stat label="Direct cost / month" value={ZERO} sub="3-man, 5x/week" />
            <Stat label="Per visit (custom bid)" value={ZERO} sub="5x / week" />
            <Stat label="Net profit" value={ZERO} sub="15.0% net margin" tone="green" />
          </div>
          <p className="pf-section sm">Monthly P&amp;L at custom bid</p>
          <div className="pf-pl">
            {pl.map((line, i) => (
              <motion.span key={line} className={i === 5 || i === 6 ? "strong" : ""} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                <em>{line}</em>
                <b>{ZERO}</b>
              </motion.span>
            ))}
            <span className="net">
              <em>Net profit</em>
              <b>{ZERO}</b>
            </span>
          </div>
        </Card>
      </div>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Kpis() {
  return (
    <Stagger className="pf-stack">
      <Head title="KPIs Dashboard">
        <Field label="Year" value="2026" w={80} />
        <Field label="Month" value="October" w={110} />
        <Field label="Regional manager" value="All" w={140} />
        <Btn>Generate</Btn>
      </Head>
      <Card title="Client retention metrics">
        <div className="pf-strip">
          {[
            ["Starting contracts", "120"],
            ["New contracts", "+18", "green"],
            ["Lost contracts", "6", "red"],
            ["Ending contracts", "132"],
            ["Logo retention", "95.0%", "green"],
            ["Lost monthly revenue", ZERO, "red"],
            ["Added monthly revenue", ZERO, "green"],
            ["Net difference", ZERO],
          ].map(([l, v, t]) => (
            <span key={l} className={t}>
              <small>{l}</small>
              <b>{v}</b>
            </span>
          ))}
        </div>
      </Card>
      <div className="pf-g3">
        <Card title="Estimates">
          <div className="pf-kv grid">
            <span>Submitted</span>
            <b>
              <Count to={240} />
            </b>
            <span>Amount submitted</span>
            <b>{ZERO}</b>
            <span>Approved</span>
            <b>
              <Count to={96} />
            </b>
            <span>Close rate</span>
            <b>40.0%</b>
          </div>
        </Card>
        <Card title="Service requests">
          <div className="pf-kv grid">
            <span># of service requests</span>
            <b>
              <Count to={180} />
            </b>
            <span>Avg days to close</span>
            <b>1.4</b>
          </div>
        </Card>
        <Card title="Crew tags">
          <Table cols={["Regional manager", "Amount"]} rows={[[P(0), ZERO], [P(1), ZERO], [<b>Total</b>, <b>{ZERO}</b>]]} />
        </Card>
      </div>
      <div className="pf-g2 r">
        <Card title="Work by type">
          <div className="pf-donut-row">
            <Donut
              size={130}
              center="180"
              sub="jobs"
              parts={[
                { label: "Maintenance", v: 92, color: "#2f9e5a" },
                { label: "Irrigation", v: 40, color: "#3a7bd5" },
                { label: "Enhancement", v: 30, color: "#e0a12b" },
                { label: "Tree care", v: 18, color: "#8a5cd6" },
              ]}
            />
            <ul className="pf-legend-list">
              <li style={{ "--c": "#2f9e5a" }}>Maintenance</li>
              <li style={{ "--c": "#3a7bd5" }}>Irrigation</li>
              <li style={{ "--c": "#e0a12b" }}>Enhancement</li>
              <li style={{ "--c": "#8a5cd6" }}>Tree care</li>
            </ul>
          </div>
        </Card>
        <Card title="Visits completed per month">
          <Line points={[40, 22, 48, 55, 72, 58, 64, 70, 61, 76]} labels={MONTHS.slice(0, 10)} h={140} />
        </Card>
      </div>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Goals() {
  const block = (title, offset) => (
    <div className="pf-goal-row">
      <Card
        title={title}
        right={
          <span className="pf-row">
            <Field value="2026" />
            <Field value="October" />
          </span>
        }
      >
        <Table
          cols={["RM", "Target", "Achieved", "%", "W1", "W2"]}
          rows={[...[0, 1, 2, 3].map((i) => [P(i + offset), ZERO, ZERO, "0", ZERO, ZERO]), [<b>Total</b>, <b>{ZERO}</b>, <b>{ZERO}</b>, <b>0%</b>, ZERO, ZERO]]}
        />
      </Card>
      <Card title="Monthly goals" right={<Pill tone="amber">0.00%</Pill>}>
        <p className="pf-center">Overall (October 2026)</p>
        <Gauge pct={0} label={`Achieved ${ZERO} of ${ZERO}`} tone={offset ? "green" : "gold"} />
      </Card>
      <div className="pf-col">
        <Stat icon="refresh" label="Remaining (October)" value={ZERO} sub="2 days left" progress={0} tone="warn" />
        <Stat icon="receipt" label="Achieved (October)" value={ZERO} sub="Target pending" progress={0} tone="green" />
      </div>
    </div>
  );
  return (
    <Stagger className="pf-stack">
      <Head title="Monthly Goals" />
      {block("RM target tracking", 0)}
      {block("Team records", 4)}
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function TablePage({ title, stats, toolbar, cols, rows, widths, add }) {
  return (
    <Stagger className="pf-stack">
      <Head title={title} />
      <div className="pf-stats-row">{stats}</div>
      <Card>
        <div className="pf-toolbar">
          <span className="pf-search">
            <Icon name="search" size={13} /> Search {title.toLowerCase()}
          </span>
          {toolbar}
          <span className="pf-grow" />
          <Btn ghost icon="down">CSV</Btn>
          <Field value="Descending" w={110} />
          <Btn icon="plus">{add}</Btn>
        </div>
        <Table cols={cols} rows={rows} widths={widths} />
      </Card>
    </Stagger>
  );
}

const dateRange = (
  <>
    <Field label="Start date" value="mm/dd/yyyy" w={120} />
    <Field label="End date" value="10/29/2026" w={120} />
  </>
);

function ServiceRequests() {
  return (
    <TablePage
      title="Service Requests"
      add="Add service request"
      toolbar={dateRange}
      stats={
        <>
          <Stat icon="file" label="Open" count={24} tone="amber big" />
          <Stat icon="checks" label="Closed" count={1280} tone="big" />
        </>
      }
      widths={["12%", "20%", "12%", "8%", "15%", "21%", "12%"]}
      cols={["Request #", "Customer", "Assigned to", "Status", "Location", "Work requested", "Created"]}
      rows={[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [`SR-2026-00${48 - i}`, link(S(i)), P(i), <Pill tone="amber">Open</Pill>, `Zone ${String.fromCharCode(65 + (i % 4))} · North`, W(i), date(29 - (i > 4 ? 1 : 0))])}
    />
  );
}

function Estimates() {
  return (
    <TablePage
      title="Estimates"
      add="Add estimate"
      toolbar={dateRange}
      stats={
        <>
          <Stat icon="calendar" label="Pending" count={68} sub={ZERO} tone="amber" />
          <Stat icon="file" label="Needs PO" count={1} sub={ZERO} tone="blue" />
          <Stat icon="checks" label="Open approved" count={23} sub={ZERO} tone="green" />
          <Stat icon="receipt" label="Ready to invoice" count={7} sub={ZERO} tone="green" />
          <Stat icon="briefcase" label="Closed billed" count={940} sub={ZERO} />
          <Stat icon="trash" label="Rejected" count={112} sub={ZERO} tone="red" />
        </>
      }
      widths={["18%", "13%", "11%", "9%", "8%", "27%", "7%", "7%"]}
      cols={["Customer", "Regional manager", "Date", "Status", "Est. #", "Description of work", "Profit", "Amount"]}
      rows={[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [link(S(i + 3)), P(i + 1), date(28), i === 5 ? <Pill tone="green">Approved</Pill> : <Pill tone="amber">Pending</Pill>, `${2590 - i}`, W(i + 2), "0%", ZERO])}
    />
  );
}

function Punchlist() {
  const actions = (
    <span className="pf-actions">
      <Pill tone="dark">Close all</Pill>
      <Icon name="print" size={14} />
      <Icon name="plus" size={14} />
      <Icon name="edit" size={14} />
      <Icon name="trash" size={14} className="red" />
    </span>
  );
  return (
    <TablePage
      title="Punchlists"
      add="Add punchlist"
      stats={
        <>
          <Stat icon="calendar" label="Open (pending)" count={18} tone="amber big" />
          <Stat icon="checks" label="Closed" count={860} tone="big" />
          <Stat icon="menu" label="Total" count={18} tone="blue big" />
        </>
      }
      widths={["24%", "26%", "14%", "11%", "9%", "16%"]}
      cols={["Customer", "Title", "Regional manager", "Created", "Status", "Actions"]}
      rows={[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => [link(S(i)), `${S(i).split(" · ")[1]} — October walk`, P(i + 3), date(28 - (i > 5 ? 1 : 0)), <Pill tone="amber">Pending</Pill>, actions])}
    />
  );
}

function PurchaseOrders() {
  return (
    <TablePage
      title="Purchase Orders"
      add="Add purchase order"
      toolbar={dateRange}
      stats={
        <>
          <Stat icon="calendar" label="Open" count={42} tone="amber big" />
          <Stat icon="checks" label="Closed billed" count={1530} tone="big" />
        </>
      }
      widths={["20%", "12%", "8%", "15%", "15%", "11%", "10%", "9%"]}
      cols={["Vendor", "Date", "Status", "Regional manager", "Requested by", "PO #", "Estimate #", "Amount"]}
      rows={[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => [vendors[i % vendors.length], date(28), <Pill tone="amber">Open</Pill>, P(i), P(i + 4), `PO-${5240 - i}`, `${2590 - i}`, ZERO])}
    />
  );
}

function Bills() {
  return (
    <TablePage
      title="Bills"
      add="Add bill"
      toolbar={<Btn ghost icon="filter">Advanced filters</Btn>}
      stats={null}
      widths={["15%", "19%", "10%", "11%", "9%", "10%", "8%", "8%", "10%"]}
      cols={["Vendor", "Customer", "Invoice #", "Bill #", "PO #", "Status", "Inv. amount", "Bill amount", "Tags"]}
      rows={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => [
        vendors[i % vendors.length],
        i % 3 ? link(S(i)) : "—",
        i % 2 ? `INV-${1050 + i}` : "—",
        `BL-${7720 + i}`,
        i % 3 ? `PO-${5200 + i}` : "—",
        i % 4 === 1 ? <Pill tone="dark">Closed</Pill> : i % 3 ? <Pill tone="green">Approved</Pill> : <Pill>Draft</Pill>,
        ZERO,
        ZERO,
        <Pill tone="blue">Irrigation</Pill>,
      ])}
    />
  );
}

function Invoices() {
  return (
    <TablePage
      title="Invoices"
      add="Add invoice"
      toolbar={dateRange}
      stats={null}
      widths={["9%", "11%", "26%", "10%", "10%", "14%", "7%", "7%", "6%"]}
      cols={["Invoice", "Issue date", "Customer", "Estimate #", "Bill #", "Status", "Profit", "Balance", "Total"]}
      rows={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => [
        `${110090 - i}`,
        date(28),
        link(S(i + 1)),
        `${22800 + i * 3}`,
        i % 3 ? `BL-${7600 + i}` : "—",
        <span className="pf-due">
          <i /> Due in 30 days
        </span>,
        "0%",
        ZERO,
        ZERO,
      ])}
    />
  );
}

/* ------------------------------------------------------------------ */
function TreeMap() {
  const colors = ["#2f9e5a", "#e0a12b", "#d6455d", "#3a7bd5", "#8a5cd6", "#f2c94c"];
  const rand = (n) => ((Math.sin(n * 12.9898) * 43758.5453) % 1 + 1) % 1;
  const trees = Array.from({ length: 22 }, (_, h) =>
    [0, 1, 2].map((k) => {
      const n = h * 3 + k;
      const hx = 4 + h * 4.3 + 1.5;
      const hy = ((33 + Math.sin(h) * 2) / 62) * 100;
      const above = k !== 1;
      return {
        x: hx + (rand(n) - 0.5) * 4,
        y: above ? hy - 6 - rand(n + 50) * 12 : hy + 9 + rand(n + 90) * 8,
        c: colors[Math.floor(rand(n + 7) * colors.length)],
      };
    })
  ).flat();
  return (
    <Stagger className="pf-stack">
      <Head title="Estimate Tree Map">
        <Field value="Actions" w={110} />
      </Head>
      <Card>
        <div className="pf-toolbar">
          <span className="pf-search">
            <Icon name="search" size={13} /> Search tree
          </span>
          <Seg items={["Map view", "General tree care", "Photo"]} active="Map view" />
          <span className="pf-grow" />
          <span className="pf-meta">
            Project <b>Demo tree inventory</b> · <b>184</b> trees · <b>8.5</b> hours · <b>{ZERO}</b>
          </span>
        </div>
        <div className="pf-map">
          <svg viewBox="0 0 100 62" preserveAspectRatio="none" aria-hidden="true">
            <rect width="100" height="62" className="land" />
            <path className="park" d="M0 0H100V14C70 20 40 10 0 18Z" />
            <path className="park" d="M0 62V48C30 56 60 70 100 54V62Z" />
            <path className="road" d="M-2 12C30 18 60 6 102 14" />
            <path className="road" d="M-2 46C20 40 40 54 62 44S90 40 102 48" />
            <path className="road thin" d="M30 14C32 28 26 40 28 52" />
            <path className="road thin" d="M74 10C70 26 78 40 72 52" />
            {Array.from({ length: 22 }, (_, i) => (
              <rect key={i} className="roof" x={4 + i * 4.3} y={33 + Math.sin(i) * 2} width="3" height="3.6" rx="0.4" />
            ))}
          </svg>
          {trees.map((t, i) => (
            <motion.i
              key={i}
              className="pf-tree"
              style={{ left: `${t.x}%`, top: `${t.y}%`, background: t.c }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.015, type: "spring", stiffness: 380, damping: 18 }}
            />
          ))}
          <span className="pf-map-ctrl">
            <i>+</i>
            <i>−</i>
          </span>
          <span className="pf-map-tag">
            <Icon name="pin" size={12} /> Demo property
          </span>
        </div>
      </Card>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Routes() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const crew = [0, 1, 2, 3];
  return (
    <Stagger className="pf-stack">
      <I className="pf-route-head">
        <div>
          <small>Maintenance division · Route scheduler</small>
          <h2>North Branch</h2>
          <em>18 routes · 42 crew · 95 visits/week</em>
        </div>
        <div className="pf-right">
          <small>Branch monthly revenue</small>
          <strong>{ZERO}</strong>
        </div>
      </I>
      <I className="pf-chips">
        <small>Regional manager:</small>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={i === 0 ? "on" : ""}>
            {P(i).split(" ")[0]} <b>{ZERO}</b>
          </span>
        ))}
        <span className="add">+ Add branch</span>
      </I>
      <I className="pf-toolbar">
        <Seg items={["Schedule", "Branch revenue", "Company rollup", "Crew list"]} active="Schedule" />
        <span className="pf-grow" />
        <b className="pf-week">Oct 26 – Oct 30, 2026</b>
        <Btn>Copy from…</Btn>
        <Btn ghost icon="print">Print branch</Btn>
      </I>
      <Card className="pf-route">
        <div className="pf-route-grid">
          <small>Foreman / route</small>
          {days.map((d) => (
            <small key={d}>{d}</small>
          ))}
          <small className="r">Mo · labor</small>
          {crew.map((c) => (
            <div className="pf-route-row" key={c}>
              <span className="who">
                <b>{P(c + 2)}</b>
                <small>
                  A{c + 1} · Truck {1200 + c * 7}
                </small>
              </span>
              {days.map((d, j) => (
                <motion.span key={d} className="job" variants={{ hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } }}>
                  <b>{S(c * 2 + (j % 2)).split(" · ")[1]}</b>
                  <em>{ZERO}/mo</em>
                </motion.span>
              ))}
              <span className="tot">
                <b>{ZERO}</b>
                <small>0% labor</small>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function Fleet() {
  const status = [
    ["On the road", "road"],
    ["On the road", "road"],
    ["In shop", "shop"],
    ["On the road", "road"],
    ["On the road", "road"],
    ["Out of service", "oos"],
    ["On the road", "road"],
  ];
  const makes = ["2022 Ford F-150", "2021 Ford F-250", "2024 Isuzu NPR", "2020 Ford Transit", "2023 Ford F-350", "2019 Ford F-150", "2025 Toyota Tacoma"];
  return (
    <Stagger className="pf-stack">
      <Head title="Fleet Dashboard" />
      <div className="pf-fleet-top">
        <Card title="Utilization" className="pf-util">
          <b className="pf-big">
            <Count to={96} suffix="%" />
          </b>
          <Line points={[60, 62, 61, 63, 64, 62, 66, 70, 74, 80, 88, 96]} h={70} />
        </Card>
        <Card title="Fleet by status">
          <div className="pf-donut-row">
            <Donut
              size={104}
              center="48"
              sub="fleet"
              parts={[
                { label: "On road", v: 44, color: "#5b7a1e" },
                { label: "In shop", v: 3, color: "#e0a12b" },
                { label: "OOS", v: 1, color: "#d6455d" },
              ]}
            />
            <ul className="pf-legend-list">
              <li style={{ "--c": "#5b7a1e" }}>On road · 44</li>
              <li style={{ "--c": "#e0a12b" }}>In shop · 3</li>
              <li style={{ "--c": "#d6455d" }}>OOS · 1</li>
            </ul>
          </div>
        </Card>
        <div className="pf-g4 mini">
          <Stat label="Fleet size" count={48} sub="Active trucks" />
          <Stat label="On the road" count={44} sub="92% utilization" tone="green" />
          <Stat label="In shop" count={3} sub="Avg 4 days" tone="amber" />
          <Stat label="Out of service" count={1} sub="Recently down" tone="red" />
          <Stat label="MTD spend" value={ZERO} sub="0% of budget" />
          <Stat label="Open WOs" count={6} sub="On track" />
          <Stat label="PMs this week" count={0} sub="None overdue" />
          <Stat label="Avg health" count={86} sub="Fleet score" tone="green" />
        </div>
      </div>
      <Card title="Fleet status" right={<span className="pf-chips sm"><span className="on">All 48</span><span>On the road 44</span><span>In shop 3</span><span>Out of service 1</span></span>}>
        <Table
          widths={["9%", "19%", "17%", "15%", "13%", "17%", "10%"]}
          cols={["Truck", "Year / make", "Driver", "RM", "Status", "Health", "MTD cost"]}
          rows={status.map(([s, t], i) => [
            <span className="pf-link">#{1700 + i * 13}</span>,
            makes[i],
            i === 2 ? "—" : P(i + 1),
            P(i + 5),
            <Pill tone={t}>{s}</Pill>,
            <span className="pf-health">
              <motion.i initial={{ width: 0 }} animate={{ width: `${80 + ((i * 7) % 20)}%` }} transition={{ duration: 0.9, delay: 0.3 }} />
              <b>{80 + ((i * 7) % 20)}</b>
            </span>,
            ZERO,
          ])}
        />
      </Card>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function PmScheduler() {
  const [tab, setTab] = useState("Calendar");
  const cells = [...Array(4).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  const svc = ["Oil change", "Tire rotation", "Brake inspection", "Air filter", "Annual inspection"];
  return (
    <Stagger className="pf-stack">
      <Head title="PM Scheduler" />
      <div className="pf-g4">
        <Stat label="Overdue" count={0} sub="Needs immediate attention" tone="edge red" />
        <Stat label="Due this week" count={0} sub="Within 7 days or 500 mi" tone="edge amber" />
        <Stat label="Due this month" count={0} sub="Within 30 days or 2k mi" tone="edge green" />
        <Stat label="Trucks current" count={48} sub="All PMs up to date" tone="edge dark" />
      </div>
      <Card
        right={
          <span className="pf-seg click">
            {["Due / Overdue", "Calendar", "Intervals", "Recurring"].map((t) => (
              <button key={t} type="button" className={t === tab ? "on" : ""} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </span>
        }
        title={tab === "Intervals" ? "Service intervals by truck class" : "October 2026"}
      >
        {tab === "Intervals" ? (
          <div className="pf-g3">
            {["Class A — Light duty", "Class B — Heavy duty", "Class C — Work trucks"].map((cls, c) => (
              <div key={cls} className="pf-interval">
                <b>{cls}</b>
                {svc.map((s, i) => (
                  <span key={s}>
                    <em>{s}</em>
                    <i>{(5000 + i * 2500 + c * 1000).toLocaleString()} mi</i>
                    <i>{[90, 180, 365, 365, 365][i]} d</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="pf-month sun">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <small key={d}>{d}</small>
            ))}
            {cells.map((d, i) => (
              <motion.span key={i} className={!d ? "out" : ""} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                <em>{d}</em>
                {d && d % 3 !== 0 && (
                  <>
                    <i className="ev pm">
                      #T-{100 + d} {svc[d % svc.length]}
                    </i>
                    {d % 2 === 0 && <i className="ev pm">#T-{140 + d} Tire rotation</i>}
                  </>
                )}
              </motion.span>
            ))}
          </div>
        )}
      </Card>
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
function JobCalendar() {
  const days = ["T 1", "F 2", "S 3", "S 4", "M 5", "T 6", "W 7", "T 8", "F 9", "S 10"];
  const rows = [
    { who: P(0), bars: [[0, 1], [4, 5], [4, 5], [5, 4], [4, 4]] },
    { who: P(3), bars: [[0, 1], [4, 5], [4, 2]] },
    { who: P(5), bars: [[0, 2], [4, 3], [0, 2]] },
  ];
  let k = 0;
  return (
    <Stagger className="pf-stack">
      <Head title="Job Calendar">
        <Btn icon="calendar">Job calendar</Btn>
        <Btn ghost>EAC schedule</Btn>
        <Btn>Schedule</Btn>
        <Field value="Month" w={80} />
        <Field value="October 2026" w={120} />
      </Head>
      <I className="pf-row">
        <Field label="Regional manager" value="Choose…" w={220} />
        <Field label="Foreman" value="Choose…" w={220} />
      </I>
      <Card className="pf-gantt">
        <div className="pf-gantt-head">
          <small>Foreman</small>
          {days.map((d, i) => (
            <small key={d} className={i === 2 || i === 3 || i === 9 ? "wk" : ""}>
              {d}
            </small>
          ))}
        </div>
        {rows.map((row) => (
          <div className="pf-gantt-row" key={row.who}>
            <span className="who">{row.who}</span>
            <div className="lane">
              {days.map((d, i) => (
                <i key={d} className={i === 2 || i === 3 || i === 9 ? "wk" : ""} />
              ))}
              {row.bars.map(([s, len], j) => {
                const i = k++;
                return (
                  <motion.span
                    key={j}
                    className="bar"
                    style={{ left: `${s * 10}%`, width: `${len * 10}%`, top: 8 + j * 30 }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <b>{S(i).split(" · ")[1]}</b>
                    <em>
                      {ZERO} · #{11800 + i}
                    </em>
                  </motion.span>
                );
              })}
            </div>
          </div>
        ))}
      </Card>
    </Stagger>
  );
}

export const SCREENS = {
  dashboard: Dashboard,
  crm: Crm,
  activities: Activities,
  pipelines: Pipelines,
  scorecard: Scorecard,
  estimator: Estimator,
  kpis: Kpis,
  goals: Goals,
  sr: ServiceRequests,
  estimates: Estimates,
  treemap: TreeMap,
  punchlist: Punchlist,
  po: PurchaseOrders,
  routes: Routes,
  bills: Bills,
  invoices: Invoices,
  fleet: Fleet,
  pm: PmScheduler,
  jobcal: JobCalendar,
};
