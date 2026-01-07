
import React, { useState, useEffect, useCallback } from 'react';
import { Language, RoomType, CalculationResult, EnvironmentalFactors, RoomRecord } from './types';
import { TRANSLATIONS, ASHRAE_FACTORS, CONVERSION_BTU_PER_WATT, BTU_PER_HP, ADJUSTMENT_PERCENTAGES } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.ZH);
  const [area, setArea] = useState<number>(20);
  const [roomType, setRoomType] = useState<RoomType>(RoomType.BEDROOM);
  const [factors, setFactors] = useState<EnvironmentalFactors>({
    highSunExposure: false,
    poorInsulation: false,
    extraOccupants: false,
    highElectronicLoad: false
  });
  const [isTropical, setIsTropical] = useState<boolean>(true);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [records, setRecords] = useState<RoomRecord[]>([]);

  const t = TRANSLATIONS[lang];

  const calculate = useCallback(() => {
    const baseLoad = ASHRAE_FACTORS[roomType];

    // Calculate total multiplier from checkboxes
    let totalMultiplier = 1;
    if (factors.highSunExposure) totalMultiplier += ADJUSTMENT_PERCENTAGES.highSunExposure;
    if (factors.poorInsulation) totalMultiplier += ADJUSTMENT_PERCENTAGES.poorInsulation;
    if (factors.extraOccupants) totalMultiplier += ADJUSTMENT_PERCENTAGES.extraOccupants;
    if (factors.highElectronicLoad) totalMultiplier += ADJUSTMENT_PERCENTAGES.highElectronicLoad;

    const tropicalMultiplier = isTropical ? 1.30 : 1;
    const adjustedWattsPerM2 = baseLoad * totalMultiplier * tropicalMultiplier;
    const watts = area * adjustedWattsPerM2;
    const kw = watts / 1000;
    const btu = watts * CONVERSION_BTU_PER_WATT;
    const hp = btu / BTU_PER_HP;

    setResult({
      watts,
      kw,
      btu,
      hp,
      area,
      roomType,
      baseLoad,
      adjustmentMultiplier: totalMultiplier,
      isTropical
    });
  }, [area, roomType, factors, isTropical]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const toggleFactor = (key: keyof EnvironmentalFactors) => {
    setFactors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAreaChange = (val: string) => {
    const num = parseFloat(val) || 0;
    setArea(Number(num.toFixed(1)));
  };

  const handleConfirm = () => {
    if (!result || records.length >= 20) return;

    const newRecord: RoomRecord = {
      id: Date.now().toString(),
      roomName: `${t.roomNamePrefix} ${records.length + 1}`,
      area: result.area,
      kw: result.kw,
      btu: result.btu,
      hp: result.hp,
      roomType: result.roomType
    };

    setRecords(prev => [...prev, newRecord]);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    setRecords([]);
  };

  const exportCSV = () => {
    if (records.length === 0) return;

    const headers = ['Room Name', 'Type', 'Area (m2)', 'Capacity (kW)', 'Capacity (BTU)', 'Capacity (HP)'];
    const rows = records.map(r => [
      r.roomName,
      t.roomTypes[r.roomType],
      r.area,
      r.kw.toFixed(2),
      Math.round(r.btu),
      r.hp.toFixed(2)
    ]);

    // Add UTF-8 BOM for Excel compatibility
    const csvContent = "\ufeff" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `CoolCal_Pro_Records_${dateStr}.csv`;

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">

          {/* Input Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <i className="fas fa-sliders-h text-blue-500"></i>
                {lang === Language.ZH ? '配置' : lang === Language.EN ? 'Configuration' : 'Configuration'}
              </h2>
              <button
                onClick={() => setLang(lang === Language.EN ? Language.FR : lang === Language.FR ? Language.ZH : Language.EN)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 shadow-sm"
              >
                <i className="fas fa-globe text-blue-500"></i>
                {lang === Language.EN ? 'FR' : lang === Language.FR ? '中文' : 'EN'}
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.areaLabel}
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-full sm:w-[160px]">
                    <input
                      type="number"
                      value={area}
                      step="0.1"
                      onChange={(e) => handleAreaChange(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none pointer-events-none">m²</span>
                  </div>
                  <div className="flex-1 w-full flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 w-8">2m²</span>
                    <input
                      type="range"
                      min="2"
                      max="1000"
                      step="0.1"
                      value={area}
                      onChange={(e) => handleAreaChange(e.target.value)}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-[10px] font-bold text-slate-400 w-12 text-right">1000m²</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.roomTypeLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(ASHRAE_FACTORS) as RoomType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setRoomType(type)}
                        className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-2 ${roomType === type
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                          }`}
                      >
                        <i className={`fas ${type === RoomType.BEDROOM ? 'fa-bed' :
                          type === RoomType.LIVING_ROOM ? 'fa-couch' :
                            type === RoomType.KITCHEN ? 'fa-utensils' :
                              type === RoomType.OFFICE ? 'fa-briefcase' :
                                type === RoomType.SERVER_ROOM ? 'fa-server' : 'fa-dumbbell'
                          }`}></i>
                        {t.roomTypes[type]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    {t.factorsTitle}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={factors.highSunExposure}
                        onChange={() => toggleFactor('highSunExposure')}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.highSun}</span>
                    </label>
                    <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={factors.poorInsulation}
                        onChange={() => toggleFactor('poorInsulation')}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.poorInsulation}</span>
                    </label>
                    <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={factors.extraOccupants}
                        onChange={() => toggleFactor('extraOccupants')}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.extraOccupants}</span>
                    </label>
                    <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <input
                        type="checkbox"
                        checked={factors.highElectronicLoad}
                        onChange={() => toggleFactor('highElectronicLoad')}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.electronics}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Results Display */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
              <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
                <i className="fas fa-chart-line text-blue-500"></i>
                {t.resultsTitle}
              </h2>

              <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isTropical ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <i className={`fas ${isTropical ? 'fa-sun' : 'fa-check'}`}></i>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-700">{t.tropicalAreaLabel}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{isTropical ? (lang === Language.ZH ? '已应用 +30% 调整' : 'Applied +30% Adjustment') : (lang === Language.ZH ? '标准计算' : 'Standard Calculation')}</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTropical}
                    onChange={(e) => setIsTropical(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {result && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.kwLabel}</span>
                      <span className="text-2xl font-black text-slate-800">{result.kw.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.btuLabel}</span>
                      <span className="text-2xl font-black text-slate-800">{Math.round(result.btu).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-1">{t.hpLabel}</span>
                      <span className="text-2xl font-black text-slate-800">{result.hp.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={records.length >= 20}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 mb-6"
                  >
                    <i className="fas fa-check-circle"></i>
                    {t.confirmBtn} {records.length >= 20 && `(Limit 20)`}
                  </button>

                  <div className="mt-auto space-y-2">
                    {result.isTropical && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-xs flex items-start gap-2">
                        <i className="fas fa-info-circle mt-0.5"></i>
                        <p>
                          {lang === Language.ZH ? '热带地区调整 (+30%) 已启用。' : 'Tropical area adjustment (+30%) is active.'}
                        </p>
                      </div>
                    )}
                    {result.adjustmentMultiplier > 1 && (
                      <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-xs flex items-start gap-2">
                        <i className="fas fa-exclamation-triangle mt-0.5"></i>
                        <p>
                          {lang === Language.ZH
                            ? `已应用 ${Math.round((result.adjustmentMultiplier - 1) * 100)}% 环境因素调整。`
                            : lang === Language.EN
                              ? `Applied ${Math.round((result.adjustmentMultiplier - 1) * 100)}% adjustment for environmental factors.`
                              : `Adapté de ${Math.round((result.adjustmentMultiplier - 1) * 100)}% pour les facteurs environnementaux.`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Records List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <i className="fas fa-list-ul text-blue-500"></i>
                  {t.recordsTitle}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={exportCSV}
                    disabled={records.length === 0}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30"
                    title={t.exportBtn}
                  >
                    <i className="fas fa-file-export text-xl"></i>
                  </button>
                  <button
                    onClick={clearAll}
                    disabled={records.length === 0}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                    title={t.clearAllBtn}
                  >
                    <i className="fas fa-trash-alt text-xl"></i>
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {records.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <i className="fas fa-folder-open text-4xl"></i>
                    <p className="text-sm font-medium">{t.noRecords}</p>
                  </div>
                ) : (
                  records.map((rec) => (
                    <div key={rec.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{rec.roomName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded uppercase font-black">{t.roomTypes[rec.roomType].split(' / ')[0]}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {lang === Language.ZH ? '面积' : 'Area'}: <span className="text-slate-700 font-bold">{rec.area} m²</span> |
                          {lang === Language.ZH ? '容量' : 'Capacity'}: <span className="text-blue-600 font-bold">{rec.kw.toFixed(2)} kW</span>
                        </p>
                      </div>
                      <button
                        onClick={() => deleteRecord(rec.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>{lang === Language.ZH ? '总计' : 'Total'}: {records.length} / 20</span>
                {records.length > 0 && (
                  <span>{lang === Language.ZH ? '合计' : 'Sum'}: {records.reduce((acc, r) => acc + r.kw, 0).toFixed(2)} kW</span>
                )}
              </div>
            </div>
          </div>

          {/* Reference Data Bottom */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 opacity-80">
              <i className="fas fa-book-open"></i>
              {lang === Language.ZH ? 'ASHRAE 参考数据' : lang === Language.EN ? 'ASHRAE Reference Data' : 'Données de Référence ASHRAE'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {(Object.keys(ASHRAE_FACTORS) as RoomType[]).map((type) => (
                <div key={type} className="bg-white/10 p-3 rounded-lg flex flex-col items-center text-center">
                  <span className="text-[10px] font-medium opacity-60 mb-1 truncate w-full">{t.roomTypes[type].split(' / ')[0]}</span>
                  <span className="text-xs font-black">{ASHRAE_FACTORS[type]} W/m²</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-white/40 italic text-center">
              <i className="fas fa-info-circle mr-1"></i>
              {t.disclaimer}
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;
