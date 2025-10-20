import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Legend, CartesianGrid } from "recharts";
import { Calendar, Globe, TrendingUp, Users2, TimerReset, DollarSign, Table as TableIcon } from "lucide-react";

/**
 * Technofashion.com GA4 Dashboard
 * Gerçek veriler: CSV'lerden alınmıştır (Ocak-Ekim 2025)
 * Karşılaştırma: Önceki aylar (Oca-Ağu) vs. Senin Dönemin (1 Eyl - 20 Eki 2025)
 */

// Aylık toplam veriler (CSV'lerden hesaplandı)
const monthlyData = [
  { month: "Ocak", users: 1580, newUsers: 1401, avgEngagement: 37.0, revenue: 109.09 },
  { month: "Şubat", users: 1354, newUsers: 1145, avgEngagement: 33.1, revenue: 56.22 },
  { month: "Mart", users: 2084, newUsers: 1812, avgEngagement: 43.8, revenue: 21.2 },
  { month: "Nisan", users: 1473, newUsers: 1373, avgEngagement: 35.6, revenue: 34.89 },
  { month: "Mayıs", users: 1420, newUsers: 1268, avgEngagement: 39.8, revenue: 0 },
  { month: "Haziran", users: 1270, newUsers: 1119, avgEngagement: 38.7, revenue: 29.89 },
  { month: "Temmuz", users: 1237, newUsers: 1187, avgEngagement: 38.7, revenue: 59.78 },
  { month: "Ağustos", users: 1191, newUsers: 1059, avgEngagement: 31.3, revenue: 524.95 },
];

// Senin Dönemin: 1 Eylül - 20 Ekim 2025 (50 gün)
const yourPeriod = {
  users: 2754, // Toplam 50 gün
  newUsers: 2754,
  avgUsers: 55.1, // Günlük ortalama
  avgEngagement: 26.5,
  revenue: 251.14,
  days: 50,
  // Haftalık dağılım (13-19 Ekim - CSV'den)
  weekdays: [
    { day: "Pzt", users: 115, date: "13 Eki" },
    { day: "Sal", users: 115, date: "14 Eki" },
    { day: "Çar", users: 74, date: "15 Eki" },
    { day: "Per", users: 79, date: "16 Eki" },
    { day: "Cum", users: 115, date: "17 Eki" },
    { day: "Cmt", users: 269, date: "18 Eki" },
    { day: "Paz", users: 160, date: "19 Eki" },
  ],
};

// Önceki 8 ay ortalaması
const previousMonthsAvg = {
  users: Math.round(monthlyData.reduce((a, b) => a + b.users, 0) / monthlyData.length),
  newUsers: Math.round(monthlyData.reduce((a, b) => a + b.newUsers, 0) / monthlyData.length),
  avgEngagement: Math.round(monthlyData.reduce((a, b) => a + b.avgEngagement, 0) / monthlyData.length),
  revenue: Math.round(monthlyData.reduce((a, b) => a + b.revenue, 0) / monthlyData.length),
};

// Kanal dağılımı (1 Eyl - 20 Eki)
const channels = [
  { name: "Direct", value: 1344 },
  { name: "Organic Search", value: 697 },
  { name: "Cross-network", value: 466 },
  { name: "Unassigned", value: 226 },
  { name: "Organic Shopping", value: 161 },
  { name: "Referral", value: 125 },
  { name: "Paid Shopping", value: 59 },
  { name: "Paid Search", value: 16 },
];

// Ülke dağılımı (1 Eyl - 20 Eki - Top 7)
const countries = [
  { country: "United States", users: 1094, flag: "🇺🇸" },
  { country: "Türkiye", users: 390, flag: "🇹🇷" },
  { country: "China", users: 358, flag: "🇨🇳" },
  { country: "Singapore", users: 227, flag: "🇸🇬" },
  { country: "India", users: 76, flag: "🇮🇳" },
  { country: "Brazil", users: 65, flag: "🇧🇷" },
  { country: "Netherlands", users: 64, flag: "🇳🇱" },
];

// En çok satan ürünler (Ağustos ayı - önceki dönem)
const productsBefore = [
  { name: "Portable BT Speaker", qty: 5 },
  { name: "SP400 Speaker", qty: 5 },
  { name: "Urban SP610", qty: 3 },
  { name: "Usb-C to Usb-A C20", qty: 1 },
  { name: "Body Tracker Scale", qty: 1 },
];

