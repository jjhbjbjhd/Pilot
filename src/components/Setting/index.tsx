import VSetting from "./visualizationSetting"
import DefaultSetting from "./defaultSetting"

interface ComponentMap {
    [key: string]: React.ReactNode;
};

const settingComponents:ComponentMap = {
    "default": <DefaultSetting/>,
    "visualization": <VSetting/>
}

export default settingComponents