import VContent from "./dailySummary"
import Dashboard from "./defaultContent"
import GPOL from "./gpol"

interface ComponentMap {
    [key: string]: React.ReactNode;
};

const contentComponents: ComponentMap = {
    "default": <Dashboard/>,
    "dailyTastDataSummary": <VContent/>,
    "gpol": <GPOL/>,
}

export default contentComponents