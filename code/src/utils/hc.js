// utils/hc.js
function makeErr(code, ctx = {}) { const e = new Error(code); e.name = 'HCParseError'; e.code = code; e.ctx = ctx; return e; }

// Chấp nhận node line:  A: C, D, E | h=20
// Start/Goal song ngữ và 2 kiểu: START=A | Start: A | Trạng thái đầu: A | Bắt đầu: A
export function parseGraphHC(text) {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  const nodeRe = /^([A-Za-z0-9_]+)\s*:\s*([^|#]*)\|\s*h\s*=\s*([+-]?\d+(?:\.\d+)?)$/i;

  const startRes = [
    /^START\s*=\s*([A-Za-z0-9_]+)$/i, /^Start\s*:\s*([A-Za-z0-9_]+)$/i,
    /^Trạng\s+thái\s+đầu\s*:\s*([A-Za-z0-9_]+)$/i, /^Bắt\s+đầu\s*:\s*([A-Za-z0-9_]+)$/i
  ];
  const goalRes = [
    /^GOAL\s*=\s*([A-Za-z0-9_]+)$/i, /^Goal\s*:\s*([A-Za-z0-9_]+)$/i,
    /^Trạng\s+thái\s+kết\s+thúc\s*:\s*([A-Za-z0-9_]+)$/i, /^Kết\s+thúc\s*:\s*([A-Za-z0-9_]+)$/i
  ];

  let start=null, goal=null;
  const graph = {};  // {u: [v,...]}
  const h = {};      // {u: h(u)}

  for (const line of lines) {
    const m = line.match(nodeRe);
    if (m) {
      const u = m[1];
      const nbr = (m[2] || '').trim();
      h[u] = parseFloat(m[3]);
      graph[u] = nbr ? nbr.split(',').map(s => s.trim()).filter(Boolean) : [];
      continue;
    }
    for (const re of startRes) { const ms=line.match(re); if (ms){ start=ms[1]; break; } }
    for (const re of goalRes)  { const mg=line.match(re); if (mg){ goal =mg[1]; break; } }
  }

  if (!start) throw makeErr('HC_ERR_MISSING_START');
  if (!goal)  throw makeErr('HC_ERR_MISSING_GOAL');
  if (!graph[start]) throw makeErr('HC_ERR_START_NOT_IN_GRAPH',{start});
  if (h[start]===undefined) throw makeErr('HC_ERR_MISSING_H_START',{start});
  if (h[goal]===undefined)  throw makeErr('HC_ERR_MISSING_H_GOAL',{goal});

  // mọi hàng xóm phải có h()
  for (const [u, vs] of Object.entries(graph)) {
    for (const v of vs) {
      if (h[v]===undefined) throw makeErr('HC_ERR_MISSING_H_NODE',{v});
      if (!graph[v]) graph[v] = []; // cho phép lá đã có h
    }
  }
  return { graph, h, start, goal };
}

export function runHillClimbing(graph, h, start, goal) {
  const steps = [];
  const path = [start];
  let current = start;

  steps.push({ current, h: h[current], neighbors: graph[current] ?? [], chosen: null, noteKey: current===goal?'note_goal':'' });

  while (current !== goal) {
    const neighbors = graph[current] ?? [];
    if (!neighbors.length) { steps.push({ current, h:h[current], neighbors, chosen:null, noteKey:'note_deadend' }); return { found:false, path, steps }; }
    const sorted = [...neighbors].sort((a,b)=> (h[a]-h[b]) || String(a).localeCompare(String(b)));
    const best = sorted[0];
    const noteKey = h[best] < h[current] ? 'note_progress' : 'note_stuck';
    steps.push({ current, h:h[current], neighbors, chosen:best, noteKey });
    if (h[best] >= h[current]) return { found:false, path, steps };
    current = best; path.push(current);
  }
  steps.push({ current, h:h[current], neighbors: graph[current] ?? [], chosen:null, noteKey:'note_goal' });
  return { found:true, path, steps };
}
