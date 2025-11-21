// Test script để debug parsing
import { parseGraph } from './src/utils/dfs.js';

const testContent = `A: B,C,D
B: I,G
C: F,E
D: F
E: G,K
F: K
I: G
K:
Trạng thái đầu: A; Trạng thái kết thúc: G`;

console.log('Testing parseGraph...');
const result = parseGraph(testContent);
console.log('Result:', result);
console.log('Start:', result.start);
console.log('Goal:', result.goal);
console.log('Graph:', result.graph);