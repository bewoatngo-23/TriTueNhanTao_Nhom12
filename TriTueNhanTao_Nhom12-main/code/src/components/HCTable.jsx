import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HCTable({ steps, isLoading }) {
  const { t } = useTranslation();
  if (isLoading || !steps || !steps.length) return null;

  const noteText = (k) => {
    if (!k) return '';
    // Nếu key ghi chú chưa có trong file dịch, trả về text mặc định
    if (k === 'note_start_init') return 'Khởi tạo';
    return t(`hc.notes.${k}`) || k;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('hc.title') || 'Hill Climbing'}</h2>
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