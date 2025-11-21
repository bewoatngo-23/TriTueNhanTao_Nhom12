import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BNBExpectedFormatFile({
  enPath = '/expected_BNB_en.txt',
  viPath = '/expected_BNB_vn.txt',
}) {
  const { t } = useTranslation();
  const [enText, setEnText] = useState('');
  const [viText, setViText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [enRes, viRes] = await Promise.all([fetch(enPath), fetch(viPath)]);
        if (!enRes.ok) throw new Error(`Failed to load ${enPath}`);
        if (!viRes.ok) throw new Error(`Failed to load ${viPath}`);
        const [en, vi] = await Promise.all([enRes.text(), viRes.text()]);
        if (!alive) return;
        setEnText(en);
        setViText(vi);
      } catch (e) {
        if (!alive) return;
        setError(e.message);
      }
    };
    load();
    return () => { alive = false; };
  }, [enPath, viPath]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{t('format.bnb.title')}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

     
      <div className="mb-6">
        <p className="font-medium text-gray-800">{t('format.lang.vi')}</p>
        <p className="text-sm text-gray-600 mt-2">{t('format.bnb.desc_vi')}</p>
        <div className="bg-gray-50 rounded-md p-3 mt-3">
          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">{viText || '...'}</pre>
        </div>
      </div>

      <div>
        <p className="font-medium text-gray-800">{t('format.lang.en')}</p>
        <p className="text-sm text-gray-600 mt-2">{t('format.bnb.desc_en')}</p>
        <div className="bg-gray-50 rounded-md p-3 mt-3">
          <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">{enText || '...'}</pre>
        </div>
      </div>
    </div>
  );
}