// Senin dönemdeki satışlar (1 Eyl - 20 Eki)
const productsAfter = [
  { name: "Urban SP610", qty: 3 },
  { name: "Body Tracker Scale", qty: 1 },
  { name: "PH200 Car Holder", qty: 1 },
  { name: "Portable BT Speaker", qty: 1 },
];

// Ay-ay karşılaştırma için dönem bilgisi
const comparisonInfo = {
  before: "Oca–Ağu 2025 (Aylık Ort.)",
  after: "1 Eyl – 20 Eki 2025 (Senin Dönemin)",
  beforeDays: 242, // ~31 gün x 8 ay
  afterDays: 50,
};

const sections = [
  { id: "summary", label: "📊 Özet" },
  { id: "trend", label: "📈 Ay-Ay Trend" },
  { id: "channels", label: "🔗 Kanallar" },
  { id: "countries", label: "🌍 Ülkeler" },
  { id: "weekdays", label: "📅 Haftalık" },
  { id: "sales", label: "💰 Satışlar" },
];

export default function GA4Dashboard() {
  const [active, setActive] = useState("summary");

  // Karşılaştırma metrikleri (Günlük ortalama bazında)
  const dailyBefore = {
    users: Math.round(previousMonthsAvg.users / 30), // Aylık ortalama / 30 gün
    newUsers: Math.round(previousMonthsAvg.newUsers / 30),
    engagement: previousMonthsAvg.avgEngagement,
  };

  const dailyAfter = {
    users: Math.round(yourPeriod.users / yourPeriod.days),
    newUsers: Math.round(yourPeriod.newUsers / yourPeriod.days),
    engagement: yourPeriod.avgEngagement,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Technofashion.com Analytics
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Google Analytics 4 Dashboard • <strong className="text-purple-600">1 Eyl – 20 Eki 2025</strong> Performans Raporu
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 flex-wrap mt-4">
          {sections.map(s => (
            <Button
              key={s.id}
              variant={active === s.id ? "default" : "secondary"}
              className="rounded-xl text-sm"
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </header>

      {/* Sections */}
      {active === "summary" && (
        <div className="space-y-4">
          {/* Ana KPI'lar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard
              icon={<Users2 className="w-5 h-5" />}
              title="Toplam Kullanıcı"
              value={yourPeriod.users}
              subtitle="50 günde"
              color="blue"
            />
            <KPICard
              icon={<Users2 className="w-5 h-5" />}
              title="Günlük Ort."
              value={dailyAfter.users}
              subtitle="kullanıcı/gün"
              color="purple"
            />
            <KPICard
              icon={<TimerReset className="w-5 h-5" />}
              title="Etkileşim"
              value={yourPeriod.avgEngagement}
              suffix=" sn"
              subtitle="ortalama"
              color="green"
            />
            <KPICard
              icon={<DollarSign className="w-5 h-5" />}
              title="Gelir"
              value={yourPeriod.revenue}
              prefix="$"
              subtitle="toplam"
              color="orange"
            />
          </div>

          {/* Karşılaştırma */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CompareCard
              title="Günlük Kullanıcı"
              before={dailyBefore.users}
              after={dailyAfter.users}
              label="Önceki aylar ort."
            />
            <CompareCard
              title="Yeni Kullanıcı (Günlük)"
              before={dailyBefore.newUsers}
              after={dailyAfter.newUsers}
              label="Önceki aylar ort."
            />
            <CompareCard
              title="Etkileşim Süresi"
              before={dailyBefore.engagement}
              after={dailyAfter.engagement}
              suffix=" sn"
              label="Önceki aylar ort."
              reverse
            />
          </div>

          {/* Info Card */}
          <Card className="rounded-2xl shadow-sm border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Dönem Karşılaştırması</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Önceki Dönem:</strong> Ocak–Ağustos 2025 (8 ay, ~242 gün)</p>
                <p>• <strong>Senin Dönemin:</strong> 1 Eylül – 20 Ekim 2025 (50 gün)</p>
                <p>• <strong>Karşılaştırma:</strong> Günlük ortalama bazında hesaplanmıştır</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {active === "trend" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-lg">Aylık Kullanıcı Trendi (Ocak–Ağustos 2025)</h2>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <LineChart data={monthlyData} margin={{ left: 16, right: 16, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="Kullanıcı" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="newUsers" name="Yeni Kullanıcı" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              <p><strong>Not:</strong> Senin dönemin (Eyl-Eki) ayrı gösteriliyor çünkü tam ay değil (50 gün).</p>
            </div>
          </CardContent>
        </Card>
      )}

      {active === "channels" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TableIcon className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-lg">Trafik Kaynakları (Eyl–Eki)</h2>
              </div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={channels} margin={{ left: 16, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Yeni Kullanıcı" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-lg">Haftalık Dağılım (13–19 Eki)</h2>
              </div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={yourPeriod.weekdays}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="Kullanıcı" fill="#10b981" />
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
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-lg">Ülke Dağılımı (1 Eyl – 20 Eki)</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={countries} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="country" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="users" name="Kullanıcı" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700">Top 7 Ülkeler</h3>
                {countries.map((c, i) => (
                  <div key={c.country} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <p className="font-medium text-sm">{c.country}</p>
                        <p className="text-xs text-slate-500">#{i + 1}</p>
                      </div>
                    </div>
                    <p className="font-bold text-blue-600">{c.users.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {active === "weekdays" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-lg">Hafta İçi Performans (13–19 Ekim 2025)</h2>
            </div>
            <div className="w-full h-96">
              <ResponsiveContainer>
                <BarChart data={yourPeriod.weekdays}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" name="Kullanıcı" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {yourPeriod.weekdays.map(d => (
                <div key={d.day} className="text-center p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-slate-600">{d.date}</p>
                  <p className="font-bold text-indigo-600">{d.users}</p>
                  <p className="text-xs text-slate-500">{d.day}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {active === "sales" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-lg">Ürün Satışları – Ağustos</h2>
              </div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={productsBefore}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="qty" name="Adet" fill="#64748b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Dönem:</strong> Ağustos 2025 (önceki ay)</p>
                <p><strong>Toplam:</strong> {productsBefore.reduce((a, b) => a + b.qty, 0)} adet</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border-t-4 border-t-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-lg">Senin Dönemin – Eyl-Eki</h2>
              </div>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <BarChart data={productsAfter}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-10} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="qty" name="Adet" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                <p><strong>Dönem:</strong> 1 Eylül – 20 Ekim 2025</p>
                <p><strong>Toplam:</strong> {productsAfter.reduce((a, b) => a + b.qty, 0)} adet</p>
                <p><strong>Gelir:</strong> ${yourPeriod.revenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 p-4 bg-white rounded-xl shadow-sm border text-xs text-slate-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p>📊 <strong>Veri Kaynağı:</strong> Google Analytics 4 • Technofashion.com</p>
          <p>📅 <strong>Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
          <p>💼 <strong>Senin Dönemin:</strong> 1 Eylül – 20 Ekim 2025 (50 gün)</p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  color?: string;
}

function KPICard({ icon, title, value, prefix = "", suffix = "", subtitle, color = "blue" }: KPICardProps) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors]} text-white`}>
            {icon}
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900">
          {prefix}{formatNumber(value)}{suffix}
        </p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

interface CompareCardProps {
  title: string;
  before: number;
  after: number;
  suffix?: string;
  label?: string;
  reverse?: boolean;
}

function CompareCard({ title, before, after, suffix = "", label, reverse = false }: CompareCardProps) {
  const change = after - before;
  const changePercent = before === 0 ? 0 : ((change / before) * 100);
  const isPositive = reverse ? change < 0 : change > 0;

  return (
    <Card className={`rounded-2xl shadow-sm border-l-4 ${isPositive ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"}`}>
      <CardContent className="p-5">
        <p className="text-slate-600 text-sm mb-2">{title}</p>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold text-slate-900">{formatNumber(after)}{suffix}</span>
          <span className="text-slate-400 text-sm">vs</span>
          <span className="text-sm text-slate-500 line-through">{formatNumber(before)}{suffix}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(1)}%
          </span>
          {label && <span className="text-xs text-slate-500">• {label}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function formatNumber(n: number): string {
  if (typeof n !== "number" || isNaN(n)) return "-";
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(n);
}
