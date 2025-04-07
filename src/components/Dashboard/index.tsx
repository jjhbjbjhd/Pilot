import VContent from "./visualizationContent"
import Dashboard from "./defaultContent"

interface ComponentMap {
    [key: string]: React.ReactNode;
};

const contentComponents: ComponentMap = {
    "default": <Dashboard/>,
    "visualization": <VContent/>
}

export default contentComponents