"use client";

// A scheme of working with TxBuilder: every underlined name is a link to the page that explains it.
// Hand-written SVG in the look of plan-status-graph.tsx: colors come from the fumadocs
// theme classes and currentColor, so the scheme reads in light and dark mode.
// Two layouts of the same content: a wide one (left to right) and a narrow one (top to bottom)
// for a column under 600px, so a phone never has to scroll the scheme sideways.

import Link from "next/link";

const B = "/apis/txbuilder";

const GAP = 4; // distance between the two borders of a terminal box
const TIP = 4; // the arrowhead tip lies this far beyond the end of its line
const END = 2 + TIP; // a line ends this far before the box it points at: air plus the arrowhead
const LINK = "group/link cursor-pointer outline-none"; // the focus ring is drawn by Ring
const BOX = "fill-fd-card stroke-fd-muted-foreground group-hover/link:fill-fd-accent group-hover/link:stroke-fd-foreground";

const WIDE_ARROW = "bf-arrow-wide";
const NARROW_ARROW = "bf-arrow-narrow";

// ---------------------------------------------------------------- content, shared by both layouts

type Part = { href: string; title: string; name: string; code: string[] };
type Step = {
  href: string;
  title: string;
  name: string;
  code?: string;
  codeSize?: number;
  terminal?: boolean;
  skipTab?: boolean; // goes where the box before it goes: out of the Tab order, still a link
};
type Around = { href: string; title: string; names: string[]; codes: string[] };

const L = {
  create: { href: `${B}/basics#create-a-builder`, title: "Create a builder (Transaction Basics)" },
  networks: { href: `${B}/networks`, title: "Networks and providers (Providers and Networks)" },
  offline: {
    href: `${B}/offline#build-offline`,
    title:
      "Offline, no provider: params, costModels. Without a provider you can build and sign; plans and awaitInclusion() need one, and submit() needs a provider or a submitter (Offline and CBOR)",
  },
  payer: {
    href: `${B}/basics#choose-the-payer`,
    title: "Who pays: the payer of each build() or plan(); the builder holds none (Transaction Basics)",
  },
  signers: {
    href: `${B}/signing#who-pays-signs-and-submits`,
    title:
      "Signers and submitter: signers are named in sign() or run(), the submitter in submit(), run() or on the builder (Signing and Submitting)",
  },
  which: { href: `${B}#which-part-for-what`, title: "Which part for what (this page)" },
  provider: {
    href: `${B}/networks#use-blockfrost-for-plans`,
    title:
      "Needs a provider with block heights: plan() reads the chain tip, so a builder without a provider cannot plan (Providers and Networks)",
  },
  notLand: {
    href: `${B}/plans#handle-a-step-that-does-not-go-through`,
    title: "A step that does not land: replan() pays what is left (Plans)",
  },
  store: { href: `${B}/servers#record-plans-in-a-store`, title: "Plans in a store, on a server (Servers and Storage)" },
};

const PARTS: Part[] = [
  { href: `${B}/basics#send-lovelace-and-assets`, title: "Outputs: send lovelace and assets (Transaction Basics)", name: "Outputs", code: ["output"] },
  { href: `${B}/utxos`, title: "Inputs: give, limit and chain UTxOs (UTxOs and Inputs)", name: "Inputs", code: ["spend.pubKey"] },
  { href: `${B}/time`, title: "Time: expiry, start time and slots (Time and Validity)", name: "Time", code: ["validity"] },
  { href: `${B}/minting`, title: "Mint: mint and burn assets (Mint and Burn Assets)", name: "Mint", code: ["mint.native", "mint.plutus"] },
  { href: `${B}/smart-contracts`, title: "Scripts: lock, spend and read at a script (Smart Contracts)", name: "Scripts", code: ["spend.plutus", "spend.native"] },
  { href: `${B}/staking`, title: "Staking: withdraw rewards; the page also walks through stake keys, delegation and pools (Staking Transactions)", name: "Staking", code: ["withdrawal.*"] },
  {
    href: `${B}/certificates`,
    title: "Certificates: what the chain records, such as stake keys, delegation of stake and votes, pools, DReps and the committee (Certificates)",
    name: "Certificates",
    code: ["certificate.*"],
  },
  { href: `${B}/governance`, title: "Governance: DReps, votes and proposals (Governance Transactions)", name: "Governance", code: ["vote", "proposal.*"] },
];

