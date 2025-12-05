/**
 * Hàm phân tích file text và chuyển thành danh sách kề (adjacency list)
 * @param {string} text - Nội dung file text được upload
 * @returns {object} - { graph, start, goal }
 */
export function parseGraph(text) {
    // Tách file thành từng dòng, loại bỏ khoảng trắng và dòng trống
    const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Khởi tạo đồ thị rỗng (adjacency list - danh sách kề)
    const graph = {};
    let start = null;  // Trạng thái bắt đầu
    let goal = null;   // Trạng thái đích (kết thúc)

    // Duyệt qua từng dòng để parse thông tin
    for (const line of lines) {
        // XỬ LÝ ĐỊNH DẠNG TIẾNG VIỆT: "Trạng thái đầu: A; Trạng thái kết thúc: G"
        // (cả hai thông tin trong 1 dòng, cách nhau bởi dấu chấm phẩy)
        if (line.includes('Trạng thái đầu:') && line.includes('Trạng thái kết thúc:')) {
            const parts = line.split(';');
            if (parts.length >= 2) {
                start = parts[0].split('Trạng thái đầu:')[1].trim();
                goal = parts[1].split('Trạng thái kết thúc:')[1].trim();
            }
        }
        // XỬ LÝ ĐỊNH DẠNG TIẾNG VIỆT: "Trạng thái đầu: A" (riêng lẻ)
        else if (line.includes('Trạng thái đầu:') && !line.includes('Trạng thái kết thúc:')) {
            start = line.split('Trạng thái đầu:')[1].trim();
        }
        // XỬ LÝ ĐỊNH DẠNG TIẾNG VIỆT: "Trạng thái kết thúc: G" (riêng lẻ)
        else if (line.includes('Trạng thái kết thúc:') && !line.includes('Trạng thái đầu:')) {
            goal = line.split('Trạng thái kết thúc:')[1].trim();
        }
        // XỬ LÝ ĐỊNH DẠNG TIẾNG ANH: "Start: A"
        else if (line.startsWith('Start:')) {
            start = line.split(':')[1].trim();
        }
        // XỬ LÝ ĐỊNH DẠNG TIẾNG ANH: "Goal: G"
        else if (line.startsWith('Goal:')) {
            goal = line.split(':')[1].trim();
        }
        // XỬ LÝ CÁC DÒNG MÔ TẢ ĐỒ THỊ: "A: B, C, D" (nút A có kề là B, C, D)
        else if (line.includes(':') && !line.includes('Trạng thái') && !line.startsWith('Start') && !line.startsWith('Goal')) {
            const [node, neighbors] = line.split(':');
            const nodeKey = node.trim();
            // Tách danh sách các nút kề, phân cách bởi dấu phẩy
            const neighborList = neighbors.trim()
                ? neighbors.split(',').map(n => n.trim())
                : [];
            // Lưu vào đồ thị dạng adjacency list
            graph[nodeKey] = neighborList;
        }
    }

    // TỰ ĐỘNG THÊM CÁC NÚT THIẾU:
    // Có trường hợp một nút xuất hiện trong danh sách kề nhưng không được khai báo
    // Ví dụ: "A: B, C" nhưng không có dòng "B:" hoặc "C:"
    const allMentionedNodes = new Set();

    // Thu thập tất cả nút được khai báo (keys trong graph)
    Object.keys(graph).forEach(node => allMentionedNodes.add(node));

    // Thu thập tất cả nút xuất hiện trong danh sách kề (values)
    Object.values(graph).forEach(neighbors => {
        neighbors.forEach(neighbor => allMentionedNodes.add(neighbor));
    });

    // Thêm các nút thiếu với danh sách kề rỗng (nút lá hoặc nút đích)
    allMentionedNodes.forEach(node => {
        if (!(node in graph)) {
            graph[node] = [];
        }
    });

    return { graph, start, goal };
}

/**
 * Hàm chạy thuật toán Tìm Kiếm Theo Chiều Sâu (Depth-First Search - DFS)
 * @param {object} graph - Đồ thị dạng danh sách kề (adjacency list)
 * @param {string} start - Nút bắt đầu
 * @param {string} goal - Nút đích
 * @returns {object} - { steps, path, found }
 */
