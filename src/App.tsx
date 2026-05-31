import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import TimeTranslator from './Tools/TimeTranslator';
import DaysBetweenDates from './Tools/DaysBetweenDates';
import AgeCalculator from './Tools/AgeCalculator';
import DaysSince from './Tools/DaysSince';
import Countdown from './Tools/Countdown';
import Directory from './Tools/Directory';

function DynamicRouteHandler() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) return <Navigate to="/" replace />;
  
  const prefixes = ['how-many-days-until-', 'days-until-', 'weeks-until-', 'months-until-', 'years-until-'];
  const matchedPrefix = prefixes.find(p => slug.startsWith(p));
  
  if (matchedPrefix) {
    const event = slug.slice(matchedPrefix.length);
    // Render the Countdown component with the event parameter overridden via prop if needed, 
    // or just let Countdown parse it form useParams if we mock it?
    // Wait, Countdown uses useParams<{ event?: string }>(), so it won't see 'event' if we don't pass it!
    // We should either modify Countdown to accept 'event' as a prop, or just mock useParams, 
    // OR... Countdown can use the 'slug' from useParams and parse it itself!
    return <Countdown eventSlug={event} />;
  }

  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TimeTranslator />} />

          {/* Days Between Dates tool routes */}
          <Route path="days-between-dates" element={<DaysBetweenDates />} />
          <Route path="weeks-between-dates" element={<DaysBetweenDates />} />
          <Route path="months-between-dates" element={<DaysBetweenDates />} />
          <Route path="years-between-dates" element={<DaysBetweenDates />} />

          {/* Age Calculator routes */}
          <Route path="age-calculator" element={<AgeCalculator />} />
          <Route path="age-in-days" element={<AgeCalculator />} />
          <Route path="age-in-weeks" element={<AgeCalculator />} />
          <Route path="age-in-months" element={<AgeCalculator />} />

          {/* Days Since routes */}
          <Route path="days-since" element={<DaysSince />} />
          <Route path="weeks-since" element={<DaysSince />} />
          <Route path="months-since" element={<DaysSince />} />

          {/* Countdown routes */}
          <Route path="countdown" element={<Countdown />} />
          <Route path="days-until" element={<Countdown />} />
          <Route path="weeks-until" element={<Countdown />} />
          
          <Route path="directory" element={<Directory />} />

          <Route path=":slug" element={<DynamicRouteHandler />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