const SIGNING = `${B}/signing#who-pays-signs-and-submits`;
const SUBMIT = `${B}/signing#submit-and-wait`;
const BUILD = `${B}/basics#build-sign-and-submit`;
const MAKE = `${B}/plans#make-and-run-a-plan`;
const STATUSES = `${B}/plans#read-the-statuses`;

const ONE_TX: Step[] = [
  { href: BUILD, title: "Build: build() signs nothing and sends nothing (Transaction Basics)", name: "Build", code: "builder.build(parts, { payer })" },
  { href: BUILD, title: "Result: the BuiltTx that build() returns (Transaction Basics)", name: "Result", code: "BuiltTx", skipTab: true },
  { href: SIGNING, title: "Sign: sign() (Signing and Submitting)", name: "Sign", code: "sign()" },
  { href: SUBMIT, title: "Send: submit() (Signing and Submitting)", name: "Send", code: "submit()" },
  {
    href: SUBMIT,
    title: "Wait for a block: one sighting, a rollback can undo it; to follow a payment to final, use a plan (Signing and Submitting)",
    name: "Wait",
    code: "awaitInclusion()",
    skipTab: true,
  },
];

const A_PLAN: Step[] = [
  {
    href: MAKE,
    title:
      "Plan: one list of parts is one step, main; an object of named steps is several. plan() builds every step, sends nothing, and needs a provider that returns block heights (Plans)",
    name: "Plan",
    code: "builder.plan(parts, { payer })",
  },
  { href: MAKE, title: "Result: the plan object (a TxPlan) that plan() returns, with run(), step() and status (Plans)", name: "Result", code: "TxPlan", skipTab: true },
  { href: MAKE, title: "Run: sign, send and wait until each step is in a block, included by default (Plans)", name: "Run", code: "run()", skipTab: true },
  { href: STATUSES, title: "Statuses: read the status of a plan and of its steps (Plans)", name: "Statuses", code: "plan.status" },
  {
    href: STATUSES,
    title: 'Final: run({ waitFor: "final" }) waits for confirmations; this status never changes (Plans)',
    name: "Final",
    code: 'waitFor: "final"',
    codeSize: 12,
    terminal: true,
    skipTab: true,
  },
];

const AROUND: Around[] = [
  {
    href: `${B}/offline#read-a-transaction-built-elsewhere`,
    title:
      "A transaction from elsewhere: fromCbor() and restore() give a BuiltTx to sign and submit, or a plan step; requiredSigners() lists its keys (Offline and CBOR)",
    names: ["A transaction", "from elsewhere"],
    codes: ["fromCbor, restore,", "requiredSigners"],
  },
  { href: `${B}/testing`, title: "Tests with a local ledger (Testing on the Emulator)", names: ["Tests"], codes: ["TxEmulator"] },
  { href: `${B}/errors#check-a-code`, title: "Errors: TxError.is checks a code (Errors)", names: ["Errors"], codes: ["TxError.is"] },
  { href: `${B}/options`, title: "Options of the builder, build() and plan() (Options)", names: ["Options"], codes: ["new TxBuilder,", "build(), plan()"] },
  { href: `${B}/migration`, title: "Coming from MeshTxBuilder (Migrating to TxBuilder)", names: ["Coming from"], codes: ["MeshTxBuilder"] },
];

const LABEL =
  "Working with TxBuilder, step by step. 1: create a builder. 2: say who pays, for each call. 3: give the parts. Then 4: build one transaction, sign it, submit it and wait for a block, or 5: make a plan of one or several transactions, run it and read its statuses. 6: around the flow, a transaction from elsewhere, tests, errors, options and coming from MeshTxBuilder. Every underlined name is a link to the page that explains it.";

// ---------------------------------------------------------------- drawing pieces

