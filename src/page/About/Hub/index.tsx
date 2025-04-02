import { Button } from 'antd';
import githubImage from "@components/github.png"; 
import { useNavigate } from "react-router-dom";



const Hub: React.FC = () => {
    const navigate = useNavigate();
    const hubArray = ["CameraLink","生产汇总","GpoL分类","性能分析","图像增强","光谱计算"]
  return(
    <div className='min-h-screen'>
        <div className="flex flex-row   gap-4 font-bold text-base text-white transition-opacity duration-700 relative justify-center p-10">
            <div className='flex flex-col gap-5  text-2xl '>
                <span className='inline-block '>解放个体潜能：<span className='text-cyan-500'>从工具到</span></span>
                <span className='inline-block text-cyan-500'>伙伴</span>
                <div  className="flex flex-row gap-8">
                    <Button size='large'>
                        开始使用
                    </Button>
                    <Button size='large' style={{backgroundColor: '#000000', color: '#ffffff',border: '0.5px solid gray'}}>
                        <img src={githubImage} alt="GitHub Logo" width="30" height="30" />
                        GitHub
                    </Button>
                </div>
            </div> 
        
            <div className='flex flex-col gap-2'>
                <span className='inline-block'>打造你的个人 AI 助手和专业团队，与 AI 携手推进你的创意事业、写作项目、学习征途</span>
                <span className='inline-block'>和职业任务。从此，指挥一个专门的小组来应对特定挑战，提升工作效率，在个体崛起的</span>
                <span className='inline-block'>时代中脱颖而出。这将在 ToolHub 中成为现实。</span>

                <div className="flex flex-row gap-8 mr-20">
                    <div className="flex flex-col gap-2">
                        <span className='text-2xl item-center justify-center text-center text-cyan-500'>Free</span>
                        <span>开始使用</span>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <span className='text-2xl text-center text-cyan-500'>50+</span>
                        <span>工具Hub</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-row gap-4 font-bold text-base text-white transition-opacity duration-700 relative justify-center p-10">
            <div className="grid grid-cols-3 grid-rows-2 gap-6">
                {hubArray.map((item, index) => (
                <div 
                    onClick={() => navigate(`/core`)}
                    key={index} 
                    className="bg-gray-800 w-[calc(80vw/3)] h-[calc(80vw/3*0.75)] flex items-center justify-center rounded-xl shadow-lg border border-gray-600 
                    transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_15px_cyan]"
                >
                    {item}
                </div>
                ))}
            </div>
        </div>


    </div>
    
  )
}

export default Hub;