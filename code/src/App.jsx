import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FileUpload from './components/FileUpload';
import DFSTable from './components/DFSTable';
import PathDisplay from './components/PathDisplay';
import LanguageSwitcher from './components/LanguageSwitcher';
import { parseGraph, runDFS, validateGraph } from './utils/dfs';

function App() {
    const { t } = useTranslation();
    const [graphData, setGraphData] = useState(null);
    const [dfsResults, setDfsResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = async (fileContent) => {
        setIsLoading(true);
        setError(null);
        setDfsResults(null);

        try {
            // Parse the graph data
            const { graph, start, goal } = parseGraph(fileContent);

            // Log parsed data for debugging
            console.log('File Content:', fileContent);
            console.log('Parsed Graph Data:', { graph, start, goal });
            console.log('Graph keys:', Object.keys(graph));

            // Validate the parsed data
            const validation = validateGraph(graph, start, goal);
            if (!validation.valid) {
                // Enhanced error message with debugging info
                const debugInfo = `
Debug Info:
- Graph nodes: ${Object.keys(graph).join(', ')}
- Start node: "${start}"
- Goal node: "${goal}"
- Graph has ${Object.keys(graph).length} nodes
        `;
                throw new Error(validation.error + '\n' + debugInfo);
            }

            setGraphData({ graph, start, goal });

        } catch (err) {
            setError(err.message);
            console.error('Error parsing graph:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunDFS = async () => {
        if (!graphData) return;

        setIsLoading(true);
        setError(null);

        try {
            // Simulate some processing time for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            const { graph, start, goal } = graphData;
            const results = runDFS(graph, start, goal);

            // Log results for debugging
            console.log('DFS Results:', results);

            setDfsResults(results);
        } catch (err) {
            setError(err.message);
            console.error('Error running DFS:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setGraphData(null);
        setDfsResults(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {t('header.title')}
                                </h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    {t('header.subtitle')}
                                </p>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-red-800">{t('errors.error')}</h3>
                                <div className="mt-1 text-sm text-red-700">
                                    <pre className="whitespace-pre-wrap font-mono text-xs">{error}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Upload */}
                <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

                {/* Graph Information */}
                {graphData && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{t('graphInfo.title')}</h2>
                            <button
                                onClick={handleReset}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                {t('graphInfo.reset')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">{t('graphInfo.startNode')}</span>
                                <span className="ml-2 text-blue-900 font-semibold">{graphData.start}</span>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-green-700">{t('graphInfo.goalNode')}</span>
                                <span className="ml-2 text-green-900 font-semibold">{graphData.goal}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">{t('graphInfo.totalNodes')}</span>
                                <span className="ml-2 text-gray-900 font-semibold">{Object.keys(graphData.graph).length}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('graphInfo.graphStructure')}</h3>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <pre className="text-xs text-gray-600 font-mono">
                                    {Object.entries(graphData.graph)
                                        .map(([node, neighbors]) => `${node}: ${neighbors.join(', ') || t('graphInfo.noNeighbors')}`)
                                        .join('\n')}
                                </pre>
                            </div>
                        </div>

                        <button
                            onClick={handleRunDFS}
                            disabled={isLoading}
                            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('graphInfo.runningDFS')}
                                </span>
                            ) : (
                                t('graphInfo.runDFS')
                            )}
                        </button>
                    </div>
                )}

                {/* DFS Results */}
                <DFSTable steps={dfsResults?.steps} isLoading={isLoading && graphData} />

                {dfsResults && (
                    <PathDisplay
                        path={dfsResults.path}
                        found={dfsResults.found}
                        start={graphData?.start}
                        goal={graphData?.goal}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500">
                        {t('footer.text')}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;