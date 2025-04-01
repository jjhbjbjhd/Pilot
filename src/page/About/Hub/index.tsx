import { Button } from 'antd';
const Hub: React.FC = () => {
  return(
    <div className="flex flex-row  min-h-screen gap-4 font-bold text-base text-white transition-opacity duration-700 relative justify-center p-10">
        <div className='flex flex-col gap-3  text-4xl '>
            <span className='inline-block '>解放个体潜能：<span className='text-cyan-500'>从工具到</span></span>
            <span className='inline-block text-cyan-500'>伙伴</span>
            <div  className="flex flex-row gap-8">
                <Button style={{ backgroundColor: "#ffb224",color: "black",borderRadius: "30px",border: "none",padding: "10px 20px",fontWeight: "bold",transition: "all 0.3s ease"}}>
                    News
                </Button>
                <Button style={{ backgroundColor: "#ffb224",color: "black",borderRadius: "30px",border: "none",padding: "10px 20px",fontWeight: "bold",transition: "all 0.3s ease"}}>
                    News
            </Button>
        </div>
        </div> 
    
        <div className='flex flex-col gap-2'>
            <span className='inline-block'>打造你的个人 AI 助手和专业团队，与 AI 携手推进你的创意事业、写作项目、</span>
            <span className='inline-block'>学习征途和职业任务。从此，指挥一个专门的小组来应对特定挑战，提升工作效率，</span>
            <span className='inline-block'>在个体崛起的时代中脱颖而出。这将在 LobeChat 中成为现实。</span>
        </div>
    </div>
  )
}

export default Hub;