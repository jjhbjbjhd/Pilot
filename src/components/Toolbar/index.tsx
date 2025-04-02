import { Window } from '@tauri-apps/api/window';
import { MinusIcon as MinusSolid } from "@heroicons/react/24/solid";
import { XMarkIcon as XMarkSolid } from "@heroicons/react/24/solid";
import { WindowIcon as WindowSolid } from "@heroicons/react/24/solid";

const appWindow = new Window('main');
export default function Toolbar() {
    function minimize() {
        appWindow.minimize();
    }
    
    function maximize() {
        appWindow.toggleMaximize();
    }
    
    function close() {
        appWindow.close();
    }
    
    return (
        <div 
            data-tauri-drag-region 
            className="titlebar flex items-center justify-between bg-[#0000] text-white h-10 px-2 select-none"
        >
            <div className="flex space-x-2">
                <button 
                    id="titlebar-close"
                    onClick={close}
                    className="group w-4 h-4 flex items-center justify-center rounded-full bg-red-600"
                >
                    <XMarkSolid className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition duration-200" />
                </button>

                <button 
                    id="titlebar-maximize"
                    onClick={maximize}
                    className="group w-4 h-4 flex items-center justify-center rounded-full bg-[#ffbc2e]"
                >
                    <WindowSolid className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition duration-200" />
                </button>

                <button 
                    id="titlebar-minimize"
                    onClick={minimize}
                    className="group w-4 h-4 flex items-center justify-center rounded-full bg-[#27c841]"
                >
                    <MinusSolid className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition duration-200" />
                </button>
            </div>
            <div className="flex-1"></div> 
        </div>
    );
}
