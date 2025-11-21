function fail(msg, ctx = {}) {
  const e = new Error(msg);
  e.name = 'BNBParseError';
  e.ctx = ctx;
  return e;
}
function makeErr(code, ctx = {}) { const e = new Error(code); e.name = 'BNBParseError'; e.code = code; e.ctx = ctx; return e; }

export function parseGraphBNB(text) {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));


  const nodeRe = /^([A-Za-z0-9_]+)\s*:\s*([^|#]*)\|\s*h\s*=\s*([+-]?\d+(?:\.\d+)?)$/i;

  const startRes = [
    /^START\s*=\s*([A-Za-z0-9_]+)$/i,
    /^Start\s*:\s*([A-Za-z0-9_]+)$/i,
    /^Trạng\s+thái\s+đầu\s*:\s*([A-Za-z0-9_]+)$/i,
    /^Bắt\s+đầu\s*:\s*([A-Za-z0-9_]+)$/i
  ];
  const goalRes = [
    /^GOAL\s*=\s*([A-Za-z0-9_]+)$/i,
    /^Goal\s*:\s*([A-Za-z0-9_]+)$/i,
    /^Trạng\s+thái\s+kết\s+thúc\s*:\s*([A-Za-z0-9_]+)$/i,
    /^Kết\s+thúc\s*:\s*([A-Za-z0-9_]+)$/i
  ];

  let start = null, goal = null;
  const adj = {};
  const h   = {};

  for (const line of lines) {

    const m = line.match(nodeRe);
    if (m) {
      const u = m[1];
      const nbr = (m[2] || '').trim();
      h[u] = parseFloat(m[3]);
      const edges = [];
      if (nbr) {
        for (const tok of nbr.split(',').map(s => s.trim()).filter(Boolean)) {
          const em = tok.match(/^([A-Za-z0-9_]+)\(([-+]?\d+(?:\.\d+)?)\)$/);
          if (!em) throw makeErr('BNB_ERR_BAD_EDGE_TOKEN', { token: tok, line });
          edges.push({ v: em[1], w: parseFloat(em[2]) });
        }
      }
      adj[u] = edges;
      continue;
    }

    for (const re of startRes) {
      const ms = line.match(re);
      if (ms) { start = ms[1]; continue; }
    }

    for (const re of goalRes) {
      const mg = line.match(re);
      if (mg) { goal = mg[1]; continue; }
    }
  }

  if (!start) throw makeErr('BNB_ERR_MISSING_START');
  if (!goal)  throw makeErr('BNB_ERR_MISSING_GOAL');
  if (!adj[start]) throw makeErr('BNB_ERR_START_UNDECLARED', { start });
  if (h[start] === undefined) throw makeErr('BNB_ERR_MISSING_H_NODE', { node: start });
  if (h[goal]  === undefined) throw makeErr('BNB_ERR_MISSING_H_NODE', { node: goal });

  for (const [u, edges] of Object.entries(adj)) {
    for (const { v } of edges) {
      if (h[v] === undefined) throw makeErr('BNB_ERR_MISSING_H_NODE', { node: v });
      if (!adj[v]) adj[v] = []; // lá
    }
  }
  return { adj, h, start, goal };
}
export function runBranchAndBound(adj, h, start, goal) {
  let L=[{node:start, g:0, path:[start]}];
  let bestCost=Infinity, bestPath=[];
  const steps=[];

  while(L.length){
    const cur=L.shift(); const u=cur.node, g=cur.g;
    if (u===goal){
      if (g<bestCost){ bestCost=g; bestPath=cur.path; }
      steps.push({u,g,reachedGoal:true,costBound:bestCost,neighbors:[],L1:[],L:L.map(x=>x.node)});
      continue;
    }
    const neighbors=adj[u]||[];
    const L1=neighbors.map(({v,w})=>{
      const g2=g+w, f2=g2+h[v];
      return {node:v,g:g2,f:f2,path:[...cur.path,v]};
    }).filter(x=>x.f<bestCost)
      .sort((a,b)=>a.f-b.f || String(a.node).localeCompare(b.node));

    L=[...L1, ...L];

    steps.push({
      u,g,
      neighbors: neighbors.map(e=>`${e.v}(${e.w})`),
      L1: L1.map(x=>`${x.node}[g=${x.g},f=${x.f}]`),
      L: L.map(x=>x.node),
      costBound: bestCost
    });
  }

  return { found: bestCost<Infinity, bestCost: bestCost<Infinity?bestCost:null, path: bestPath, steps };
}

// Branch & Bound theo mô tả: danh sách L, cận cost, cắt khi f >= cost.
// f = g + h. Mỗi bản ghi step có L1 và L để đối chiếu.
// export function runBranchAndBound(adj, h, start, goal) {
//   let L = [{ node: start, g: 0, path: [start] }];
//   let bestCost = Infinity;
//   let bestPath = [];
//   const steps = [];

//   while (L.length) {
//     const cur = L.shift();           // lấy đầu danh sách
//     const u = cur.node;
//     const g = cur.g;

//     if (u === goal) {
//       if (g < bestCost) { bestCost = g; bestPath = cur.path; }
//       steps.push({
//         u, g, reachedGoal: true, costBound: bestCost,
//         neighbors: [],
//         L1: [],
//         L: L.map(x => `${x.node}`)
//       });
//       // không return; tiếp tục để cắt thêm bằng cận tốt hơn
//       continue;
//     }

//     const neighbors = adj[u] || [];
//     // sinh L1
//     const L1 = neighbors.map(({ v, w }) => {
//       const g2 = g + w;
//       const f2 = g2 + h[v];
//       return { node: v, g: g2, f: f2, path: [...cur.path, v] };
//     })
//     .filter(x => x.f < bestCost) // cắt nhánh
//     .sort((a, b) => a.f - b.f || String(a.node).localeCompare(b.node));

//     // đưa L1 lên đầu L
//     L = [...L1, ...L];

//     steps.push({
//       u, g,
//       neighbors: neighbors.map(e => `${e.v}(${e.w})`),
//       L1: L1.map(x => `${x.node}[g=${x.g},f=${x.f}]`),
//       L: L.map(x => `${x.node}`),
//       costBound: bestCost
//     });
//   }

//   return {
//     found: bestCost < Infinity,
//     bestCost: bestCost < Infinity ? bestCost : null,
//     path: bestPath,
//     steps
//   };
// }