function Arrowhead({ id }: { id: string }) {
  // refX 6 of 10: the line ends under the head, the tip lies TIP beyond the end of the line
  return (
    <marker id={id} viewBox="0 0 10 10" refX={10 - TIP} refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
      <path d="M0 0.5 L10 5 L0 9.5 z" fill="currentColor" />
    </marker>
  );
}

function Edge({ d, marker, main = false }: { d: string; marker: string; main?: boolean }) {
  // main: the usual path, a heavier line
  return <path d={d} fill="none" stroke="currentColor" strokeWidth={main ? 3 : 1.5} markerEnd={`url(#${marker})`} />;
}

// Lines that stop short of the box they point at.
const hLine = (from: number, to: number, y: number) => `M ${from + 2} ${y} H ${to - END}`;
const vLine = (x: number, from: number, to: number) => `M ${x} ${from + 2} V ${to - END}`;
// From a vertical spine, round the corner and go right to a box.
const elbow = (spine: number, y0: number, cy: number, boxX: number) =>
  `M ${spine} ${y0} V ${cy - 12} Q ${spine} ${cy} ${spine + 12} ${cy} H ${boxX - END}`;

// The focus ring: drawn only for keyboard focus, so it shows in every browser.
function Ring({ x, y, w, h, r = 6 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      strokeWidth={2}
      className="fill-none stroke-transparent group-focus-visible/link:stroke-fd-foreground"
    />
  );
}

// A link made of one line of words. `width` is the width of the text (measured in the
// browser), used for the focus ring and the hover area.
function TextLink({
  href,
  title,
  x,
  y,
  width,
  anchor = "start",
  fontSize = 13,
  semibold = false,
  children,
}: {
  href: string;
  title: string;
  x: number;
  y: number; // the middle line of the text
  width: number;
  anchor?: "start" | "end";
  fontSize?: number;
  semibold?: boolean;
  children: React.ReactNode;
}) {
  const left = anchor === "end" ? x - width : x;
  return (
    <Link href={href} className={LINK}>
      <title>{title}</title>
      <rect x={left - 4} y={y - fontSize} width={width + 8} height={2 * fontSize} rx={6} className="fill-transparent" />
      <Ring x={left - 4} y={y - fontSize} w={width + 8} h={2 * fontSize} />
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize={fontSize}
        className={`fill-fd-foreground underline underline-offset-4 group-hover/link:fill-fd-muted-foreground ${semibold ? "font-semibold" : ""}`}
      >
        {children}
      </text>
    </Link>
  );
}

// A box that is one link: plain words (underlined) above the code names (monospace).
function NodeLink({
  href,
  title,
  x,
  y,
  w,
  h,
  names,
  codes = [],
  lh = 17,
  codeSize = 13,
  terminal = false,
  skipTab = false,
}: {
  href: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  names: string[];
  codes?: string[];
  lh?: number;
  codeSize?: number;
  terminal?: boolean;
  skipTab?: boolean;
}) {
  const cx = x + w / 2;
  const lines = names.length + codes.length;
  const first = y + (h - lines * lh) / 2 + lh / 2;
  const pad = terminal ? GAP : 0;
  return (
    <Link href={href} className={LINK} tabIndex={skipTab ? -1 : undefined}>
      <title>{title}</title>
      <rect x={x} y={y} width={w} height={h} rx={8} strokeWidth={1.5} className={BOX} />
      {terminal && (
        <rect
          x={x - GAP}
          y={y - GAP}
          width={w + 2 * GAP}
          height={h + 2 * GAP}
          rx={8 + GAP}
          strokeWidth={1.5}
          className="fill-none stroke-fd-muted-foreground group-hover/link:stroke-fd-foreground"
        />
      )}
      {names.map((line, i) => (
        <text key={line} x={cx} y={first + i * lh} textAnchor="middle" dominantBaseline="central" fontSize={13} className="fill-fd-foreground underline underline-offset-4">
          {line}
        </text>
      ))}
      {codes.map((line, i) => (
        <text key={line} x={cx} y={first + (names.length + i) * lh} textAnchor="middle" dominantBaseline="central" fontSize={codeSize} className="fill-fd-foreground font-mono">
          {line}
        </text>
      ))}
      <Ring x={x - pad - 3} y={y - pad - 3} w={w + 2 * pad + 6} h={h + 2 * pad + 6} r={11 + pad} />
    </Link>
  );
}

