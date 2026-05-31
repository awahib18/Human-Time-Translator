import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Directory() {
  const years = ['2025', '2026', '2027', '2028', '2029', '2030'];
  const holidays = [
    { name: 'Christmas', slug: 'christmas' },
    { name: 'New Year', slug: 'new-year' },
    { name: 'Halloween', slug: 'halloween' },
    { name: 'Thanksgiving', slug: 'thanksgiving' },
    { name: 'July 4th / Independence Day', slug: 'july-4' },
    { name: 'Valentine\'s Day', slug: 'valentines-day' },
    { name: 'St. Patrick\'s Day', slug: 'st-patricks-day' },
    { name: 'Earth Day', slug: 'earth-day' },
    { name: 'Easter', slug: 'easter' },
    { name: 'Black Friday', slug: 'black-friday' },
    { name: 'Cyber Monday', slug: 'cyber-monday' },
    { name: 'Mother\'s Day', slug: 'mothers-day' },
    { name: 'Father\'s Day', slug: 'fathers-day' },
  ];

  const genericTools = [
    { name: 'Time Translator', path: '/' },
    { name: 'Days Between Dates', path: '/days-between-dates' },
    { name: 'Weeks Between Dates', path: '/weeks-between-dates' },
    { name: 'Months Between Dates', path: '/months-between-dates' },
    { name: 'Years Between Dates', path: '/years-between-dates' },
    { name: 'Age Calculator', path: '/age-calculator' },
    { name: 'Age in Days', path: '/age-in-days' },
    { name: 'Age in Weeks', path: '/age-in-weeks' },
    { name: 'Age in Months', path: '/age-in-months' },
    { name: 'Days Since Event', path: '/days-since' },
    { name: 'Weeks Since Event', path: '/weeks-since' },
    { name: 'Months Since Event', path: '/months-since' },
    { name: 'Countdown Timer', path: '/countdown' },
  ];

  return (
    <div className="flex flex-col items-center justify-start p-6 md:p-12 w-full h-full overflow-y-auto pb-24">
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl mb-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-mono text-indigo-400">[ SEO_DIRECTORY ]</span>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        <div className="space-y-12">
          
          {/* Generic Tools */}
          <section>
            <h2 className="text-xl font-bold tracking-tight uppercase text-slate-300 mb-4">Core Calculators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {genericTools.map(tool => (
                <Link key={tool.path} to={tool.path} className="px-4 py-3 bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors text-sm font-mono tracking-wide uppercase">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Holiday Countdowns */}
          <section>
            <h2 className="text-xl font-bold tracking-tight uppercase text-slate-300 mb-4">Holiday Countdowns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {holidays.map(holiday => (
                <div key={holiday.slug} className="flex flex-col gap-1 mb-2">
                   <Link to={`/how-many-days-until-${holiday.slug}`} className="px-4 py-2 bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-emerald-500/10 transition-colors text-xs font-mono tracking-wide uppercase">
                    Days until {holiday.name}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Year Countdowns */}
          <section>
            <h2 className="text-xl font-bold tracking-tight uppercase text-slate-300 mb-4">Year Countdowns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {years.map(year => (
                <div key={year} className="flex flex-col gap-1 mb-2">
                  <Link to={`/how-many-days-until-${year}`} className="px-4 py-2 bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-amber-500/10 transition-colors text-xs font-mono tracking-wide uppercase">
                    Days until {year}
                  </Link>
                </div>
              ))}
            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
