
function makeErr(code, ctx = {}) {
  const e = new Error(code);
  e.name = 'HCParseError';
  e.code = code;
  e.ctx = ctx;
  return e;
}

export function parseGraphHC(fileContent) {
  const lines = fileContent
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('#'));

  let start = null, goal = null;
  const graph = {};
  const h = {};

  const startRe = /^START\s*=\s*([A-Za-z0-9_]+)$/i;
  const goalRe  = /^GOAL\s*=\s*([A-Za-z0-9_]+)$/i;
  // A: C, D, E | h=20
  const nodeRe  = /^([A-Za-z0-9_]+)\s*:\s*([^|#]*)\|\s*h\s*=\s*([+-]?\d+(?:\.\d+)?)$/i;

  for (const line of lines) {
    if (startRe.test(line)) { start = line.match(startRe)[1]; continue; }
    if (goalRe.test(line))  { goal  = line.match(goalRe)[1];  continue; }
    const m = line.match(nodeRe);
    if (m) {
      const node = m[1];
      const neighborsStr = m[2].trim();
      const heur = parseFloat(m[3]);
      const neighbors = neighborsStr
        ? neighborsStr.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      graph[node] = neighbors;
      h[node] = heur;
    }
  }

  const nodes = Object.keys(graph);
  if (!start) throw makeErr('HC_ERR_MISSING_START');
  if (!goal)  throw makeErr('HC_ERR_MISSING_GOAL');
  if (!nodes.length) throw makeErr('HC_ERR_NO_NODES');
  if (!graph[start]) throw makeErr('HC_ERR_START_NOT_IN_GRAPH', { start });
  if (!h.hasOwnProperty(start)) throw makeErr('HC_ERR_MISSING_H_START', { start });
  if (!h.hasOwnProperty(goal))  throw makeErr('HC_ERR_MISSING_H_GOAL', { goal });

  for (const [u, vs] of Object.entries(graph)) {
    for (const v of vs) {
      if (!graph.hasOwnProperty(v) && !h.hasOwnProperty(v)) {
        throw makeErr('HC_ERR_NEIGHBOR_UNDECLARED', { u, v });
      }
      if (!h.hasOwnProperty(v)) {
        throw makeErr('HC_ERR_MISSING_H_NODE', { v });
      }
    }
  }

  return { graph, h, start, goal };
}

export function runHillClimbing(graph, h, start, goal) {
  const steps = [];
  const path = [start];

  let current = start;
  steps.push({
    current,
    h: h[current],
    neighbors: graph[current] ?? [],
    chosen: null,
    noteKey: current === goal ? 'note_goal' : ''
  });

  while (current !== goal) {
    const neighbors = graph[current] ?? [];
    if (!neighbors.length) {
      steps.push({ current, h: h[current], neighbors, chosen: null, noteKey: 'note_deadend' });
      return { found: false, path, steps };
    }

    const sorted = [...neighbors].sort((a, b) => {
      if (h[a] !== h[b]) return h[a] - h[b];
      return String(a).localeCompare(String(b));
    });
    const best = sorted[0];

    const noteKey = h[best] < h[current] ? 'note_progress' : 'note_stuck';
    steps.push({ current, h: h[current], neighbors, chosen: best, noteKey });

    if (h[best] >= h[current]) return { found: false, path, steps };

    current = best;
    path.push(current);
  }

  steps.push({
    current,
    h: h[current],
    neighbors: graph[current] ?? [],
    chosen: null,
    noteKey: 'note_goal'
  });

  return { found: true, path, steps };
}
