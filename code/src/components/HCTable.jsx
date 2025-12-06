import React from 'react';
import { useTranslation } from 'react-i18next';
import { exportHCToText } from '../utils/hc';

export default function HCTable({ steps, isLoading, path, found, start, goal }) {
  const { t } = useTranslation();

  const handleExportToFile = () => {
    const textContent = exportHCToText(steps, path, found, start, goal);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output_hc.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !steps || !steps.length) return null;

  const noteText = (k) => {
    if (!k) return '';
    // Nếu key ghi chú chưa có trong file dịch, trả về text mặc định
    if (k === 'note_start_init') return 'Khởi tạo';
    return t(`hc.notes.${k}`) || k;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t('hc.title') || 'Hill Climbing'}</h2>
        <button
          onClick={handleExportToFile}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('hc.exportToFile') || 'Xuất File'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 border-b text-left w-12">Bước</th>
              <th className="px-3 py-2 border-b text-left">Hiện tại</th>
              <th className="px-3 py-2 border-b text-left">h(TT)</th>

              {/* Đã sửa tiêu đề ở đây */}
              <th className="px-3 py-2 border-b text-left">Trạng thái kề</th>
              <th className="px-3 py-2 border-b text-left font-bold text-blue-600">L1</th>
              <th className="px-3 py-2 border-b text-left font-bold text-green-600">L</th>

              <th className="px-3 py-2 border-b text-left">Chọn</th>
              <th className="px-3 py-2 border-b text-left">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 text-center">{i + 1}</td>
                <td className="px-3 py-2 font-mono font-medium">{s.current}</td>
                <td className="px-3 py-2">{s.h}</td>

                {/* Cột Trạng thái kề */}
                <td className="px-3 py-2 font-mono text-gray-600">
                  {s.neighbors?.length ? s.neighbors.join(', ') : '-'}
                </td>

                {/* Cột L1 */}
                <td className="px-3 py-2 font-mono text-blue-600">
                  {s.L1 && s.L1.length ? s.L1.join(', ') : '-'}
                </td>

                {/* Cột L */}
                <td className="px-3 py-2 font-mono text-green-600 text-xs break-all">
                  {s.L && s.L.length ? s.L.join(', ') : '-'}
                </td>

                <td className="px-3 py-2 font-bold font-mono text-red-500">{s.chosen || ''}</td>
                <td className="px-3 py-2 text-gray-500 italic">{noteText(s.noteKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}