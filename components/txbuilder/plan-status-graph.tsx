// State graphs for the statuses of a plan and of its steps.
// Hand-written SVG: colors come from the fumadocs theme classes and currentColor,
// so the graphs read in light and dark mode.

type Kind = "call" | "chain";

const STEP_ARROW = "psg-step-arrow";
const PLAN_ARROW = "psg-plan-arrow";

const BOX_W = 88;
const BOX_H = 36;
const GAP = 4; // distance between the two borders of a terminal status

function Arrowhead({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="10"
      markerHeight="10"
      markerUnits="userSpaceOnUse"
      orient="auto"
    >
      <path d="M0 0.5 L10 5 L0 9.5 z" fill="currentColor" />
    </marker>
  );
}

function Status({
  cx,
  cy,
  label,
  terminal = false,
  w = BOX_W,
}: {
  cx: number;
  cy: number;
  label: string;
  terminal?: boolean;
  w?: number;
}) {
  const x = cx - w / 2;
  const y = cy - BOX_H / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={BOX_H}
        rx={8}
        strokeWidth={1.5}
        className="fill-fd-card stroke-fd-muted-foreground"
      />
      {terminal && (
        <rect
          x={x - GAP}
          y={y - GAP}
          width={w + 2 * GAP}
          height={BOX_H + 2 * GAP}
          rx={8 + GAP}
          strokeWidth={1.5}
          className="fill-none stroke-fd-muted-foreground"
        />
      )}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        className="fill-fd-foreground font-mono"
      >
        {label}
      </text>
    </g>
  );
}

function Edge({
  d,
  kind,
  marker,
  main = false,
}: {
  d: string;
  kind: Kind;
  marker: string;
  main?: boolean; // the usual path: a heavier line
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={main ? 2.25 : 1.5}
      strokeDasharray={kind === "chain" ? "6 4" : undefined}
      markerEnd={`url(#${marker})`}
    />
  );
}

