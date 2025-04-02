import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Core from "../page/Layout";
import About from "../page/About";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/core" element={<Core />} />
        <Route path="/" element={<About />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
