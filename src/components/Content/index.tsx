import VContent from "./visualizationContent"
import DefaultContent from "./defaultContent"

interface ComponentMap {
    [key: string]: React.ReactNode;
};

const contentComponents: ComponentMap = {
    "default": <DefaultContent/>,
    "visualization": <VContent/>
}

export default contentComponents