function Label({
  x,
  y,
  lines,
  kind,
  anchor = "middle",
}: {
  x: number;
  y: number;
  lines: string[];
  kind: Kind;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={13}
      className={kind === "call" ? "fill-fd-foreground font-mono" : "fill-fd-foreground italic"}
    >
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 15}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Start({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={5} fill="currentColor" />;
}

function Legend({
  x,
  y,
  marker,
  vertical = false,
}: {
  x: number;
  y: number;
  marker: string;
  vertical?: boolean;
}) {
  // Horizontal: three items in a row. Vertical: three rows, 26 apart.
  const at = (dx: number) => (vertical ? x : x + dx);
  const row = (i: number) => (vertical ? y + i * 26 : y);
  return (
    <g className="fill-fd-foreground/70" fontSize={13}>
      <Edge d={`M ${at(0)} ${row(0)} h 40`} kind="call" marker={marker} />
      <text x={at(0) + 52} y={row(0)} dominantBaseline="central">
        a call
      </text>
      <Edge d={`M ${at(120)} ${row(1)} h 40`} kind="chain" marker={marker} />
      <text x={at(120) + 52} y={row(1)} dominantBaseline="central">
        what the chain shows
      </text>
      <rect
        x={at(340) + 3}
        y={row(2) - 9}
        width={34}
        height={18}
        rx={5}
        strokeWidth={1.5}
        className="fill-fd-card stroke-fd-muted-foreground"
      />
      <rect
        x={at(340) - 1}
        y={row(2) - 13}
        width={42}
        height={26}
        rx={8}
        strokeWidth={1.5}
        className="fill-none stroke-fd-muted-foreground"
      />
      <text x={at(340) + 52} y={row(2)} dominantBaseline="central">
        never changes
      </text>
    </g>
  );
}

function Frame({
  children,
  label,
  note,
}: {
  children: React.ReactNode;
  label: string;
  note: string;
}) {
  // The svg keeps a 760px minimum so its text stays legible; the hint shows
  // only when the column is narrower than that and the box scrolls.
  return (
    <div className="not-prose my-6 @container">
      <div
        className="overflow-x-auto rounded-lg border border-fd-border focus-visible:outline-2 focus-visible:outline-fd-ring"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        {children}
      </div>
      <p className="mt-1 hidden text-xs text-fd-muted-foreground @max-[761px]:block">
        Scroll sideways to see the whole graph.
      </p>
      <p className="mt-2 text-sm text-fd-muted-foreground">{note}</p>
    </div>
  );
}

export function StepStatusGraph() {
  // Main row: built, signed, sent, included, final.
  const row = 150;
  const x = { built: 76, signed: 264, sent: 452, included: 640, final: 840 };
  const half = BOX_W / 2;
  // Dead statuses row.
  const dead = 290;
  const d = { orphaned: 170, expired: 310, failed: 452 };

  return (
    <Frame
      label="Status graph of a step, scrolls sideways"
      note="Not drawn: a built, signed or rejected step found in a block (sent by another party, or refused by a node that lagged) goes straight to included, final or failed, and a step found already deep goes straight to final; a step can start as signed, or as included when replan takes it over; a built, signed, sent or rejected step can expire or be orphaned, and so can an included one that the same look finds rolled back; an expired or orphaned step found in a block goes to included or final; once no step it stands on will not land, an orphaned step is sent if it was ever sent or found in a block, else signed or built, and the same look may then find it in a block or past its end."
    >
      <svg
        viewBox="0 0 900 364"
        role="img"
        aria-label="Statuses of a step: built, signed, sent, rejected, included, final, expired, failed and orphaned. The usual path is built, signed, sent, included, final. A sent step can be rejected and sent again, rolled back from included to sent, expire past its validity and margin, or fail in a block with a failed script. A built or signed step can be orphaned. Solid arrows are calls, dashed arrows are what the chain shows. Final and failed never change."
        className="h-auto w-full min-w-[760px] text-fd-foreground"
      >
        <title>Statuses of a step</title>
        <defs>
          <Arrowhead id={STEP_ARROW} />
        </defs>

        {/* start */}
        <Start x={x.built} y={36} />
        <Edge d={`M ${x.built} 43 V ${row - BOX_H / 2 - 2}`} kind="call" marker={STEP_ARROW} />
        <Label x={x.built + 14} y={74} lines={["builder.plan(),", "add(), replan()"]} kind="call" anchor="start" />

        {/* usual path */}
        <Edge d={`M ${x.built + half + 2} ${row} H ${x.signed - half - 2}`} kind="call" marker={STEP_ARROW} main />
        <Label x={(x.built + x.signed) / 2} y={row - 25} lines={["sign(),", "run()"]} kind="call" />
        <Edge d={`M ${x.signed + half + 2} ${row} H ${x.sent - half - 2}`} kind="call" marker={STEP_ARROW} main />
        <Label x={(x.signed + x.sent) / 2} y={row - 10} lines={["run()"]} kind="call" />
        <Edge d={`M ${x.sent + half + 2} ${row} H ${x.included - half - 2}`} kind="chain" marker={STEP_ARROW} main />
        <Label x={(x.sent + x.included) / 2} y={row - 10} lines={["in a block"]} kind="chain" />
        <Edge d={`M ${x.included + half + 2} ${row} H ${x.final - half - GAP - 2}`} kind="chain" marker={STEP_ARROW} main />
        <Label x={(x.included + x.final) / 2} y={row - 24} lines={["confirmations", "on top"]} kind="chain" />

        {/* sent and rejected */}
        <Edge d={`M ${x.sent - 16} ${row - BOX_H / 2 - 2} V ${48 + BOX_H / 2 + 2}`} kind="call" marker={STEP_ARROW} />
        <Edge d={`M ${x.sent + 16} ${48 + BOX_H / 2 + 2} V ${row - BOX_H / 2 - 2}`} kind="call" marker={STEP_ARROW} />
        <Label x={x.sent - 24} y={103} lines={["run() refused"]} kind="call" anchor="end" />
        <Label x={x.sent + 24} y={103} lines={["run() again"]} kind="call" anchor="start" />

        {/* rolled back */}
        <Edge
          d={`M ${x.included} ${row + BOX_H / 2 + 2} C ${x.included} 226, ${x.sent + 32} 226, ${x.sent + 32} ${row + BOX_H / 2 + 2}`}
          kind="chain"
          marker={STEP_ARROW}
        />
        <Label x={(x.included + x.sent) / 2 + 16} y={194} lines={["rolled back"]} kind="chain" />

        {/* dead statuses */}
        <rect
          x={112}
          y={250}
          width={402}
          height={96}
          rx={12}
          strokeWidth={1.2}
          strokeDasharray="2 4"
          className="fill-none stroke-fd-muted-foreground"
        />
        <text x={126} y={337} fontSize={12} className="fill-fd-foreground/70 italic">
          will not land (dead)
        </text>

        <Edge d={`M ${x.built + 24} ${row + BOX_H / 2 + 2} L ${d.orphaned - 20} ${dead - BOX_H / 2 - 2}`} kind="chain" marker={STEP_ARROW} />
        <Edge d={`M ${x.signed - 24} ${row + BOX_H / 2 + 2} L ${d.orphaned + 20} ${dead - BOX_H / 2 - 2}`} kind="chain" marker={STEP_ARROW} />
        <Label x={d.orphaned + 1} y={196} lines={["an earlier step", "will not land"]} kind="chain" />

        <Edge d={`M ${x.sent - 28} ${row + BOX_H / 2 + 2} L ${d.expired + 22} ${dead - BOX_H / 2 - 2}`} kind="chain" marker={STEP_ARROW} />
        <Label x={d.expired + 42} y={216} lines={["past validity", "+ margin"]} kind="chain" anchor="end" />

        <Edge d={`M ${x.sent} ${row + BOX_H / 2 + 2} V ${dead - BOX_H / 2 - GAP - 2}`} kind="chain" marker={STEP_ARROW} />
        <Label x={x.sent + 10} y={236} lines={["in a block, script failed"]} kind="chain" anchor="start" />

        {/* statuses */}
        <Status cx={x.built} cy={row} label="built" />
        <Status cx={x.signed} cy={row} label="signed" />
        <Status cx={x.sent} cy={row} label="sent" />
        <Status cx={x.included} cy={row} label="included" />
        <Status cx={x.final} cy={row} label="final" terminal />
        <Status cx={x.sent} cy={48} label="rejected" />
        <Status cx={d.orphaned} cy={dead} label="orphaned" />
        <Status cx={d.expired} cy={dead} label="expired" />
        <Status cx={d.failed} cy={dead} label="failed" terminal />

        <Legend x={620} y={272} marker={STEP_ARROW} vertical />
      </svg>
    </Frame>
  );
}

export function PlanStatusGraph() {
  const w = 96;
  const half = w / 2;
  const top = 60;
  const mid = 190;
  const x = { pending: 212, final: 790, stopping: 410, stopped: 690 };

  return (
    <Frame
      label="Status graph of a plan, scrolls sideways"
      note="Not drawn: a stopping plan becomes final when every step is final: one marked by stop() or replan() whose steps all land, or one whose dead step is found in a block again; a step that was dead and is found again in a block can move a stopping plan back to pending or a stopped plan to stopping or final; a plan made by replan that finds a transaction of an earlier plan in a block is marked and goes from pending to stopping."
    >
      <svg
        viewBox="0 0 880 316"
        role="img"
        aria-label="Statuses of a plan: pending, stopping, stopped and final. A plan starts pending and ends final when every step is final. A pending plan becomes stopping when stop() or replan() marks it, or when a step will not land while another step is neither final nor dead, and stopped when a step will not land and every other step is final or dead. A stopping plan becomes stopped when its last step that is neither final nor dead becomes final or dead. Solid arrows are calls, dashed arrows are what the chain shows. Final never changes."
        className="h-auto w-full min-w-[760px] text-fd-foreground"
      >
        <title>Statuses of a plan</title>
        <defs>
          <Arrowhead id={PLAN_ARROW} />
        </defs>

        {/* start */}
        <Start x={30} y={top} />
        <Edge d={`M 37 ${top} H ${x.pending - half - 2}`} kind="call" marker={PLAN_ARROW} />
        <Label x={(37 + x.pending - half - 2) / 2} y={top - 25} lines={["builder.plan(),", "replan()"]} kind="call" />

        {/* usual path */}
        <Edge d={`M ${x.pending + half + 2} ${top} H ${x.final - half - GAP - 2}`} kind="chain" marker={PLAN_ARROW} main />
        <Label x={(x.pending + x.final) / 2} y={top - 10} lines={["every step final"]} kind="chain" />

        {/* pending to stopping: a call */}
        <Edge
          d={`M ${x.pending} ${top + BOX_H / 2 + 2} V ${mid - 14} Q ${x.pending} ${mid} ${x.pending + 14} ${mid} H ${x.stopping - half - 2}`}
          kind="call"
          marker={PLAN_ARROW}
        />
        <Label x={(x.pending + x.stopping - half) / 2 - 2} y={mid - 8} lines={["stop(), replan()"]} kind="call" />

        {/* pending to stopping: a step will not land while another is not final yet */}
        <Edge
          d={`M ${x.pending + 34} ${top + BOX_H / 2 + 2} V 104 Q ${x.pending + 34} 118 ${x.pending + 48} 118 H ${x.stopping - 24} Q ${x.stopping - 10} 118 ${x.stopping - 10} 132 V ${mid - BOX_H / 2 - 2}`}
          kind="chain"
          marker={PLAN_ARROW}
        />
        <Label x={x.stopping} y={110} lines={["a step will not land,", "another not final yet"]} kind="chain" anchor="start" />

        {/* stopping to stopped */}
        <Edge d={`M ${x.stopping + half + 2} ${mid} H ${x.stopped - half - 2}`} kind="chain" marker={PLAN_ARROW} />
        <Label x={(x.stopping + x.stopped) / 2} y={mid - 10} lines={["last step final or dead"]} kind="chain" />

        {/* pending to stopped: a step will not land and every other step is final or dead */}
        <Edge
          d={`M ${x.pending - 34} ${top + BOX_H / 2 + 2} V 236 Q ${x.pending - 34} 250 ${x.pending - 20} 250 H ${x.stopped - 14} Q ${x.stopped} 250 ${x.stopped} 236 V ${mid + BOX_H / 2 + 2}`}
          kind="chain"
          marker={PLAN_ARROW}
        />
        <Label x={(x.pending + x.stopped) / 2 - 20} y={242} lines={["a step will not land, every other final or dead"]} kind="chain" />

        {/* statuses */}
        <Status cx={x.pending} cy={top} label="pending" w={w} />
        <Status cx={x.final} cy={top} label="final" w={w} terminal />
        <Status cx={x.stopping} cy={mid} label="stopping" w={w} />
        <Status cx={x.stopped} cy={mid} label="stopped" w={w} />

        <Legend x={166} y={284} marker={PLAN_ARROW} />
      </svg>
    </Frame>
  );
}