// A box of the narrow layout: the name on the left, the code on the right, one line.
function RowLink({ step, x, y, w, h }: { step: Step; x: number; y: number; w: number; h: number }) {
  const cy = y + h / 2;
  const pad = step.terminal ? GAP : 0;
  return (
    <Link href={step.href} className={LINK} tabIndex={step.skipTab ? -1 : undefined}>
      <title>{step.title}</title>
      <rect x={x} y={y} width={w} height={h} rx={8} strokeWidth={1.5} className={BOX} />
      {step.terminal && (
        <rect
          x={x - GAP}
          y={y - GAP}
          width={w + 2 * GAP}
          height={h + 2 * GAP}
          rx={8 + GAP}
          strokeWidth={1.5}
          className="fill-none stroke-fd-muted-foreground group-hover/link:stroke-fd-foreground"
        />
      )}
      <text x={x + 14} y={cy} dominantBaseline="central" fontSize={13} className="fill-fd-foreground underline underline-offset-4">
        {step.name}
      </text>
      {step.code && (
        <text x={x + w - 14} y={cy} textAnchor="end" dominantBaseline="central" fontSize={12} className="fill-fd-foreground font-mono">
          {step.code}
        </text>
      )}
      <Ring x={x - pad - 3} y={y - pad - 3} w={w + 2 * pad + 6} h={h + 2 * pad + 6} r={11 + pad} />
    </Link>
  );
}

// The number of a step, in a ring.
function Badge({ cx, cy, n }: { cx: number; cy: number; n: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} strokeWidth={1.5} className="fill-none stroke-fd-muted-foreground" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={12} className="fill-fd-foreground font-mono">
        {n}
      </text>
    </g>
  );
}

function Legend({ x, y, marker }: { x: number; y: number; marker: string }) {
  return (
    <g className="fill-fd-foreground/70" fontSize={13}>
      <Edge d={`M ${x} ${y} h 30`} marker={marker} main />
      <text x={x + 42} y={y} dominantBaseline="central">
        usual path
      </text>
      <Edge d={`M ${x + 136} ${y} h 30`} marker={marker} />
      <text x={x + 178} y={y} dominantBaseline="central">
        another path
      </text>
    </g>
  );
}

function Caption({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} dominantBaseline="central" fontSize={15} className="fill-fd-foreground font-semibold">
      {children}
    </text>
  );
}

function Sub({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <text x={x} y={y} dominantBaseline="central" fontSize={13} className="fill-fd-foreground/70">
      {children}
    </text>
  );
}

function Frame({ children, note }: { children: React.ReactNode; note: string }) {
  // The wide svg keeps a 760px minimum so its text stays legible. Under 600px the narrow
  // svg takes its place; between the two the box scrolls and the hint shows. Keyboard focus
  // scrolls the focused link into view, which the browser does not do for a link that is
  // only partly visible.
  return (
    <div className="not-prose my-6 @container">
      <div
        className="overflow-x-auto rounded-lg border border-fd-border"
        onFocus={(e) => {
          if (e.target !== e.currentTarget) (e.target as Element).scrollIntoView?.({ block: "nearest", inline: "center" });
        }}
      >
        {children}
      </div>
      <p className="mt-1 hidden text-xs text-fd-muted-foreground @min-[600px]:@max-[761px]:block">
        Scroll sideways to see the whole scheme. The numbered list below has the same steps and links.
      </p>
      <p className="mt-2 text-sm text-fd-muted-foreground">{note}</p>
    </div>
  );
}

// ---------------------------------------------------------------- the wide layout

