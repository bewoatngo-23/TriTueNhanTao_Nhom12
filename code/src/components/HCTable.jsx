import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HCTable({ steps, isLoading }) {
  const { t } = useTranslation();
  if (isLoading || !steps || !steps.length) return null;

  const noteText = (k) => {
    if (!k) return '';
    return t(`hc.notes.${k}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('hc.title')}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">{t('hc.table.step')}</th>
              <th className="px-3 py-2 text-left">{t('hc.table.current')}</th>
              <th className="px-3 py-2 text-left">{t('hc.table.h')}</th>
              <th className="px-3 py-2 text-left">{t('hc.table.neighbors')}</th>
              <th className="px-3 py-2 text-left">{t('hc.table.chosen')}</th>
              <th className="px-3 py-2 text-left">{t('hc.table.note')}</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-mono">{s.current}</td>
                <td className="px-3 py-2">{s.h}</td>
                <td className="px-3 py-2 font-mono">
                  {s.neighbors?.length ? s.neighbors.join(', ') : '∅'}
                </td>
                <td className="px-3 py-2 font-mono">{s.chosen ?? ''}</td>
                <td className="px-3 py-2">{noteText(s.noteKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
