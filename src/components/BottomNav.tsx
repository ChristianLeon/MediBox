type Tab = "inventario" | "agregar" | "alertas" | "catalogo";

interface Props {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: Props) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: "inventario", label: "Inventario", icon: "💊" },
    { id: "agregar", label: "Agregar", icon: "➕" },
    { id: "alertas", label: "Alertas", icon: "⚠️" },
    { id: "catalogo", label: "Catálogo", icon: "📚" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div className="max-w-5xl mx-auto grid grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`py-2 text-xs flex flex-col items-center gap-1 ${
              activeTab === item.id
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}