import VConsole from "./visualizationConsole"
import DefaultConsole from "./defaultConsole"

interface ComponentMap {
    [key: string]: React.ReactNode;
};

const consoleComponents:ComponentMap = {
    "visualization":<VConsole/>, 
    "default": <DefaultConsole/>,
}

export default consoleComponents

