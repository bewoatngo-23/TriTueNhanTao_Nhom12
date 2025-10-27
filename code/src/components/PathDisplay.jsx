import React from 'react';
import { useTranslation } from 'react-i18next';

const PathDisplay = ({ path, found, start, goal }) => {
    const { t } = useTranslation();

    if (!path || path.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('pathDisplay.title')}</h2>

            {found ? (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg font-medium text-green-700">{t('pathDisplay.pathFound')}</span>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700 mb-2">{t('pathDisplay.pathFromTo', { start, goal })}</p>
                        <div className="flex items-center flex-wrap">
                            {path.map((node, index) => (
                                <React.Fragment key={index}>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        {node}
                                    </span>
                                    {index < path.length - 1 && (
                                        <svg className="h-4 w-4 text-green-600 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-700">{t('pathDisplay.pathLength')}</span>
                            <span className="ml-2 text-gray-900">{path.length} {t('pathDisplay.nodes')}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-700">{t('pathDisplay.steps')}</span>
                            <span className="ml-2 text-gray-900">{path.length - 1} {t('pathDisplay.edges')}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg font-medium text-red-700">{t('pathDisplay.noPathFound')}</span>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">
                            {t('pathDisplay.noPathExistsFrom')} <strong>{start}</strong> {t('pathDisplay.to')} <strong>{goal}</strong> {t('pathDisplay.usingDFS')}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PathDisplay;