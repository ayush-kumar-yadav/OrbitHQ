type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = ["Overview", "Board", "Activity", "Members", "Settings"];

export default function ProjectTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              active
                ? "text-white"
                : "text-[#626775] hover:text-[#AEB2BD]"
            }`}
          >
            {tab}
            {active && (
              <span className="absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-[#4C6FFF] shadow-[0_0_8px_rgba(76,111,255,0.8)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}