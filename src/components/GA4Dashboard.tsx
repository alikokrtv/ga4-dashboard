import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";
import { Calendar, Globe, TrendingUp, Users2, TimerReset, DollarSign, Table as TableIcon } from "lucide-react";

/**
 * TECHNOTE:
 * Bu komponent, senin paylaştığın GA4 verileriyle (Mart–Ekim 2025 ve özellikle 1 Eyl–20 Eki 2025) 
 * interaktif bir dashboard oluşturur. Veriler local sabitlerde tutulur, istersen değerleri 
 * kolayca düzenleyebilirsin. PDF ya da statik export için sayfayı yazdırabilirsin.
 */

// Yardımcı: sayıları string ("2.6B") gibi geldiğinde numeriğe indirgemek için basit parser
const parseB = (v: string | number): number => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const s = (v + "").trim().toUpperCase();
  if (s.endsWith("B")) return parseFloat(s) * 1000; // "B"'yi bin kabul ediyoruz (binlerce)
  if (s.endsWith("M")) return parseFloat(s);
  return parseFloat(s);
};

// Aylık trend (1 aylık pencere): Görsel ekran görüntülerinden alındı
const monthly = [
  { key: "Mar→Nis", month: "1 Mar – 1 Nis", users: parseB("2.0B"), newUsers: parseB("1.9B"), avg: 48 },
  { key: "Nis→May", month: "1 Nis – 1 May", users: parseB("1.5B"), newUsers: parseB("1.4B"), avg: 36 },
  { key: "May→Haz", month: "1 May – 1 Haz", users: parseB("1.4B"), newUsers: parseB("1.3B"), avg: 42 },
  { key: "Haz→Tem", month: "1 Haz – 1 Tem", users: parseB("1.5B"), newUsers: parseB("1.4B"), avg: 37 },
  { key: "Tem→Ağu", month: "1 Tem – 1 Ağu", users: parseB("1.3B"), newUsers: parseB("1.2B"), avg: 39 },
  { key: "Ağu→Eyl", month: "1 Ağu – 1 Eyl", users: parseB("1.1B"), newUsers: parseB("1.1B"), avg: 31 },
];

// Senin dönem KPI (1 Eyl – 20 Eki 2025)
const kpiAfter = {
  users: parseB("2.6B"),
  newUsers: parseB("2.7B"),
  avg: 27,
  revenue: 251.14,
  momUsers: 1500, // aydan aya net artış
  momPct: 128.8, // %
};

// Önceki toplam özet (1 Oca – 1 Eyl 2025) – kıyaslamak için
const kpiBefore = {
  users: parseB("11B"),
  newUsers: parseB("11B"),
  avg: 41,
  revenue: 904.16,
};

// Haftanın günleri (13–19 Eki)
const weekdays = [
  { day: "Pzt", users: 115 },
  { day: "Sal", users: 115 },
  { day: "Çar", users: 74 },
  { day: "Per", users: 79 },
  { day: "Cum", users: 115 },
  { day: "Cmt", users: 269 },
  { day: "Paz", users: 160 },
];

// Kanal kırılımı – 13–19 Eki "Oturum"
const channelsWeek = [
  { name: "Direct", value: 456 },
  { name: "Cross-network", value: 393 },
  { name: "Organic Search", value: 174 },
  { name: "Unassigned", value: 123 },
  { name: "Organic Shopping", value: 24 },
  { name: "Referral", value: 12 },
  { name: "Paid Search", value: 10 },
];

// Ülke dağılımı – (1 Eyl–20 Eki snapshot)
const countries = [
  { country: "United States", users: 1100 },
  { country: "Türkiye", users: 389 },
  { country: "China", users: 347 },
  { country: "Singapore", users: 222 },
  { country: "India", users: 75 },
  { country: "Brazil", users: 63 },
  { country: "Netherlands", users: 63 },
];

