import React, { useState } from 'react';
import { Language, RoomRecord, Translation } from '../types';

interface RecordsListProps {
    lang: Language;
    t: Translation;
    isDarkMode: boolean;
    records: RoomRecord[];
    onDeleteRecord: (id: string) => void;
    onClearAll: () => void;
    onExportCSV: () => void;
    onUpdateRecordName: (id: string, newName: string) => void;
}

const RecordsList: React.FC<RecordsListProps> = ({
    lang,
    t,
    isDarkMode,
    records,
    onDeleteRecord,
    onClearAll,
    onExportCSV,
    onUpdateRecordName
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleStartEdit = (record: RoomRecord) => {
        setEditingId(record.id);
        setEditingName(record.roomName);
    };

    const handleSaveEdit = () => {
        if (editingId && editingName.trim()) {
            onUpdateRecordName(editingId, editingName.trim());
        }
        setEditingId(null);
        setEditingName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            setEditingId(null);
            setEditingName('');
        }
    };

    const totalKw = records.reduce((acc, r) => acc + r.kw, 0);

    return (
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-2xl shadow-sm border flex flex-col h-full min-h-[400px] transition-all duration-300 animate-fadeIn`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <i className="fas fa-list-ul text-blue-500"></i>
                    {t.recordsTitle}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={onExportCSV}
                        disabled={records.length === 0}
                        className={`p-2 ${isDarkMode ? 'text-blue-400 hover:bg-slate-700' : 'text-blue-600 hover:bg-blue-50'} rounded-lg transition-all duration-200 disabled:opacity-30 transform hover:scale-110`}
                        title={t.exportBtn}
                    >
                        <i className="fas fa-file-export text-xl"></i>
                    </button>
                    <button
                        onClick={onClearAll}
                        disabled={records.length === 0}
                        className={`p-2 ${isDarkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-500 hover:bg-red-50'} rounded-lg transition-all duration-200 disabled:opacity-30 transform hover:scale-110`}
                        title={t.clearAllBtn}
                    >
                        <i className="fas fa-trash-alt text-xl"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {records.length === 0 ? (
                    <div className={`h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} space-y-2`}>
                        <i className="fas fa-folder-open text-4xl"></i>
                        <p className="text-sm font-medium">{t.noRecords}</p>
                    </div>
                ) : (
                    records.map((rec, index) => (
                        <div
                            key={rec.id}
                            className={`p-4 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'} border rounded-xl flex justify-between items-center group transition-all duration-200 hover:shadow-md animate-slideIn`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                    {editingId === rec.id ? (
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            onBlur={handleSaveEdit}
                                            onKeyDown={handleKeyDown}
                                            autoFocus
                                            className={`font-bold ${isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-slate-800'} px-2 py-1 rounded border border-blue-500 outline-none text-sm w-32`}
                                        />
                                    ) : (
                                        <span
                                            onClick={() => handleStartEdit(rec)}
                                            className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} cursor-pointer hover:text-blue-500 transition-colors`}
                                            title={lang === Language.ZH ? '点击编辑' : 'Click to edit'}
                                        >
                                            {rec.roomName}
                                            <i className="fas fa-pencil-alt ml-2 text-xs opacity-0 group-hover:opacity-50"></i>
                                        </span>
                                    )}
                                    <span className={`text-[10px] px-1.5 py-0.5 ${isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'} rounded uppercase font-black`}>
                                        {t.roomTypes[rec.roomType].split(' / ')[0]}
                                    </span>
                                </div>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
                                    {lang === Language.ZH ? '面积' : 'Area'}: <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-bold`}>{rec.area} m²</span> |
                                    {lang === Language.ZH ? '容量' : 'Capacity'}: <span className="text-blue-500 font-bold">{rec.kw.toFixed(2)} kW</span>
                                </p>
                            </div>
                            <button
                                onClick={() => onDeleteRecord(rec.id)}
                                className={`p-2 ${isDarkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-300 hover:text-red-500'} transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-110`}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'} flex justify-between items-center text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                <span>{lang === Language.ZH ? '总计' : 'Total'}: {records.length} / 20</span>
                {records.length > 0 && (
                    <span className="text-blue-500">{lang === Language.ZH ? '合计' : 'Sum'}: {totalKw.toFixed(2)} kW</span>
                )}
            </div>
        </div>
    );
};

export default RecordsList;