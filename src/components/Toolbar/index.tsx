import { Window } from '@tauri-apps/api/window';
import { MinusIcon as MinusSolid } from "@heroicons/react/24/solid";
import { XMarkIcon as XMarkSolid } from "@heroicons/react/24/solid";
import { WindowIcon as WindowSolid } from "@heroicons/react/24/solid";

const appWindow = new Window('main');
export default function Toolbar() {
    function minimize() {
        appWindow.minimize()
    }
    
    function maximize() {
        appWindow.toggleMaximize()
    }
    
    function close() {
        appWindow.close()
    }
    

    return  (
        <div data-tauri-drag-region className="titlebar flex items-center justify-between bg-main-black text-white h-10 px-2 select-none">
            <div className="flex-1"></div> {/* 拖拽区域 */}
            <div className="flex space-x-2">
                <button 
                    id="titlebar-minimize"
                    onClick={minimize}
                    className="titlebar-button p-2 hover:bg-gray-700 rounded"
                >
                <MinusSolid className="w-4 h-4 text-white-80" />

                </button>
                
                <button 
                    id="titlebar-maximize"
                    onClick={maximize}
                    className="titlebar-button p-2 hover:bg-gray-700 rounded"
                >
                <WindowSolid className="w-4 h-4 text-white-80 "  />
                </button>
                
                <button 
                    id="titlebar-close"
                    onClick={close}
                    className="titlebar-button p-2 hover:bg-red-600 rounded"
                >
                <XMarkSolid className="w-4 h-4  text-white-80" />
                </button>
            </div>
            </div>

    )
}