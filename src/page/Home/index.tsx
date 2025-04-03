import Toolbar from "@src/components/Toolbar";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
      <div
      onClick={() => navigate(`/`)}
      >
        <Toolbar />
        <h1>Home Page</h1>
        <p>This is the about page.</p>
      </div>
    );
  };
  
  export default Home;
  