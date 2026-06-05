import { Truck, RefreshCw, ShieldCheck, Award } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Ücretsiz Kargo",
    subtitle: "500₺ ve üzeri siparişlerde",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: RefreshCw,
    title: "30 Gün İade",
    subtitle: "Koşulsuz iade garantisi",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    subtitle: "256-bit SSL şifrelemesi",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Award,
    title: "Orjinal Ürün",
    subtitle: "%100 orijinallik garantisi",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const TrustBar = () => {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {TRUST_ITEMS.map(({ icon: Icon, title, subtitle, color, bg }) => (
            <div
              key={title}
              className="flex items-center gap-3 py-4 px-3 sm:px-5 hover:bg-gray-50 transition-colors"
            >
              <div className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{title}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-0.5 hidden sm:block">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
