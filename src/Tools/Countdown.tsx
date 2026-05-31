import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { generateHumanTimes } from '../utils';

function getEaster(year: number) {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

function getNthWeekday(year: number, month: number, weekday: number, n: number) {
  const d = new Date(year, month, 1);
  const offset = (weekday + 7 - d.getDay()) % 7;
  d.setDate(1 + offset + (n - 1) * 7);
  return d;
}

function getLastWeekday(year: number, month: number, weekday: number) {
  const d = new Date(year, month + 1, 0);
  const offset = (d.getDay() + 7 - weekday) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function parseEventDate(eventName: string): string {
  const now = new Date();
  const currentYear = now.getFullYear();

  const checkFuture = (d: Date, getNextYearDate: (y: number) => Date) => {
    return now > d ? getNextYearDate(currentYear + 1) : d;
  };

  const name = eventName.toLowerCase();
  let target: Date | null = null;

  switch (name) {
    case 'christmas':
      target = checkFuture(new Date(currentYear, 11, 25), y => new Date(y, 11, 25));
      break;
    case 'new-year':
    case 'new-years':
    case 'new-years-day':
      target = checkFuture(new Date(currentYear, 0, 1), y => new Date(y, 0, 1));
      break;
    case 'new-years-eve':
      target = checkFuture(new Date(currentYear, 11, 31), y => new Date(y, 11, 31));
      break;
    case 'halloween':
      target = checkFuture(new Date(currentYear, 9, 31), y => new Date(y, 9, 31));
      break;
    case 'valentines-day':
      target = checkFuture(new Date(currentYear, 1, 14), y => new Date(y, 1, 14));
      break;
    case 'st-patricks-day':
      target = checkFuture(new Date(currentYear, 2, 17), y => new Date(y, 2, 17));
      break;
    case 'earth-day':
      target = checkFuture(new Date(currentYear, 3, 22), y => new Date(y, 3, 22));
      break;
    case 'independence-day':
      target = checkFuture(new Date(currentYear, 6, 4), y => new Date(y, 6, 4));
      break;
    case 'veterans-day':
      target = checkFuture(new Date(currentYear, 10, 11), y => new Date(y, 10, 11));
      break;
    case 'easter':
      target = checkFuture(getEaster(currentYear), y => getEaster(y));
      break;
    case 'thanksgiving':
      target = checkFuture(getNthWeekday(currentYear, 10, 4, 4), y => getNthWeekday(y, 10, 4, 4));
      break;
    case 'black-friday':
      target = checkFuture(
        new Date(getNthWeekday(currentYear, 10, 4, 4).getTime() + 86400000),
        y => new Date(getNthWeekday(y, 10, 4, 4).getTime() + 86400000)
      );
      break;
    case 'cyber-monday':
      target = checkFuture(
        new Date(getNthWeekday(currentYear, 10, 4, 4).getTime() + 86400000 * 4),
        y => new Date(getNthWeekday(y, 10, 4, 4).getTime() + 86400000 * 4)
      );
      break;
    case 'mothers-day':
      target = checkFuture(getNthWeekday(currentYear, 4, 0, 2), y => getNthWeekday(y, 4, 0, 2));
      break;
    case 'fathers-day':
      target = checkFuture(getNthWeekday(currentYear, 5, 0, 3), y => getNthWeekday(y, 5, 0, 3));
      break;
    case 'memorial-day':
      target = checkFuture(getLastWeekday(currentYear, 4, 1), y => getLastWeekday(y, 4, 1));
      break;
    case 'labor-day':
      target = checkFuture(getNthWeekday(currentYear, 8, 1, 1), y => getNthWeekday(y, 8, 1, 1));
      break;
    default:
      if (/^\d{4}$/.test(name)) {
        target = new Date(parseInt(name), 0, 1);
      } else {
        const parts = name.split('-');
        if (parts.length === 2) {
          const mName = parts[0];
          const mIdx1 = MONTHS.indexOf(mName);
          const mIdx2 = MONTHS_SHORT.indexOf(mName);
          const mIdx = mIdx1 !== -1 ? mIdx1 : mIdx2;
          
          if (mIdx !== -1) {
            const dayNum = parseInt(parts[1]);
            if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
              target = checkFuture(new Date(currentYear, mIdx, dayNum), y => new Date(y, mIdx, dayNum));
            }
          }
        }
      }
      break;
  }

  if (target) {
    return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
  }
  
  return '';
}

export default function Countdown({ eventSlug }: { eventSlug?: string }) {
  const { event: paramEvent } = useParams<{ event?: string }>();
  const [date, setDate] = useState('');
  const [now, setNow] = useState(Date.now());

  const event = eventSlug || paramEvent;

  useEffect(() => {
    if (event) {
      const parsed = parseEventDate(event);
      if (parsed) setDate(parsed);
    }
  }, [event]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedSeconds = useMemo(() => {
    if (!date) return -1;
    const d = new Date(date);
    if (isNaN(d.getTime())) return -1;
    const diff = Math.round((d.getTime() - now) / 1000);
    return Math.max(0, diff); 
  }, [date, now]);

  const outputs = useMemo(() => generateHumanTimes(parsedSeconds), [parsedSeconds]);
  const hasValidInput = parsedSeconds >= 0 && date;

  const getLabel = (output: string) => {
    if (output.includes('year')) return 'Years Remaining';
    if (output.includes('month')) return 'Months Remaining';
    if (output.includes('week')) return 'Weeks Remaining';
    if (output.includes('day')) return 'Days Remaining';
    if (output.includes('hour')) return 'Hours Remaining';
    if (output.includes('minute')) return 'Minutes Remaining';
    return 'Seconds Remaining';
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
          <span className="text-[10px] font-mono text-indigo-400">
            [ FUTURE_EVENT_DATE ]
          </span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>
        
        {event ? (
          <div className="flex flex-col gap-4 mb-6 relative">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase break-words w-full">
              {event.replace(/-/g, ' ')}
            </h1>
            <div className="flex gap-4 items-center">
               <span className="text-sm font-mono text-slate-400">TARGET DATE:</span>
               <input 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="bg-transparent border-b border-indigo-500/50 text-indigo-300 focus:outline-none focus:border-indigo-400 pb-1 font-mono uppercase text-sm"
                 min={new Date().toISOString().split('T')[0]}
               />
            </div>
          </div>
        ) : (
          <div className="relative">
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 p-6 md:p-8 text-2xl md:text-3xl text-white focus:outline-none focus:border-indigo-500 transition-colors uppercase font-mono"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}
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
