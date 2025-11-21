/**
 * Parse graph text into adjacency list format
 * @param {string} text - Raw text from uploaded file
 * @returns {object} - { graph, start, goal }
 */
export function parseGraph(text) {
    const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const graph = {};
    let start = null;
    let goal = null;

    for (const line of lines) {
        // Handle combined Vietnamese format first (both start and goal in one line)
        if (line.includes('Trạng thái đầu:') && line.includes('Trạng thái kết thúc:')) {
            const parts = line.split(';');
            if (parts.length >= 2) {
                start = parts[0].split('Trạng thái đầu:')[1].trim();
                goal = parts[1].split('Trạng thái kết thúc:')[1].trim();
            }
        }
        // Handle individual Vietnamese format
        else if (line.includes('Trạng thái đầu:') && !line.includes('Trạng thái kết thúc:')) {
            start = line.split('Trạng thái đầu:')[1].trim();
        } else if (line.includes('Trạng thái kết thúc:') && !line.includes('Trạng thái đầu:')) {
            goal = line.split('Trạng thái kết thúc:')[1].trim();
        }
        // Handle English format
        else if (line.startsWith('Start:')) {
            start = line.split(':')[1].trim();
        } else if (line.startsWith('Goal:')) {
            goal = line.split(':')[1].trim();
        }
        // Handle graph adjacency lines
        else if (line.includes(':') && !line.includes('Trạng thái') && !line.startsWith('Start') && !line.startsWith('Goal')) {
            const [node, neighbors] = line.split(':');
            const nodeKey = node.trim();
            const neighborList = neighbors.trim()
                ? neighbors.split(',').map(n => n.trim())
                : [];
            graph[nodeKey] = neighborList;
        }
    }

    // Auto-add missing nodes that appear as neighbors but not as keys
    const allMentionedNodes = new Set();
    Object.keys(graph).forEach(node => allMentionedNodes.add(node));
    Object.values(graph).forEach(neighbors => {
        neighbors.forEach(neighbor => allMentionedNodes.add(neighbor));
    });

    // Add any missing nodes with empty neighbor lists
    allMentionedNodes.forEach(node => {
        if (!(node in graph)) {
            graph[node] = [];
        }
    });

    return { graph, start, goal };
}

/**
 * Run Depth-First Search algorithm
 * @param {object} graph - Adjacency list representation
 * @param {string} start - Start node
 * @param {string} goal - Goal node
 * @returns {object} - { steps, path, found }
 */
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

        // Record current step
        steps.push({
            step: stepCount,
            current: current,
            stack: [...stack],
            visited: Array.from(visited)
        });

        // Check if we reached the goal
        if (current === goal) {
            found = true;
            break;
        }

        // Add neighbors to stack (in reverse order to maintain left-to-right processing)
        const neighbors = graph[current] || [];
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

    // Reconstruct path if goal was found
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

/**
 * Validate graph data
 * @param {object} graph - Adjacency list
 * @param {string} start - Start node
 * @param {string} goal - Goal node
 * @returns {object} - { valid, error }
 */
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