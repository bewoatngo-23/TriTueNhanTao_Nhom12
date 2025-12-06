import React from 'react';
import { useTranslation } from 'react-i18next';
import { exportBNBToText } from '../utils/bnb';

export default function BNBTable({ steps, isLoading, path, found, start, goal, bestCost }) {
  const { t } = useTranslation();

  const handleExportToFile = () => {
    const textContent = exportBNBToText(steps, path, found, start, goal, bestCost);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output_bnb.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !steps || !steps.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t('bnb.title')}</h2>
        <button
          onClick={handleExportToFile}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('bnb.exportToFile') || 'Xuất File'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">{t('bnb.table.step')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.u')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.g')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.neighbors')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.l1')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.l')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.bound')}</th>
              <th className="px-3 py-2 text-left">{t('bnb.table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-mono">{s.u}</td>
                <td className="px-3 py-2">{s.g}</td>
                <td className="px-3 py-2 font-mono">{s.neighbors?.join(', ') || '∅'}</td>
                <td className="px-3 py-2 font-mono">{s.L1?.join(', ') || '∅'}</td>
                <td className="px-3 py-2 font-mono">{s.L?.join(', ') || '∅'}</td>
                <td className="px-3 py-2">{s.costBound === Infinity ? '∞' : s.costBound}</td>
                <td className="px-3 py-2">{s.reachedGoal ? t('bnb.table.reached') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
