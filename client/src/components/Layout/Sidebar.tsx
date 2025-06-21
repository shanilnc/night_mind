import {
  MessageCircle,
  BookOpen,
  BarChart3,
  Settings,
  Moon,
} from "lucide-react";

interface SidebarProps {
  activeView: "chat" | "journal" | "dashboard";
  onViewChange: (view: "chat" | "journal" | "dashboard") => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "chat" as const, label: "Chat", icon: MessageCircle },
    { id: "journal" as const, label: "Journal", icon: BookOpen },
    { id: "dashboard" as const, label: "Insights", icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Moon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold">NightMind</h1>
            <p className="text-slate-400 text-xs">AI Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
