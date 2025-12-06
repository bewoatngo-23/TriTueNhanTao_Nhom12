function makeErr(code, ctx = {}) {
    const e = new Error(code);
    e.name = 'HCParseError';
    e.code = code;
    e.ctx = ctx;
    return e;
}

export function parseGraphHC(text) {
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
    const nodeRe = /^([A-Za-z0-9_]+)\s*:\s*([^|#]*)\|\s*h\s*=\s*([+-]?\d+(?:\.\d+)?)/i;

    const startRes = [
        /START\s*=\s*([A-Za-z0-9_]+)/i, /Start\s*:\s*([A-Za-z0-9_]+)/i,
        /Trạng\s*thái\s*đầu\s*:\s*([A-Za-z0-9_]+)/i, /Bắt\s+đầu\s*:\s*([A-Za-z0-9_]+)/i
    ];
    const goalRes = [
        /GOAL\s*=\s*([A-Za-z0-9_]+)/i, /Goal\s*:\s*([A-Za-z0-9_]+)/i,
        /Trạng\s*thái\s*kết\s*thúc\s*:\s*([A-Za-z0-9_]+)/i, /Kết\s+thúc\s*:\s*([A-Za-z0-9_]+)/i
    ];

    let start = null, goal = null;
    const graph = {};
    const h = {};

    for (const line of lines) {
        const m = line.match(nodeRe);
        if (m) {
            const u = m[1];
            const nbr = (m[2] || '').trim();
            h[u] = parseFloat(m[3]);
            const nbrList = nbr ? nbr.split(',').map(s => s.trim()).filter(Boolean) : [];
            graph[u] = nbrList;
            continue;
        }
        if (!start) {
            for (const re of startRes) { const ms = line.match(re); if (ms) { start = ms[1]; break; } }
        }
        if (!goal) {
            for (const re of goalRes) { const mg = line.match(re); if (mg) { goal = mg[1]; break; } }
        }
    }

    if (!start) throw makeErr('HC_ERR_MISSING_START');
    if (!goal) throw makeErr('HC_ERR_MISSING_GOAL');
    if (!graph[start]) throw makeErr('HC_ERR_START_NOT_IN_GRAPH', { start });
    if (h[start] === undefined) throw makeErr('HC_ERR_MISSING_H_START', { start });
    if (h[goal] === undefined) throw makeErr('HC_ERR_MISSING_H_GOAL', { goal });

    for (const [u, vs] of Object.entries(graph)) {
        for (const v of vs) {
            if (h[v] === undefined) throw makeErr('HC_ERR_MISSING_H_NODE', { v });
            if (!graph[v]) graph[v] = [];
        }
    }
    return { graph, h, start, goal };
}

export function runHillClimbing(graph, h, start, goal) {
    let open = [{ node: start, h: h[start], order: 0 }];
    const closed = new Set();
    const parent = new Map();
    const steps = [];
    let orderCounter = 1;

    steps.push({
        current: null,
        h: null,
        neighbors: [],
        chosen: null,
        L1: [],
        L: [`${start}-${h[start]}`]
    });

    while (open.length > 0) {
        const current = open.shift();
        const u = current.node;
        
        closed.add(u);

        if (u === goal) {
            const path = [];
            let curr = goal;
            while (curr) {
                path.push(curr);
                curr = parent.get(curr);
            }
            path.reverse();

            steps.push({
                current: u, h: h[u],
                neighbors: ['TTKT-DỪNG'], chosen: null, L1: [], L: []
            });
            return { found: true, path, steps };
        }

        const neighbors = graph[u] ?? [];
        let L1_temp = [];
        let neighbors_L1_display = [];
        const L_old_for_display = [...open];

        for (const v of neighbors) {
            const isClosed = closed.has(v);
            const isOpen = open.some(item => item.node === v);

            if (!isClosed && !isOpen) {
                L1_temp.push({ node: v, h: h[v], order: orderCounter++ });
                parent.set(v, u);
                neighbors_L1_display.push(`${v}-${h[v]}`);
            }
        }

        L1_temp.sort((a, b) => a.h - b.h || String(a.node).localeCompare(String(b.node)));

        open = [...L1_temp, ...open];

        const open_after_display = open.map(n => `${n.node}-${n.h}`);

        steps.push({
            current: u,
            h: h[u],
            neighbors: neighbors_L1_display,
            chosen: open[0] ? `${open[0].node}-${open[0].h}` : null,
            L1: L1_temp.map(n => `${n.node}-${n.h}`),
            L: open_after_display
        });

        if (steps.length > 100) return { found: false, path: [], steps };
    }

    return { found: false, path: [], steps };
}

export function exportHCToText(steps, path, found, start, goal) {
    let output = '';
    const safePath = path || [];
    const safeStart = start || '?';
    const safeGoal = goal || '?';

    output += '='.repeat(80) + '\n';
    output += 'KẾT QUẢ THUẬT TOÁN LEO ĐỒI (HILL CLIMBING)\n';
    output += '='.repeat(80) + '\n\n';

    output += `Trạng thái đầu: ${safeStart}\n`;
    output += `Trạng thái kết thúc: ${safeGoal}\n\n`;

    output += '='.repeat(80) + '\n';
    output += 'CÁC BƯỚC THỰC HIỆN THUẬT TOÁN\n';
    output += '='.repeat(80) + '\n\n';

    const maxCurrentLen = Math.max(...steps.map(s => (s.current || '').length), 10);
    const maxNeighborsLen = Math.max(...steps.map(s => s.neighbors.join(', ').length), 15);
    const maxL1Len = Math.max(...steps.map(s => s.L1.join(', ').length), 15);
    const maxLLen = Math.max(...steps.map(s => s.L.join(', ').length), 15);
    const maxChosenLen = Math.max(...steps.map(s => (s.chosen || '').length), 10);

    output += `${'Bước'.padEnd(6)} | `;
    output += `${'TT hiện tại'.padEnd(maxCurrentLen)} | `;
    output += `${'h(n)'.padEnd(6)} | `;
    output += `${'TT kế'.padEnd(maxNeighborsLen)} | `;
    output += `${'L1'.padEnd(maxL1Len)} | `;
    output += `${'L'.padEnd(maxLLen)} | `;
    output += `Chọn\n`;

    output += '-'.repeat(6) + '-+-';
    output += '-'.repeat(maxCurrentLen) + '-+-';
    output += '-'.repeat(6) + '-+-';
    output += '-'.repeat(maxNeighborsLen) + '-+-';
    output += '-'.repeat(maxL1Len) + '-+-';
    output += '-'.repeat(maxLLen) + '-+-';
    output += '-'.repeat(maxChosenLen) + '\n';

    steps.forEach((step, index) => {
        const stepNum = (index + 1).toString().padEnd(6);
        const current = (step.current || '').padEnd(maxCurrentLen);
        const hVal = (step.h !== null && step.h !== undefined ? step.h.toString() : '').padEnd(6);
        const neighbors = step.neighbors.join(', ').padEnd(maxNeighborsLen);
        const l1 = step.L1.join(', ').padEnd(maxL1Len);
        const l = step.L.join(', ').padEnd(maxLLen);
        const chosen = (step.chosen || '').padEnd(maxChosenLen);

        output += `${stepNum} | ${current} | ${hVal} | ${neighbors} | ${l1} | ${l} | ${chosen}\n`;
    });

    output += '\n' + '='.repeat(80) + '\n';
    output += 'KẾT QUẢ\n';
    output += '='.repeat(80) + '\n\n';

    if (found) {
        output += `Tìm thấy đường đi từ ${safeStart} đến ${safeGoal}!\n\n`;
        output += `Đường đi: ${safePath.join(' => ')}\n`;
        output += `Độ dài đường đi: ${safePath.length} trạng thái\n`;
        output += `Số bước thực hiện: ${steps.length} bước\n`;
    } else {
        output += `Không tìm thấy đường đi từ ${safeStart} đến ${safeGoal}!\n`;
    }

    output += '\n' + '='.repeat(80) + '\n';

    return output;
}