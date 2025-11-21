// utils/hc.js

function makeErr(code, ctx = {}) { 
    const e = new Error(code); 
    e.name = 'HCParseError'; 
    e.code = code; 
    e.ctx = ctx; 
    return e; 
}

export function parseGraphHC(text) {
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
    const nodeRe = /^([A-Za-z0-9_]+)\s*:\s*([^|#]*)\|\s*h\s*=\s*([+-]?\d+(?:\.\d+)?)$/i;

    const startRes = [
        /^START\s*=\s*([A-Za-z0-9_]+)$/i, /^Start\s*:\s*([A-Za-z0-9_]+)$/i,
        /^Trạng\s+thái\s+đầu\s*:\s*([A-Za-z0-9_]+)$/i, /^Bắt\s+đầu\s*:\s*([A-Za-z0-9_]+)$/i
    ];
    const goalRes = [
        /^GOAL\s*=\s*([A-Za-z0-9_]+)$/i, /^Goal\s*:\s*([A-Za-z0-9_]+)$/i,
        /^Trạng\s*thái\s*kết\s*thúc\s*:\s*([A-Za-z0-9_]+)$/i, 
        /^Kết\s+thúc\s*:\s*([A-Za-z0-9_]+)$/i
    ];

    let start=null, goal=null;
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
        for (const re of startRes) { const ms=line.match(re); if (ms){ start=ms[1]; break; } }
        for (const re of goalRes)  { const mg=line.match(re); if (mg){ goal =mg[1]; break; } }
    }

    if (!start) throw makeErr('HC_ERR_MISSING_START');
    if (!goal)  throw makeErr('HC_ERR_MISSING_GOAL');
    if (!graph[start]) throw makeErr('HC_ERR_START_NOT_IN_GRAPH',{start});
    if (h[start]===undefined) throw makeErr('HC_ERR_MISSING_H_START',{start});
    if (h[goal]===undefined)  throw makeErr('HC_ERR_MISSING_H_GOAL',{goal});

    for (const [u, vs] of Object.entries(graph)) {
        for (const v of vs) {
            if (h[v]===undefined) throw makeErr('HC_ERR_MISSING_H_NODE',{v});
            if (!graph[v]) graph[v] = []; 
        }
    }
    return { graph, h, start, goal };
}

/**
 * THUẬT TOÁN: A -> D -> I -> B
 * Logic: L = L1(sorted) + L_old.
 * QUAN TRỌNG: Không sắp xếp lại toàn bộ L sau khi hợp nhất.
 */
export function runHillClimbing(graph, h, start, goal) {
    // Open list (L)
    let open = [{ node: start, h: h[start] }]; 
    
    const parent = new Map(); 
    const steps = []; 

    // CHÚ Ý: Đã xóa hàm sortOpen() toàn cục vì nó làm đảo lộn thứ tự ưu tiên của L1

    while (open.length > 0) {
        // Lưu trạng thái L trước khi lấy phần tử đầu
        const open_before_step = open.map(n => `${n.node}-${n.h}`);

        // 2.2. Loại trạng thái u ở ĐẦU danh sách L (Luôn lấy đầu, không sort lại)
        const current = open.shift();
        const u = current.node;
        
        // 2.3. Kiểm tra mục tiêu
        if (u === goal) {
            const path = [];
            let curr = goal;
            while (curr) {
                path.push(curr);
                curr = parent.get(curr);
            }
            path.reverse();
            
            steps.push({ current: u, h: h[u], neighbors: [], chosen: null, L1: [], L: [], open_before: open_before_step, noteKey: 'note_goal' });
            return { found: true, path, steps };
        }

        // L1
        const neighbors = graph[u] ?? [];
        let L1_temp = []; 
        let neighbors_L1_display = []; 
        const L_old_for_display = [...open]; 

        for (const v of neighbors) {
            L1_temp.push({ node: v, h: h[v] });
            parent.set(v, u);
            neighbors_L1_display.push(`${v}-${h[v]}`);
        }
        
        // CHỈ SẮP XẾP L1 (nhóm con vừa sinh ra) theo h tăng dần
        // Nếu h bằng nhau, xếp theo alphabet
        L1_temp.sort((a, b) => a.h - b.h || String(a.node).localeCompare(String(b.node)));

        // 2.5. Hợp nhất: L = L1_temp (đã sắp xếp) + L_old
        // Đặt L1 lên đầu danh sách.
        open = [...L1_temp, ...open]; 
        
        // QUAN TRỌNG: KHÔNG SẮP XẾP LẠI `open` Ở ĐÂY.
        // Điều này đảm bảo I-8 (ở đầu L1) vẫn đứng trước E-7 (ở trong L cũ).

        const open_after_display = open.map(n => `${n.node}-${n.h}`);

        steps.push({
            current: u, 
            h: h[u],
            neighbors: neighbors_L1_display, 
            chosen: open[0] ? `${open[0].node}-${open[0].h}` : null, // Node đầu tiên của danh sách mới sẽ được chọn tiếp theo
            L1: L1_temp.map(n => `${n.node}-${n.h}`), 
            L: open_after_display, 
            open_before: open_before_step, 
            noteKey: 'note_progress'
        });
        
        if (steps.length > 100) return { found: false, path: [], steps, noteKey: 'note_fail_too_many_steps' };
    }

    return { found: false, path: [], steps, noteKey: 'note_fail_empty_open_list' };
}