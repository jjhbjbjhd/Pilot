import VHeader from "./visualizationHeader"
import DefaultHeader from "./defaultHeader"
interface ComponentMap {
    [key: string]: React.ReactNode;
};

const headerComponents:ComponentMap = {
    "default": <DefaultHeader/>,
    "visualization": <VHeader/>
}

export default headerComponents