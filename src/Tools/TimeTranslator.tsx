import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';
import { parseTimeStringToSeconds, generateHumanTimes } from '../utils';

const getLabel = (output: string) => {
  if (output.includes('year')) return 'Gregorian Format';
  if (output.includes('month')) return 'Monthly Format';
  if (output.includes('week')) return 'Standard Weeks';
  if (output.includes('day')) return 'Day Format';
  if (output.includes('hour')) return 'Total Hours';
  if (output.includes('minute')) return 'Total Minutes';
  return 'Total Seconds';
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

export default function TimeTranslator() {
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parsedSeconds = useMemo(() => parseTimeStringToSeconds(input), [input]);
  const outputs = useMemo(() => generateHumanTimes(parsedSeconds), [parsedSeconds]);

  const hasValidInput = parsedSeconds > 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 w-full h-full">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl mb-12"
      >
        <div className="flex items-center gap-4 mb-2">
          <span className="text-[10px] font-mono text-indigo-400">[ INPUT_QUANTITY ]</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="734 days"
            autoFocus={mounted}
            spellCheck={false}
            className="w-full bg-slate-800 border border-slate-700 p-6 md:p-8 text-3xl md:text-5xl font-light text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
          />
          <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Clock size={32} strokeWidth={1.5} />
          </div>
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
          
          {!hasValidInput && input.length > 0 && parsedSeconds === -1 && (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-12 border border-dashed border-slate-800 text-slate-500 font-mono text-sm uppercase tracking-widest"
            >
              Awaiting valid temporal units...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
