import React, { useState, useEffect, useCallback } from 'react';
import { Language, RoomType, CalculationResult, EnvironmentalFactors, RoomRecord } from './types';
import { TRANSLATIONS, ASHRAE_FACTORS, CONVERSION_BTU_PER_WATT, BTU_PER_HP, ADJUSTMENT_PERCENTAGES } from './constants';
import { Header, InputPanel, ResultsPanel, RecordsList, SummaryDashboard, ReferenceData } from './components';

// localStorage keys
const STORAGE_KEYS = {
  RECORDS: 'coolcalc_records',
  DARK_MODE: 'coolcalc_darkmode',
  LANGUAGE: 'coolcalc_language'
};

const App: React.FC = () => {
  // Initialize state from localStorage or defaults
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved as Language) || Language.EN;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) return saved === 'true';
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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

  const [records, setRecords] = useState<RoomRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const t = TRANSLATIONS[lang];

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  // Listen for system dark mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set preference
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const calculate = useCallback(() => {
    const baseLoad = ASHRAE_FACTORS[roomType];

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

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
  };

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

  const updateRecordName = (id: string, newName: string) => {
    setRecords(prev => prev.map(r =>
      r.id === id ? { ...r, roomName: newName } : r
    ));
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      <Header
        lang={lang}
        isDarkMode={isDarkMode}
        onLanguageChange={handleLanguageChange}
        onDarkModeToggle={() => setIsDarkMode(prev => !prev)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Input Section */}
          <InputPanel
            lang={lang}
            t={t}
            isDarkMode={isDarkMode}
            area={area}
            roomType={roomType}
            factors={factors}
            onAreaChange={handleAreaChange}
            onRoomTypeChange={setRoomType}
            onFactorToggle={toggleFactor}
          />

          {/* Results and Records Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ResultsPanel
              lang={lang}
              t={t}
              isDarkMode={isDarkMode}
              result={result}
              isTropical={isTropical}
              recordsCount={records.length}
              onTropicalToggle={setIsTropical}
              onConfirm={handleConfirm}
            />

            <RecordsList
              lang={lang}
              t={t}
              isDarkMode={isDarkMode}
              records={records}
              onDeleteRecord={deleteRecord}
              onClearAll={clearAll}
              onExportCSV={exportCSV}
              onUpdateRecordName={updateRecordName}
            />
          </div>

          {/* Summary Dashboard (only shows when records exist) */}
          <SummaryDashboard
            lang={lang}
            isDarkMode={isDarkMode}
            records={records}
          />

          {/* Reference Data */}
          <ReferenceData
            lang={lang}
            t={t}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#475569' : '#cbd5e1'};
          border-radius: 10px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
