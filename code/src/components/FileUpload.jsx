import React from 'react';
import { useTranslation } from 'react-i18next';

const FileUpload = ({ onFileUpload, isLoading }) => {
    const { t } = useTranslation();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                onFileUpload(e.target.result);
            };
            reader.readAsText(file);
        } else {
            alert(t('errors.invalidFile'));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('fileUpload.title')}</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <div className="mb-4">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-block">
                        {t('fileUpload.chooseFile')}
                    </span>
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".txt"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </label>
                <p className="mt-2 text-sm text-gray-600">{t('fileUpload.uploadHint')}</p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-800 mb-2">{t('fileUpload.expectedFormat')}</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">{t('fileUpload.englishFormat')}</p>
                        <pre className="text-xs text-gray-600 font-mono">
                            {`A: B,C,D
B: I,G
C: F,E
D: F
E: G,K
F: K
G:
I: G
K:
Start: A
Goal: G`}
                        </pre>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">{t('fileUpload.vietnameseFormat')}</p>
                        <pre className="text-xs text-gray-600 font-mono">
                            {`A: B,C,D
B: I,G
C: F,E
D: F
E: G,K
F: K
G:
I: G
K:
Trạng thái đầu: A; Trạng thái kết thúc: G`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;