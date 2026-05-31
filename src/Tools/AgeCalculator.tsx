import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateHumanTimes } from '../utils';

export default function AgeCalculator() {
  const [date, setDate] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedSeconds = useMemo(() => {
    if (!date) return -1;
    const d = new Date(date);
    if (isNaN(d.getTime())) return -1;
    return Math.max(0, Math.round((now - d.getTime()) / 1000));
  }, [date, now]);

  const outputs = useMemo(() => generateHumanTimes(parsedSeconds), [parsedSeconds]);
  const hasValidInput = parsedSeconds >= 0 && date;

  const getLabel = (output: string) => {
    if (output.includes('year')) return 'Age in Years';
    if (output.includes('month')) return 'Age in Months';
    if (output.includes('week')) return 'Age in Weeks';
    if (output.includes('day')) return 'Age in Days';
    if (output.includes('hour')) return 'Age in Hours';
    if (output.includes('minute')) return 'Age in Minutes';
    return 'Age in Seconds';
  };

  const getColorClass = (output: string) => {
    if (output.includes('year') || output.includes('week') || output.includes('day') || output.includes('month')) return 'text-indigo-300';
    return 'text-emerald-400';
  };

  const formatOutputValue = (output: string) => {
    const parts = output.split(',');
    if (parts.length === 1) {
      const [num, ...unitParts] = parts[0].trim().split(' ');
      const unit = unitParts.join(' ');
      return (
        <>
          {num} <span className="text-sm opacity-40">{unit}</span>
        </>
      );
    }
    return output;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 w-full h-full">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl mb-12"
      >
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[10px] font-mono text-indigo-400">[ BIRTH_DATE ]</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
        <div className="relative">
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 p-6 md:p-8 text-2xl md:text-3xl text-white focus:outline-none focus:border-indigo-500 transition-colors uppercase font-mono"
          />
        </div>
      </motion.div>

      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {hasValidInput && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
            >
              {outputs.map((output, index) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={index} 
                  className="bg-slate-950/50 p-6 border border-slate-800 flex flex-col justify-between min-h-[128px]"
                >
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">
                    {getLabel(output)}
                  </span>
                  <div className={`text-xl md:text-2xl font-semibold mt-4 ${getColorClass(output)}`}>
                    {formatOutputValue(output)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