function WideScheme() {
  const M = WIDE_ARROW;
  // Geometry. Row 1: two boxes. Row 2: the parts. Then two lanes, notes, then the boxes around.
  const row1 = { y: 16, h: 140 };
  const box1 = { x: 20, w: 410 };
  const box2 = { x: 470, w: 410 };
  const parts = { y: 196, h: 200 }; // two rows of four chips
  const chip = { x: 34, w: 202, step: 210, h: 64, y: 52, rowStep: 72, perRow: 4 };
  const base = parts.y + parts.h; // the lower edge of the parts: the lanes hang from it
  const laneA = { cap: base + 32, y: base + 52, cy: base + 77 };
  const laneB = { cap: base + 134, y: base + 152, cy: base + 177 };
  const NH = 50; // height of a box in a lane
  const spine = 40;
  const notes = laneB.y + NH + 28;
  const around = { cap: notes + 44, y: notes + 64, h: 80, w: 160 };
  const H = around.y + around.h + 22; // the height of the drawing
  // Columns of the lanes: x and width; the same for both lanes.
  const col = [
    { x: 68, w: 258 },
    { x: 354, w: 84 },
    { x: 466, w: 84 },
    { x: 578, w: 108 },
    { x: 714, w: 150 },
  ];
  const last = col.length - 2;
  const arrowsA = col.slice(0, -1).map((c, i) => hLine(c.x + c.w, col[i + 1].x, laneA.cy));
  const arrowsB = col.slice(0, -1).map((c, i) => hLine(c.x + c.w, col[i + 1].x - (i === last ? GAP : 0), laneB.cy));

  return (
    <svg
      viewBox={`0 0 900 ${H}`}
      role="group"
      aria-label={LABEL}
      className="h-auto w-full min-w-[760px] text-fd-foreground @max-[599px]:hidden"
    >
      <title>Working with TxBuilder</title>
      <defs>
        <Arrowhead id={M} />
      </defs>

      {/* arrows first, so the boxes sit on top of their ends */}
      <Edge marker={M} main d={hLine(box1.x + box1.w, box2.x, row1.y + row1.h / 2)} />
      <Edge marker={M} main d={vLine(box2.x + box2.w / 2, row1.y + row1.h, parts.y)} />
      {/* from the parts to the two lanes */}
      <Edge marker={M} d={elbow(spine, laneA.cy - 12, laneB.cy, col[0].x)} />
      <Edge marker={M} main d={elbow(spine, parts.y + parts.h + 2, laneA.cy, col[0].x)} />
      {arrowsA.map((d) => (
        <Edge key={d} marker={M} d={d} main />
      ))}
      {arrowsB.map((d) => (
        <Edge key={d} marker={M} d={d} />
      ))}

      {/* 1: create a builder */}
      <g>
        <title>Create a builder</title>
        <rect x={box1.x} y={row1.y} width={box1.w} height={row1.h} rx={8} strokeWidth={1.5} className="fill-fd-card stroke-fd-muted-foreground" />
        <Badge cx={box1.x + 24} cy={row1.y + 28} n={1} />
        <TextLink {...L.create} x={box1.x + 46} y={row1.y + 28} width={115} fontSize={15} semibold>
          Create a builder
        </TextLink>
        <text x={box1.x + 24} y={row1.y + 58} dominantBaseline="central" fontSize={13} className="fill-fd-foreground font-mono">
          new TxBuilder({"{"} network, provider {"}"})
        </text>
        <TextLink {...L.networks} x={box1.x + 24} y={row1.y + 88} width={147}>
          Networks and providers
        </TextLink>
        <TextLink {...L.offline} x={box1.x + 24} y={row1.y + 114} width={258}>
          Offline, no provider: <tspan className="font-mono">params</tspan>, <tspan className="font-mono">costModels</tspan>
        </TextLink>
      </g>

      {/* 2: who pays */}
      <g>
        <title>Who pays</title>
        <rect x={box2.x} y={row1.y} width={box2.w} height={row1.h} rx={8} strokeWidth={1.5} className="fill-fd-card stroke-fd-muted-foreground" />
        <Badge cx={box2.x + 24} cy={row1.y + 28} n={2} />
        <TextLink {...L.payer} x={box2.x + 46} y={row1.y + 28} width={72} fontSize={15} semibold>
          Who pays
        </TextLink>
        <text x={box2.x + 24} y={row1.y + 58} dominantBaseline="central" fontSize={13} className="fill-fd-foreground">
          <tspan className="font-mono">{"{ payer }"}</tspan> of each call: a wallet, an address,
        </text>
        <text x={box2.x + 24} y={row1.y + 77} dominantBaseline="central" fontSize={13} className="fill-fd-foreground">
          or your own <tspan className="font-mono">{"{ changeAddress, utxos }"}</tspan>
        </text>
        <TextLink {...L.signers} x={box2.x + 24} y={row1.y + 114} width={134}>
          Signers and submitter
        </TextLink>
      </g>

      {/* 3: the parts */}
      <rect x={20} y={parts.y} width={860} height={parts.h} rx={12} strokeWidth={1.2} strokeDasharray="2 4" className="fill-none stroke-fd-muted-foreground" />
      <Badge cx={44} cy={parts.y + 28} n={3} />
      <Caption x={66} y={parts.y + 28}>
        Parts
      </Caption>
      <Sub x={116} y={parts.y + 28}>
        one part or a list; the builder picks inputs, adds change and sets the fee
      </Sub>
      <TextLink {...L.which} x={864} y={parts.y + 28} anchor="end" width={121}>
        Which part for what
      </TextLink>
      {PARTS.map((c, i) => (
        <NodeLink
          key={c.href}
          href={c.href}
          title={c.title}
          x={chip.x + (i % chip.perRow) * chip.step}
          y={parts.y + chip.y + Math.floor(i / chip.perRow) * chip.rowStep}
          w={chip.w}
          h={chip.h}
          names={[c.name]}
          codes={c.code}
          codeSize={12}
        />
      ))}

      {/* 4: one transaction */}
      <Badge cx={79} cy={laneA.cap} n={4} />
      <Caption x={98} y={laneA.cap}>
        One transaction
      </Caption>
      <Sub x={236} y={laneA.cap}>
        build, sign and send; you follow the outcome
      </Sub>
      <Legend x={604} y={laneA.cap} marker={M} />
      {ONE_TX.map((s, i) => (
        <NodeLink key={s.name} href={s.href} title={s.title} x={col[i].x} y={laneA.y} w={col[i].w} h={NH} names={[s.name]} codes={s.code ? [s.code] : []} codeSize={s.codeSize} skipTab={s.skipTab} />
      ))}

      {/* 5: a plan */}
      <Badge cx={79} cy={laneB.cap} n={5} />
      <Caption x={98} y={laneB.cap}>
        Or a plan
      </Caption>
      <Sub x={174} y={laneB.cap}>
        one or several transactions, sent in order, never rebuilt
      </Sub>
      <TextLink {...L.provider} x={864} y={laneB.cap} anchor="end" width={221}>
        Needs a provider with block heights
      </TextLink>
      {A_PLAN.map((s, i) => (
        <NodeLink
          key={s.name}
          href={s.href}
          title={s.title}
          x={col[i].x}
          y={laneB.y}
          w={col[i].w}
          h={NH}
          names={[s.name]}
          codes={s.code ? [s.code] : []}
          codeSize={s.codeSize}
          terminal={s.terminal}
          skipTab={s.skipTab}
        />
      ))}
      <TextLink {...L.notLand} x={662} y={notes} anchor="end" width={223}>
        A step that does not land: <tspan className="font-mono">replan()</tspan>
      </TextLink>
      <TextLink {...L.store} x={864} y={notes} anchor="end" width={170}>
        Plans in a store, on a server
      </TextLink>

      {/* 6: around the flow */}
      <Badge cx={31} cy={around.cap} n={6} />
      <text x={50} y={around.cap} dominantBaseline="central" fontSize={13} className="fill-fd-foreground/70 italic">
        Around the flow
      </text>
      {AROUND.map((a, i) => (
        <NodeLink key={a.href} href={a.href} title={a.title} x={20 + i * 175} y={around.y} w={around.w} h={around.h} names={a.names} codes={a.codes} lh={16} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------- the narrow layout

function NarrowScheme() {
  const M = NARROW_ARROW;
  const W = 380;
  const box = { x: 10, w: 360, h: 140 };
  const spine = 28;
  const bx = 58; // the boxes of a lane
  const bw = 302;
  const RH = 32; // height of a row in a lane
  const RG = 22; // distance between two rows
  const rowY = (y0: number, i: number) => y0 + i * (RH + RG);

  const y1 = 10;
  const y2 = y1 + box.h + 30;
  const yParts = y2 + box.h + 30;
  const partsH = 312;
  const capA = yParts + partsH + 40;
  const yA = capA + 42;
  const endA = rowY(yA, 4) + RH;
  const capB = endA + 44;
  const yB = capB + 90;
  const endB = rowY(yB, 4) + RH;
  const yNotes = endB + 40;
  const yLegend = yNotes + 52;
  const capC = yLegend + 50;
  const yC = capC + 24;
  const cw = 175;
  const heights = [58, 62, 62];
  const rowsC = [yC, yC + 58 + 10, yC + 58 + 10 + 62 + 10];
  const H = rowsC[2] + heights[2] + 16;

  const arrowsA = ONE_TX.slice(0, -1).map((_, i) => vLine(bx + bw / 2, rowY(yA, i) + RH, rowY(yA, i + 1)));
  const arrowsB = A_PLAN.slice(0, -1).map((_, i) => vLine(bx + bw / 2, rowY(yB, i) + RH, rowY(yB, i + 1) - (i === 3 ? GAP : 0)));
  const chipX = (i: number) => 19 + (i % 3) * 116;
  const chipY = (i: number) => yParts + 88 + Math.floor(i / 3) * 72;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="group"
      aria-label={LABEL}
      className="mx-auto hidden h-auto w-full max-w-[400px] text-fd-foreground @max-[599px]:block"
    >
      <title>Working with TxBuilder</title>
      <defs>
        <Arrowhead id={M} />
      </defs>

      {/* arrows first, so the boxes sit on top of their ends */}
      <Edge marker={M} main d={vLine(box.x + box.w / 2, y1 + box.h, y2)} />
      <Edge marker={M} main d={vLine(box.x + box.w / 2, y2 + box.h, yParts)} />
      <Edge marker={M} d={elbow(spine, rowY(yA, 0) + RH / 2 - 12, rowY(yB, 0) + RH / 2, bx)} />
      <Edge marker={M} main d={elbow(spine, yParts + partsH + 2, rowY(yA, 0) + RH / 2, bx)} />
      {arrowsA.map((d) => (
        <Edge key={d} marker={M} d={d} main />
      ))}
      {arrowsB.map((d) => (
        <Edge key={d} marker={M} d={d} />
      ))}

      {/* 1: create a builder */}
      <g>
        <title>Create a builder</title>
        <rect x={box.x} y={y1} width={box.w} height={box.h} rx={8} strokeWidth={1.5} className="fill-fd-card stroke-fd-muted-foreground" />
        <Badge cx={box.x + 24} cy={y1 + 28} n={1} />
        <TextLink {...L.create} x={box.x + 46} y={y1 + 28} width={115} fontSize={15} semibold>
          Create a builder
        </TextLink>
        <text x={box.x + 24} y={y1 + 58} dominantBaseline="central" fontSize={13} className="fill-fd-foreground font-mono">
          new TxBuilder({"{"} network, provider {"}"})
        </text>
        <TextLink {...L.networks} x={box.x + 24} y={y1 + 88} width={147}>
          Networks and providers
        </TextLink>
        <TextLink {...L.offline} x={box.x + 24} y={y1 + 114} width={258}>
          Offline, no provider: <tspan className="font-mono">params</tspan>, <tspan className="font-mono">costModels</tspan>
        </TextLink>
      </g>

      {/* 2: who pays */}
      <g>
        <title>Who pays</title>
        <rect x={box.x} y={y2} width={box.w} height={box.h} rx={8} strokeWidth={1.5} className="fill-fd-card stroke-fd-muted-foreground" />
        <Badge cx={box.x + 24} cy={y2 + 28} n={2} />
        <TextLink {...L.payer} x={box.x + 46} y={y2 + 28} width={72} fontSize={15} semibold>
          Who pays
        </TextLink>
        <text x={box.x + 24} y={y2 + 58} dominantBaseline="central" fontSize={13} className="fill-fd-foreground">
          <tspan className="font-mono">{"{ payer }"}</tspan> of each call: a wallet, an address,
        </text>
        <text x={box.x + 24} y={y2 + 77} dominantBaseline="central" fontSize={13} className="fill-fd-foreground">
          or your own <tspan className="font-mono">{"{ changeAddress, utxos }"}</tspan>
        </text>
        <TextLink {...L.signers} x={box.x + 24} y={y2 + 114} width={134}>
          Signers and submitter
        </TextLink>
      </g>

      {/* 3: the parts */}
      <rect x={box.x} y={yParts} width={box.w} height={partsH} rx={12} strokeWidth={1.2} strokeDasharray="2 4" className="fill-none stroke-fd-muted-foreground" />
      <Badge cx={34} cy={yParts + 28} n={3} />
      <Caption x={56} y={yParts + 28}>
        Parts
      </Caption>
      <TextLink {...L.which} x={356} y={yParts + 28} anchor="end" width={121}>
        Which part for what
      </TextLink>
      <Sub x={24} y={yParts + 54}>
        one part or a list; the builder picks inputs,
      </Sub>
      <Sub x={24} y={yParts + 72}>
        adds change and sets the fee
      </Sub>
      {PARTS.map((c, i) => (
        <NodeLink key={c.href} href={c.href} title={c.title} x={chipX(i)} y={chipY(i)} w={110} h={64} names={[c.name]} codes={c.code} codeSize={12} />
      ))}

      {/* 4: one transaction */}
      <Badge cx={bx + 11} cy={capA} n={4} />
      <Caption x={bx + 30} y={capA}>
        One transaction
      </Caption>
      <Sub x={bx} y={capA + 22}>
        build, sign and send; you follow the outcome
      </Sub>
      {ONE_TX.map((s, i) => (
        <RowLink key={s.name} step={s} x={bx} y={rowY(yA, i)} w={bw} h={RH} />
      ))}

      {/* 5: a plan */}
      <Badge cx={bx + 11} cy={capB} n={5} />
      <Caption x={bx + 30} y={capB}>
        Or a plan
      </Caption>
      <Sub x={bx} y={capB + 22}>
        one or several transactions,
      </Sub>
      <Sub x={bx} y={capB + 40}>
        sent in order, never rebuilt
      </Sub>
      <TextLink {...L.provider} x={bx} y={capB + 64} width={221}>
        Needs a provider with block heights
      </TextLink>
      {A_PLAN.map((s, i) => (
        <RowLink key={s.name} step={s} x={bx} y={rowY(yB, i)} w={bw} h={RH} />
      ))}
      <TextLink {...L.notLand} x={bx} y={yNotes} width={223}>
        A step that does not land: <tspan className="font-mono">replan()</tspan>
      </TextLink>
      <TextLink {...L.store} x={bx} y={yNotes + 28} width={170}>
        Plans in a store, on a server
      </TextLink>
      <Legend x={bx} y={yLegend} marker={M} />

      {/* 6: around the flow */}
      <Badge cx={21} cy={capC} n={6} />
      <text x={40} y={capC} dominantBaseline="central" fontSize={13} className="fill-fd-foreground/70 italic">
        Around the flow
      </text>
      {AROUND.map((a, i) => {
        const first = i === 0;
        const x = first ? 10 : 10 + ((i - 1) % 2) * (cw + 10);
        const y = first ? rowsC[0] : rowsC[1 + Math.floor((i - 1) / 2)];
        const h = first ? heights[0] : heights[1];
        return (
          <NodeLink
            key={a.href}
            href={a.href}
            title={a.title}
            x={x}
            y={y}
            w={first ? 360 : cw}
            h={h}
            names={first ? ["A transaction from elsewhere"] : a.names}
            codes={first ? ["fromCbor, restore, requiredSigners"] : a.codes}
            lh={first ? 17 : 16}
            codeSize={first ? 12 : 13}
          />
        );
      })}
    </svg>
  );
}

export function BuilderFlow() {
  return (
    <Frame note="Heavy arrows are the usual path. Every underlined name is a link to the page that explains it.">
      <WideScheme />
      <NarrowScheme />
    </Frame>
  );
}
