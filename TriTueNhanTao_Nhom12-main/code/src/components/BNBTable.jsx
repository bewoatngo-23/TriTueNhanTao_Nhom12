// components/BNBTable.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BNBTable({ steps, isLoading }) {
  const { t } = useTranslation();
  if (isLoading || !steps || !steps.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('bnb.title')}</h2>
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
