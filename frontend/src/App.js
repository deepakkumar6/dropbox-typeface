import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FilePreview from "./pages/PreviewPage";
import { AppProvider } from "./context/app-context";
import { BannerProvider } from "./context/banner-context";

function App() {
  return (
    <AppProvider>
      <BannerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/files/:id" element={<FilePreview />} />
        </Routes>
      </Router>
      </BannerProvider>
    </AppProvider>
  );
}

export default App;