// En çok sayfalar (Eki 13–19, kullanıcılar)
const topPages = [
  { title: "Technofashion", users: 539 },
  { title: "Contact", users: 53 },
  { title: "Account", users: 50 },
  { title: "Mobile Accessories", users: 46 },
  { title: "Audio", users: 40 },
  { title: "Contact information", users: 40 },
  { title: "Create Account", users: 40 },
  { title: "Speakers", users: 36 },
  { title: "404 Not Found", users: 31 },
  { title: "Nautica Portable Bluetooth Speaker", users: 26 },
];

// Ürün satışları (özet)
const salesBefore = [
  { name: "Nautica Portable BT Speaker", qty: 5 },
  { name: "Nautica SP400 Speaker", qty: 5 },
  { name: "Nautica Urban SP610", qty: 4 },
  { name: "Usb-C to Usb-A C20", qty: 3 },
  { name: "Usb-C to Usb-C C30", qty: 2 },
  { name: "Headphones H120", qty: 1 },
  { name: "Body Tracker Scale", qty: 1 },
];

const salesAfter = [
  { name: "Urban SP610", qty: 3 },
  { name: "Portable BT Speaker", qty: 1 },
  { name: "PH200 Car Holder", qty: 1 },
  { name: "Body Tracker Scale", qty: 1 },
];

const sections = [
  { id: "summary", label: "Özet" },
  { id: "trend", label: "Trend" },
  { id: "channels", label: "Kanallar" },
  { id: "countries", label: "Ülkeler" },
  { id: "pages", label: "Sayfalar" },
  { id: "weekdays", label: "Hafta Günleri" },
  { id: "sales", label: "Satışlar" },
];