export function runDFS(graph, start, goal) {
    // Mảng lưu các bước thực hiện (để hiển thị trên bảng)
    const steps = [];

    // Set lưu các nút đã thăm (visited) - dùng Set để tránh thăm lại
    const visited = new Set();

    // STACK (Ngăn xếp) - CẤU TRÚC DỮ LIỆU CHÍNH CỦA DFS
    // DFS dùng STACK (LIFO - Last In First Out) khác với BFS dùng QUEUE (FIFO)
    const stack = [start];

    // Map lưu nút cha (parent) để truy vết đường đi sau khi tìm thấy đích
    const parent = new Map();

    let stepCount = 0;  // Đếm số bước
    let found = false;   // Cờ đánh dấu đã tìm thấy đích chưa

    // VÒNG LẶP CHÍNH: Lặp cho đến khi stack rỗng HOẶC tìm thấy đích
    while (stack.length > 0 && !found) {
        stepCount++;

        // BƯỚC 2.2: Lấy nút u ở ĐẦU danh sách L (stack.pop() - LIFO)
        // ĐÂY LÀ ĐIỂM KHÁC BIỆT CHÍNH: DFS dùng POP (lấy cuối), BFS dùng SHIFT (lấy đầu)
        const current = stack.pop();

        // Bỏ qua nếu nút này đã được thăm (tránh lặp vô hạn)
        if (visited.has(current)) {
            continue;
        }

        // ĐÁNH DẤU ĐÃ THĂM: Thêm nút hiện tại vào tập visited
        visited.add(current);

        // Lấy danh sách các nút kề (neighbors/trạng thái kế)
        const neighbors = graph[current] || [];
        const unvisitedNeighbors = neighbors.filter(n => !visited.has(n));

        // BƯỚC 2.3: Kiểm tra nếu u là trạng thái kết thúc
        const isGoal = current === goal;

        // GHI NHẬN BƯỚC THỰC HIỆN (để hiển thị lên bảng như slide thầy)
        steps.push({
            step: stepCount,           // Số bước
            current: current,          // Phát triển TT (nút đang xét)
            neighbors: neighbors,      // Trạng thái kế (các nút kề)
            stack: [...stack],         // Danh sách L (stack hiện tại - copy để tránh reference)
            visited: Array.from(visited), // Danh sách đã thăm
            isGoal: isGoal            // Trạng thái: đạt đích hay chưa
        });

        // Nếu đạt đích thì dừng (thông báo tìm kiếm thành công; stop;)
        if (isGoal) {
            found = true;
            break;
        }

        // BƯỚC 2.4: Duyệt qua các nút kề v của u
        // ĐẶT VÀO ĐẦU DANH SÁCH L (push vào stack)
        // QUAN TRỌNG: Duyệt NGƯỢC (từ cuối lên đầu) để giữ thứ tự từ trái sang phải
        // Vì stack là LIFO nên phải reverse để khi pop ra đúng thứ tự
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];

            // Chỉ thêm vào stack nếu chưa thăm
            if (!visited.has(neighbor)) {
                stack.push(neighbor);

                // Lưu nút cha để sau này truy vết đường đi (father(v) = u)
                if (!parent.has(neighbor)) {
                    parent.set(neighbor, current);
                }
            }
        }
    }

    // TRUY VẾT ĐƯỜNG ĐI (backtracking): Dùng parent map để tìm đường từ start đến goal
    let path = [];
    if (found) {
        let node = goal;
        // Đi ngược từ goal về start thông qua parent
        while (node !== undefined) {
            path.unshift(node);  // Thêm vào đầu mảng
            node = parent.get(node);
        }
    }

    // Trả về: các bước thực hiện, đường đi, và có tìm thấy hay không
    return { steps, path, found };
}

/**
 * Hàm kiểm tra tính hợp lệ của đồ thị
 * @param {object} graph - Danh sách kề
 * @param {string} start - Nút bắt đầu
 * @param {string} goal - Nút đích
 * @returns {object} - { valid, error }
 */
export function validateGraph(graph, start, goal) {
    // Kiểm tra đồ thị có rỗng không
    if (!graph || Object.keys(graph).length === 0) {
        return { valid: false, error: 'Graph is empty or invalid' };
    }

    // Kiểm tra có chỉ định nút bắt đầu không
    if (!start) {
        return { valid: false, error: 'Start node not specified' };
    }

    // Kiểm tra có chỉ định nút đích không
    if (!goal) {
        return { valid: false, error: 'Goal node not specified' };
    }

    // Kiểm tra nút bắt đầu có tồn tại trong đồ thị không
    if (!(start in graph)) {
        return { valid: false, error: `Start node '${start}' not found in graph` };
    }

    // Kiểm tra nút đích có tồn tại trong đồ thị không
    if (!(goal in graph)) {
        return { valid: false, error: `Goal node '${goal}' not found in graph` };
    }

    // Tất cả điều kiện đều thỏa mãn
    return { valid: true, error: null };
}