import InfoNavigationProps from './interface';

const InfoNavigation: React.FC<InfoNavigationProps> = ({activeSection, onScrollToSection}) => {
    const sections = ["about", "feature","hub", "contact"]
    return (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 p-4">
            <div className="flex flex-col gap-6">
            {sections.map((id) => (
                <button
                    key={id}
                    onClick={() => onScrollToSection(id)}
                    className={`py-0.5 px-0.5 rounded-full transition ${
                        activeSection === id ? "bg-white text-white" : "bg-[#6f6f6f]"
                    }`}
                    >
                </button>
            ))}
            </div>
        </div>

    )
 
}
export default InfoNavigation;