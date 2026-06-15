import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { MainApp } from './MainApp';
import { DetailsPage } from './components/DetailsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
