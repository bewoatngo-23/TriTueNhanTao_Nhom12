import React from 'react';
import { useTranslation } from 'react-i18next';
import { exportDFSToText } from '../utils/dfs';

const DFSTable = ({ steps, isLoading, path, found, start, goal }) => {
    const { t } = useTranslation();

    const handleExportToFile = () => {
        const textContent = exportDFSToText(steps, path, found, start, goal);
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'output_dfs.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-600">{t('graphInfo.runningDFS')}</span>
                </div>
            </div>
        );
    }

    if (!steps || steps.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{t('dfsTable.title')}</h2>
                <button
                    onClick={handleExportToFile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t('dfsTable.exportToFile') || 'Xuất File'}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('dfsTable.step')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('dfsTable.currentNode')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('dfsTable.neighbors')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('dfsTable.stack')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('dfsTable.visited')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('dfsTable.status')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {steps.map((step, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {step.step}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                        {step.current}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex flex-wrap gap-1">
                                        {step.neighbors && step.neighbors.length > 0 ? (
                                            step.neighbors.map((node, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {node}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">{t('dfsTable.empty')}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex flex-wrap gap-1">
                                        {step.stack.length > 0 ? (
                                            step.stack.map((node, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                                                >
                                                    {node}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic">{t('dfsTable.empty')}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex flex-wrap gap-1">
                                        {step.visited.map((node, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                                            >
                                                {node}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {step.isGoal ? (
                                        <span className="text-green-600 font-semibold">{t('dfsTable.goalReached')}</span>
                                    ) : (
                                        <span>{t('dfsTable.exploring')}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DFSTable;