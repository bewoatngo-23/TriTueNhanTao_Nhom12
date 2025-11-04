# DFS Visualization - ReactJS Application

A single-page React application that visualizes the Depth-First Search (DFS) algorithm by reading graph data from a text file and displaying the search process step by step.

## 🌍 **NEW: Multi-language Support (i18n)**

- **🇺🇸 English**: Full English interface
- **🇻🇳 Tiếng Việt**: Giao diện tiếng Việt hoàn chỉnh
- **Switch Languages**: Click flag buttons in the header to change language
- **Auto-detection**: Automatically detects browser language
- **Persistent**: Language preference saved in localStorage

## Features

- 📁 **File Upload**: Upload `.txt` files containing graph data
- 🔍 **DFS Algorithm**: Run Depth-First Search with step-by-step visualization
- 📊 **Interactive Table**: View each step showing current node, stack, and visited nodes
- 🎯 **Path Display**: See the final path from start to goal node
- 🎨 **Clean UI**: Modern design with Tailwind CSS
- 🌍 **Multi-language**: Vietnamese and English support
- ⚡ **Real-time Processing**: All computation happens in the browser

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   - Navigate to `http://localhost:3000`

## Graph File Format

Create a `.txt` file with the following format:

```
A: B,C,D
B: I,G
C: F,E
D: F
E: G,K
F: K
I: G
K:
Start: A
Goal: G
```

### Format Rules:
- Each line represents a node and its neighbors: `NodeName: Neighbor1,Neighbor2,Neighbor3`
- Empty neighbors are allowed: `NodeName:`
- Must include `Start: NodeName` to specify the starting node
- Must include `Goal: NodeName` to specify the target node
- Node names are case-sensitive

## Usage

1. **Upload Graph File**
   - Click "Choose File" button
   - Select your `.txt` file with graph data
   - The app will parse and validate the graph

2. **Run DFS Algorithm**
   - Click "Run Depth-First Search" button
   - Watch the step-by-step execution in the table
   - View the final path result

3. **Interpret Results**
   - **Steps Table**: Shows each iteration with current node, stack state, and visited nodes
   - **Path Display**: Shows the final path if one exists, or indicates no path found

## Example Output

The DFS algorithm will produce output like:

| Step | Current Node | Stack | Visited |
|------|-------------|-------|---------|
| 1    | A           | []    | [A]     |
| 2    | B           | [C,D] | [A,B]   |
| 3    | I           | [G,C,D] | [A,B,I] |
| 4    | G           | [C,D] | [A,B,I,G] |

**Final Result**: ✅ Path found: A → B → I → G

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── components/
│   ├── FileUpload.jsx      # File upload and parsing
│   ├── DFSTable.jsx        # Steps visualization table
│   └── PathDisplay.jsx     # Final path display
├── utils/
│   └── dfs.js              # DFS algorithm and graph utilities
├── index.js                # React app entry point
└── index.css               # Global styles with Tailwind
```

## Algorithm Details

### Depth-First Search Implementation
- Uses a **stack** data structure (LIFO - Last In, First Out)
- Explores as far as possible along each branch before backtracking
- Maintains a **visited set** to avoid cycles
- Records each step for visualization

### Key Functions
- `parseGraph(text)`: Converts text file to adjacency list
- `runDFS(graph, start, goal)`: Executes DFS algorithm
- `validateGraph(graph, start, goal)`: Ensures valid input data

## Dependencies

- **React 18**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework
- **react-i18next**: Internationalization framework
- **i18next**: Core internationalization library
- **File Reader API**: For reading uploaded files

## Language Files

Located in `src/locales/`:
- `en.json`: English translations
- `vi.json`: Vietnamese translations

## Project Structure

```
src/
├── App.jsx                 # Main application component (with i18n)
├── components/
│   ├── FileUpload.jsx      # File upload and parsing (with i18n)
│   ├── DFSTable.jsx        # Steps visualization table (with i18n)
│   ├── PathDisplay.jsx     # Final path display (with i18n)
│   └── LanguageSwitcher.jsx # Language switching component (NEW)
├── locales/                # Translation files (NEW)
│   ├── en.json             # English translations
│   └── vi.json             # Vietnamese translations
├── utils/
│   └── dfs.js              # DFS algorithm and graph utilities
├── i18n.js                 # i18n configuration (NEW)
├── index.js                # React app entry point (updated)
└── index.css               # Global styles with Tailwind
```