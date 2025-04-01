import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "../page/Home";
import About from "../page/About";

const AppRouter: React.FC = () => {
  return (
    <Router>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <nav className="flex gap-4 p-4 bg-gray-100">
        <Link to="/" className="text-blue-500">首页</Link>
        <Link to="/about" className="text-blue-500">关于</Link>
      </nav>
    </Router>
  );
};

export default AppRouter;
