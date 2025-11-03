import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FileUpload from './components/FileUpload';
import DFSTable from './components/DFSTable';
import BNBTable from './components/BNBTable';
import PathDisplay from './components/PathDisplay';
import LanguageSwitcher from './components/LanguageSwitcher';

import { parseGraph, runDFS, validateGraph } from './utils/dfs';
import { parseGraphBNB, runBranchAndBound } from './utils/bnb';

function App() {
    const { t } = useTranslation();

    // 'DFS' | 'BNB'
    const [mode, setMode] = useState('DFS');

    // DFS state
    const [graphData, setGraphData] = useState(null);
    const [dfsResults, setDfsResults] = useState(null);

    // BNB state
    const [bnbData, setBnbData] = useState(null);
    const [bnbResults, setBnbResults] = useState(null);

    // common
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // map lỗi BNB sang i18n
    const mapBNBErr = (err) => {
        if (err?.name === 'BNBParseError' && err.code) {
            return t(`errors.${err.code}`, err.ctx || {});
        }
        return t('errors.BNB_ERR_GENERIC');
    };

    const handleTabChange = (next) => {
        setMode(next);
        // reset toàn bộ khi đổi tab
        setGraphData(null);
        setDfsResults(null);
        setBnbData(null);
        setBnbResults(null);
        setError(null);
    };

    const handleFileUpload = async (fileContent) => {
        setIsLoading(true);
        setError(null);
        setDfsResults(null);
        setBnbResults(null);

        try {
            if (mode === 'DFS') {
                const { graph, start, goal } = parseGraph(fileContent);
                const validation = validateGraph(graph, start, goal);
                if (!validation.valid) {
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
            } else {
                const { adj, h, start, goal } = parseGraphBNB(fileContent);
                setBnbData({ adj, h, start, goal });
            }
        } catch (e) {
            setError(mode === 'BNB' ? mapBNBErr(e) : e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const runDFSClicked = async () => {
        if (!graphData) return;
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((r) => setTimeout(r, 200));
            const { graph, start, goal } = graphData;
            setDfsResults(runDFS(graph, start, goal));
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const runBNBClicked = async () => {
        if (!bnbData) return;
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((r) => setTimeout(r, 200));
            const { adj, h, start, goal } = bnbData;
            setBnbResults(runBranchAndBound(adj, h, start, goal));
        } catch (e) {
            setError(mapBNBErr(e));
        } finally {
            setIsLoading(false);
        }
    };

    const resetAll = () => {
        setGraphData(null);
        setDfsResults(null);
        setBnbData(null);
        setBnbResults(null);
        setError(null);
    };

    // tab style
    const tabBase = 'px-4 py-2 text-sm font-medium border-b-2 -mb-px focus:outline-none';
    const tabActive = 'border-primary-600 text-primary-700';
    const tabInactive = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {mode === 'DFS' ? t('header.title') : t('header.titleBNB')}
                                </h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    {mode === 'DFS' ? t('header.subtitle') : t('header.subtitleBNB')}
                                </p>

                            </div>
                            <LanguageSwitcher />
                        </div>

                        {/* Tabs */}
                        <div className="mt-6 border-b">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button
                                    type="button"
                                    onClick={() => handleTabChange('DFS')}
                                    className={`${tabBase} ${mode === 'DFS' ? tabActive : tabInactive}`}
                                >
                                    DFS
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTabChange('BNB')}
                                    className={`${tabBase} ${mode === 'BNB' ? tabActive : tabInactive}`}
                                >
                                    {t('bnb.title')}
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
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

                {/* Upload */}
                <FileUpload
                    mode={mode}                
                    onFileUpload={handleFileUpload}
                    isLoading={isLoading}
                />


                {/* DFS Panel */}
                {mode === 'DFS' && graphData && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{t('graphInfo.title')}</h2>
                            <button onClick={resetAll} className="text-sm text-gray-500 hover:text-gray-700 underline">
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
                                <span className="ml-2 text-gray-900 font-semibold">
                                    {Object.keys(graphData.graph).length}
                                </span>
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
                            onClick={runDFSClicked}
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

                {/* BNB Panel */}
                {mode === 'BNB' && bnbData && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{t('bnb.title')}</h2>
                            <button onClick={resetAll} className="text-sm text-gray-500 hover:text-gray-700 underline">
                                {t('graphInfo.reset')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">{t('graphInfo.startNode')}</span>
                                <span className="ml-2 text-blue-900 font-semibold">{bnbData.start}</span>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-green-700">{t('graphInfo.goalNode')}</span>
                                <span className="ml-2 text-green-900 font-semibold">{bnbData.goal}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">{t('graphInfo.totalNodes')}</span>
                                <span className="ml-2 text-gray-900 font-semibold">
                                    {Object.keys(bnbData.adj).length}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('graphInfo.graphStructure')}</h3>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <pre className="text-xs text-gray-600 font-mono">
                                    {Object.entries(bnbData.adj)
                                        .map(([u, es]) => `${u}: ${es.map(e => `${e.v}(${e.w})`).join(', ') || t('graphInfo.noNeighbors')}`)
                                        .join('\n')}
                                </pre>
                            </div>
                        </div>

                        <button
                            onClick={runBNBClicked}
                            disabled={isLoading}
                            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? t('bnb.running') : t('bnb.run')}
                        </button>
                    </div>
                )}

                {/* Kết quả */}
                {mode === 'DFS' && (
                    <>
                        <DFSTable steps={dfsResults?.steps} isLoading={isLoading && graphData} />
                        {dfsResults && (
                            <PathDisplay
                                path={dfsResults.path}
                                found={dfsResults.found}
                                start={graphData?.start}
                                goal={graphData?.goal}
                            />
                        )}
                    </>
                )}

                {mode === 'BNB' && (
                    <>
                        <BNBTable steps={bnbResults?.steps} isLoading={isLoading && bnbData} />
                        {bnbResults && (
                            <PathDisplay
                                path={bnbResults.path}
                                found={bnbResults.found}
                                start={bnbData?.start}
                                goal={bnbData?.goal}
                            />
                        )}
                        {bnbResults?.found === true && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-sm">
                                    <span className="font-medium">{t('bnb.bestCost')}:</span> {bnbResults.bestCost}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500">{t('footer.text')}</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
