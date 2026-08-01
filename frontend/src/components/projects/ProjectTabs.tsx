type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = [
  "Overview",
  "Board",
  "Activity",
  "Members",
  "Settings",
];

export default function ProjectTabs({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="mb-8 border-b">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}