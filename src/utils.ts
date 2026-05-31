export const parseTimeStringToSeconds = (input: string): number => {
  const regex = /(\d+(?:\.\d+)?)\s*(y|yr|yrs|year|years|mo|mos|month|months|w|wk|wks|week|weeks|d|dy|day|days|h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)/gi;
  let totalSeconds = 0;
  let match;
  let found = false;

  while ((match = regex.exec(input)) !== null) {
    found = true;
    const val = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    if (unit.startsWith('mo')) totalSeconds += val * 2629746; // avg month: 30.436875 days
    else if (unit.startsWith('y')) totalSeconds += val * 31556952; // avg year: 365.2425 days
    else if (unit.startsWith('w')) totalSeconds += val * 604800; // 7 days
    else if (unit.startsWith('d')) totalSeconds += val * 86400; // 24 hours
    else if (unit.startsWith('h')) totalSeconds += val * 3600;
    else if (unit.startsWith('m') && !unit.startsWith('mo')) totalSeconds += val * 60;
    else if (unit.startsWith('s')) totalSeconds += val;
  }

  return found ? Math.round(totalSeconds) : -1;
};

export const generateHumanTimes = (totalSeconds: number): string[] => {
  if (totalSeconds < 0) return [];
  if (totalSeconds === 0) return ["0 seconds"];

  const extract = (rem: number, unitVal: number, name: string) => {
    const val = Math.floor(rem / unitVal);
    const remainder = rem % unitVal;
    return { val, rem: remainder, name };
  };

  const processSequence = (total: number, sequence: {val: number, name: string}[]) => {
    let rem = total;
    const parts = [];
    for (const {val: unitVal, name} of sequence) {
         const r = extract(rem, unitVal, name);
         if (r.val > 0) {
           parts.push(`${r.val.toLocaleString()} ${r.name}${r.val === 1 ? '' : 's'}`);
         }
         rem = r.rem;
    }
    return parts.length > 0 ? parts.join(', ') : '';
  };

  // 1 Year = 31556952, 1 Month = 2629746, 1 Week = 604800, 1 Day = 86400
  const sequences = [
      [{val: 31556952, name: 'year'}, {val: 2629746, name: 'month'}, {val: 86400, name: 'day'}, {val: 3600, name: 'hour'}, {val: 60, name: 'minute'}, {val: 1, name: 'second'}],
      [{val: 31556952, name: 'year'}, {val: 86400, name: 'day'}, {val: 3600, name: 'hour'}, {val: 60, name: 'minute'}, {val: 1, name: 'second'}], // Year + Days
      [{val: 2629746, name: 'month'}, {val: 86400, name: 'day'}, {val: 3600, name: 'hour'}, {val: 60, name: 'minute'}, {val: 1, name: 'second'}],
      [{val: 604800, name: 'week'}, {val: 86400, name: 'day'}, {val: 3600, name: 'hour'}, {val: 60, name: 'minute'}, {val: 1, name: 'second'}],
      [{val: 86400, name: 'day'}, {val: 3600, name: 'hour'}, {val: 60, name: 'minute'}, {val: 1, name: 'second'}],
      [{val: 3600, name: 'hour'}, {val: 60, name: 'minute'}, {val: 1, name: 'second'}],
      [{val: 60, name: 'minute'}, {val: 1, name: 'second'}],
      [{val: 1, name: 'second'}]
  ];

  const outputs = sequences.map(seq => processSequence(totalSeconds, seq)).filter(Boolean);
  return Array.from(new Set(outputs)); // Deduplicate
};

export const differenceInSeconds = (date1: Date, date2: Date) => {
  return Math.abs(Math.round((date1.getTime() - date2.getTime()) / 1000));
};
