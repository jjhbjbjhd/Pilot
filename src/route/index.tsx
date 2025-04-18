import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../components/Loading/loading";
import React from "react";

const Core = lazy(() =>
  new Promise<{ default: React.ComponentType<any> }>((resolve) =>
    setTimeout(() => resolve(import("../page/Layout") as any), 1000)
  )
);

const About = lazy(() =>
  new Promise<{ default: React.ComponentType<any> }>((resolve) =>
    setTimeout(() => resolve(import("../page/About") as any), 1000)
  )
);


const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/core" element={<PageWrapper><Core /></PageWrapper>} />
        <Route path="/" element={<PageWrapper><About /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); // 模拟加载
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading /> : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
};

export default AppRouter;