export default function GA4Dashboard() {
  const [active, setActive] = useState("summary");
  const avgBefore = useMemo(() => {
    // Mart–Ağustos ortalama (monthly array)
    const totalUsers = monthly.reduce((a, b) => a + b.users, 0);
    const totalNew = monthly.reduce((a, b) => a + b.newUsers, 0);
    const avg = monthly.reduce((a, b) => a + b.avg, 0) / monthly.length;
    return { users: Math.round(totalUsers / monthly.length), newUsers: Math.round(totalNew / monthly.length), avg: Math.round(avg) };
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technofashion.com • GA4 Dashboard</h1>
          <p className="text-neutral-600">Karşılaştırma odağı: <strong>1 Eyl – 20 Eki 2025</strong> vs. <strong>Mart–Ağustos ortalaması</strong></p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {sections.map(s => (
            <Button key={s.id} variant={active === s.id ? "default" : "secondary"} className="rounded-2xl" onClick={() => setActive(s.id)}>
              {s.label}
            </Button>
          ))}
        </div>
      </header>

      {active === "summary" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPI icon={<Users2 className="w-5 h-5" />} title="Etkin Kullanıcı (Eyl–Eki)" value={kpiAfter.users} suffix="k" tooltip="B = bin varsayıldı" />
          <KPI icon={<Users2 className="w-5 h-5" />} title="Yeni Kullanıcı (Eyl–Eki)" value={kpiAfter.newUsers} suffix="k" />
          <KPI icon={<TimerReset className="w-5 h-5" />} title="Ort. Etkileşim (sn)" value={kpiAfter.avg} />
          <KPI icon={<DollarSign className="w-5 h-5" />} title="Gelir (USD)" value={kpiAfter.revenue} prefix="$" />

          <Compare before={avgBefore.users} after={kpiAfter.users} title="Aylık Ortalama Kullanıcı" />
          <Compare before={avgBefore.newUsers} after={kpiAfter.newUsers} title="Aylık Ortalama Yeni Kullanıcı" />
          <Compare before={avgBefore.avg} after={kpiAfter.avg} title="Ort. Etkileşim Süresi (sn)" reverse />
          <DeltaCard title="Aydan Aya Artış" value={kpiAfter.momUsers} pct={kpiAfter.momPct} />
        </div>
      )}

      {active === "trend" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5"/><h2 className="font-semibold text-lg">Aylık Trend (Kullanıcı & Yeni Kullanıcı)</h2></div>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <LineChart data={monthly} margin={{ left: 16, right: 16, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="Kullanıcı (k)" />
                  <Line type="monotone" dataKey="newUsers" name="Yeni Kullanıcı (k)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {active === "channels" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4"><TableIcon className="w-5 h-5"/><h2 className="font-semibold text-lg">Kanal Kırılımı (13–19 Eki • Oturum)</h2></div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={channelsWeek} margin={{ left: 16, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Oturum" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5"/><h2 className="font-semibold text-lg">Haftanın Günleri (13–19 Eki • Kullanıcı)</h2></div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={weekdays}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="Kullanıcı" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {active === "countries" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4"><Globe className="w-5 h-5"/><h2 className="font-semibold text-lg">Ülke Dağılımı (Eyl–Eki)</h2></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={countries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="Kullanıcı" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={countries} dataKey="users" nameKey="country" outerRadius={120} label />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {active === "pages" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4"><TableIcon className="w-5 h-5"/><h2 className="font-semibold text-lg">En Çok Ziyaret Edilen Sayfalar (13–19 Eki)</h2></div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="py-2 pr-3">#</th>
                    <th className="py-2 pr-3">Sayfa</th>
                    <th className="py-2">Kullanıcı</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p, i) => (
                    <tr key={p.title} className="border-b last:border-0">
                      <td className="py-2 pr-3">{i + 1}</td>
                      <td className="py-2 pr-3">{p.title}</td>
                      <td className="py-2">{p.users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {active === "sales" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5"/><h2 className="font-semibold text-lg">Satışlar – Sen Öncesi (1 Oca – 1 Eyl)</h2></div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={salesBefore}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} height={80} angle={-15} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="qty" name="Adet" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5"/><h2 className="font-semibold text-lg">Satışlar – Senin Dönemin (1 Eyl – 20 Eki)</h2></div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={salesAfter}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} height={60} angle={-10} textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="qty" name="Adet" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="mt-8 text-xs text-neutral-500">
        Veriler: GA4 ekran görüntülerinden manuel aktarım (Mar–Eki 2025). "B" son eki görsellerde geçtiği için bu dashboard'ta **bin** (k) olarak yorumlanmıştır. İstersen değerleri gerçek sayılarına güncelleyebiliriz.
      </footer>
    </div>
  );
}

interface KPIProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  tooltip?: string;
}

function KPI({ title, value, prefix = "", suffix = "", icon }: KPIProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-500 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{prefix}{formatNum(value)}{suffix}</p>
          </div>
          <div className="p-2 rounded-xl bg-neutral-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CompareProps {
  title: string;
  before: number;
  after: number;
  reverse?: boolean;
}

function Compare({ title, before, after, reverse = false }: CompareProps) {
  const delta = (after - before);
  const pct = (before === 0 ? 0 : (delta / before) * 100);
  const good = reverse ? after < before : after > before;
  return (
    <Card className={`rounded-2xl shadow-sm ${good ? "border-green-200" : "border-red-200"}`}>
      <CardContent className="p-5">
        <p className="text-neutral-500 text-sm">{title}</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-xl font-semibold">{formatNum(after)}</span>
          <span className="text-neutral-400">vs</span>
          <span className="text-sm text-neutral-500 line-through">{formatNum(before)}</span>
        </div>
        <p className={`mt-1 text-sm ${good ? "text-green-600" : "text-red-600"}`}>
          {good ? "▲" : "▼"} {pct.toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  );
}

interface DeltaCardProps {
  title: string;
  value: number;
  pct: number;
}

function DeltaCard({ title, value, pct }: DeltaCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <p className="text-neutral-500 text-sm">{title}</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-xl font-semibold">+{formatNum(value)}</span>
          <span className="text-sm text-green-600">(+{pct}%)</span>
        </div>
      </CardContent>
    </Card>
  );
}

function formatNum(n: number): string {
  if (typeof n !== "number" || isNaN(n)) return "-";
  // 1000'lik gösterim (kısaltmasız) – büyük değerler için kısa format
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return new Intl.NumberFormat("tr-TR").format(n);
}

