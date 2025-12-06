export function parseGraph(text) {
    const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const graph = {};
    let start = null;
    let goal = null;

    for (const line of lines) {
        if (line.includes('Trạng thái đầu:') && line.includes('Trạng thái kết thúc:')) {
            const parts = line.split(';');
            if (parts.length >= 2) {
                start = parts[0].split('Trạng thái đầu:')[1].trim();
                goal = parts[1].split('Trạng thái kết thúc:')[1].trim();
            }
        }
        else if (line.includes('Trạng thái đầu:') && !line.includes('Trạng thái kết thúc:')) {
            start = line.split('Trạng thái đầu:')[1].trim();
        }
        else if (line.includes('Trạng thái kết thúc:') && !line.includes('Trạng thái đầu:')) {
            goal = line.split('Trạng thái kết thúc:')[1].trim();
        }
        else if (line.startsWith('Start:')) {
            start = line.split(':')[1].trim();
        }
        else if (line.startsWith('Goal:')) {
            goal = line.split(':')[1].trim();
        }
        else if (line.includes(':') && !line.includes('Trạng thái') && !line.startsWith('Start') && !line.startsWith('Goal')) {
            const [node, neighbors] = line.split(':');
            const nodeKey = node.trim();
            const neighborList = neighbors.trim()
                ? neighbors.split(',').map(n => n.trim())
                : [];
            graph[nodeKey] = neighborList;
        }
    }

    const allMentionedNodes = new Set();

    Object.keys(graph).forEach(node => allMentionedNodes.add(node));

    Object.values(graph).forEach(neighbors => {
        neighbors.forEach(neighbor => allMentionedNodes.add(neighbor));
    });

    allMentionedNodes.forEach(node => {
        if (!(node in graph)) {
            graph[node] = [];
        }
    });

    return { graph, start, goal };
}

export function runDFS(graph, start, goal) {
    const steps = [];
    const visited = new Set();
    const stack = [start];
    const parent = new Map();

    let stepCount = 0;
    let found = false;

    while (stack.length > 0 && !found) {
        stepCount++;

        const current = stack.pop();

        if (visited.has(current)) {
            continue;
        }

        visited.add(current);

        const neighbors = graph[current] || [];
        const unvisitedNeighbors = neighbors.filter(n => !visited.has(n));

        const isGoal = current === goal;

        steps.push({
            step: stepCount,
            current: current,
            neighbors: neighbors,
            stack: [...stack],
            visited: Array.from(visited),
            isGoal: isGoal
        });

        if (isGoal) {
            found = true;
            break;
        }

        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];

            if (!visited.has(neighbor)) {
                stack.push(neighbor);

                if (!parent.has(neighbor)) {
                    parent.set(neighbor, current);
                }
            }
        }
    }

    let path = [];
    if (found) {
        let node = goal;
        while (node !== undefined) {
            path.unshift(node);
            node = parent.get(node);
        }
    }

    return { steps, path, found };
}

export function validateGraph(graph, start, goal) {
    if (!graph || Object.keys(graph).length === 0) {
        return { valid: false, error: 'Graph is empty or invalid' };
    }

    if (!start) {
        return { valid: false, error: 'Start node not specified' };
    }

    if (!goal) {
        return { valid: false, error: 'Goal node not specified' };
    }

    if (!(start in graph)) {
        return { valid: false, error: `Start node '${start}' not found in graph` };
    }

    if (!(goal in graph)) {
        return { valid: false, error: `Goal node '${goal}' not found in graph` };
    }

    return { valid: true, error: null };
}

export function exportDFSToText(steps, path, found, start, goal) {
    let output = '';

    output += '='.repeat(80) + '\n';
    output += 'KẾT QUẢ THUẬT TOÁN TÌM KIẾM THEO CHIỀU SÂU (DFS)\n';
    output += '='.repeat(80) + '\n\n';

    output += `Trạng thái đầu: ${start}\n`;
    output += `Trạng thái kết thúc: ${goal}\n\n`;

    output += '='.repeat(80) + '\n';
    output += 'CÁC BƯỚC THỰC HIỆN THUẬT TOÁN\n';
    output += '='.repeat(80) + '\n\n';

    const maxCurrentLen = Math.max(...steps.map(s => s.current.length), 10);
    const maxNeighborsLen = Math.max(...steps.map(s => s.neighbors.join(', ').length), 15);
    const maxStackLen = Math.max(...steps.map(s => s.stack.join(', ').length), 15);
    const maxVisitedLen = Math.max(...steps.map(s => s.visited.join(', ').length), 15);

    output += `${'Bước'.padEnd(6)} | `;
    output += `${'Phát triển TT'.padEnd(maxCurrentLen)} | `;
    output += `${'Trạng thái kế'.padEnd(maxNeighborsLen)} | `;
    output += `${'Danh sách L'.padEnd(maxStackLen)} | `;
    output += `${'Đã thăm'.padEnd(maxVisitedLen)} | `;
    output += `Trạng thái\n`;

    output += '-'.repeat(6) + '-+-';
    output += '-'.repeat(maxCurrentLen) + '-+-';
    output += '-'.repeat(maxNeighborsLen) + '-+-';
    output += '-'.repeat(maxStackLen) + '-+-';
    output += '-'.repeat(maxVisitedLen) + '-+-';
    output += '-'.repeat(15) + '\n';

    steps.forEach((step, index) => {
        const stepNum = (index + 1).toString().padEnd(6);
        const current = step.current.padEnd(maxCurrentLen);
        const neighbors = step.neighbors.join(', ').padEnd(maxNeighborsLen);
        const stack = step.stack.join(', ').padEnd(maxStackLen);
        const visited = step.visited.join(', ').padEnd(maxVisitedLen);
        const status = step.isGoal ? 'TTKT-DỪNG' : 'Đang khám phá';

        output += `${stepNum} | ${current} | ${neighbors} | ${stack} | ${visited} | ${status}\n`;
    });

    output += '\n' + '='.repeat(80) + '\n';
    output += 'KẾT QUẢ\n';
    output += '='.repeat(80) + '\n\n';

    if (found) {
        output += `Tìm thấy đường đi từ ${start} đến ${goal}!\n\n`;
        output += `Đường đi: ${path.join(' => ')}\n`;
        output += `Độ dài đường đi: ${path.length} trạng thái\n`;
        output += `Số bước thực hiện: ${steps.length} bước\n`;
    } else {
        output += `Không tìm thấy đường đi từ ${start} đến ${goal}!\n`;
    }

    output += '\n' + '='.repeat(80) + '\n';

    return output;
}