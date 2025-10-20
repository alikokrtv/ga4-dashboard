import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users2, Clock, DollarSign, TrendingUp } from "lucide-react";

/**
 * Technofashion.com - Basit GA4 Raporu
 * Senin Dönemin: 1 Eylül - 20 Ekim 2025
 */

// Senin döneminin verileri
const myData = {
  totalUsers: 2754,
  dailyAvg: 55,
  engagement: 27, // saniye
  revenue: 251.14,
  days: 50
};

// Haftalık (son hafta)
const weekData = [
  { day: "Pzt", users: 115 },
  { day: "Sal", users: 115 },
  { day: "Çar", users: 74 },
  { day: "Per", users: 79 },
  { day: "Cum", users: 115 },
  { day: "Cmt", users: 269 },
  { day: "Paz", users: 160 }
];

// Top 5 ülke
const countries = [
  { name: "ABD", users: 1094, color: "#3b82f6" },
  { name: "Türkiye", users: 390, color: "#8b5cf6" },
  { name: "Çin", users: 358, color: "#10b981" },
  { name: "Singapur", users: 227, color: "#f59e0b" },
  { name: "Hindistan", users: 76, color: "#ef4444" }
];

// Nereden geldiler
const channels = [
  { name: "Direkt", users: 1344 },
  { name: "Google", users: 697 },
  { name: "Diğer", users: 713 }
];

export default function GA4Dashboard() {
  const [page, setPage] = useState("main");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      
      {/* Başlık */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-white px-8 py-6 rounded-2xl shadow-lg">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            📊 Technofashion.com
          </h1>
          <p className="text-gray-700 text-xl font-semibold">
            1 Eylül - 20 Ekim 2025
          </p>
          <p className="text-purple-600 font-bold text-lg mt-1">
            ⏱ 50 Gün Performans Raporu
          </p>
        </div>
      </div>

      {/* Menü */}
      <div className="flex gap-3 justify-center mb-8 flex-wrap">
        <Button 
          variant={page === "main" ? "default" : "secondary"} 
          onClick={() => setPage("main")}
          className="text-lg px-6"
        >
          🏠 Ana Sayfa
        </Button>
        <Button 
          variant={page === "details" ? "default" : "secondary"} 
          onClick={() => setPage("details")}
          className="text-lg px-6"
        >
          📈 Detaylar
        </Button>
      </div>

      {/* ANA SAYFA */}
      {page === "main" && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Büyük Rakamlar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card className="bg-white border-2 border-blue-200">
              <CardContent className="p-8 text-center">
                <Users2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Toplam Kullanıcı</p>
                <p className="text-5xl font-bold text-blue-600">{myData.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">50 günde</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-purple-200">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Günlük Ortalama</p>
                <p className="text-5xl font-bold text-purple-600">{myData.dailyAvg}</p>
                <p className="text-sm text-gray-500 mt-2">kullanıcı/gün</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-green-200">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Ortalama Süre</p>
                <p className="text-5xl font-bold text-green-600">{myData.engagement}</p>
                <p className="text-sm text-gray-500 mt-2">saniye</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-orange-200">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Toplam Gelir</p>
                <p className="text-5xl font-bold text-orange-600">${myData.revenue}</p>
                <p className="text-sm text-gray-500 mt-2">50 günde</p>
              </CardContent>
            </Card>

          </div>

          {/* Haftalık Grafik */}
          <Card className="bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📅 Son Hafta (13-19 Ekim)
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <XAxis dataKey="day" style={{ fontSize: '16px', fontWeight: 'bold' }} />
                    <YAxis style={{ fontSize: '14px' }} />
                    <Tooltip 
                      contentStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                      labelStyle={{ fontSize: '14px' }}
                    />
                    <Bar dataKey="users" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* DETAYLAR SAYFASI */}
      {page === "details" && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Ülkeler */}
          <Card className="bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🌍 Hangi Ülkelerden Geldiler?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Pasta Grafik */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={countries}
                        dataKey="users"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.name}: ${entry.users}`}
                        labelLine={true}
                      >
                        {countries.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Liste */}
                <div className="space-y-4">
                  {countries.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-gray-400">#{i + 1}</span>
                        <span className="text-xl font-semibold">{c.name}</span>
                      </div>
                      <span className="text-2xl font-bold" style={{ color: c.color }}>
                        {c.users.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="p-4 bg-blue-50 rounded-lg mt-4">
                    <p className="text-center text-gray-700 font-semibold">
                      Toplam: {countries.reduce((a, b) => a + b.users, 0).toLocaleString()} kullanıcı
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Nereden Geldiler */}
          <Card className="bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🔗 Nereden Geldiler?
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channels} layout="vertical">
                    <XAxis type="number" style={{ fontSize: '14px' }} />
                    <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '16px', fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ fontSize: '16px', fontWeight: 'bold' }} />
                    <Bar dataKey="users" fill="#3b82f6" radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {channels.map((ch, i) => (
                  <div key={i} className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">{ch.name}</p>
                    <p className="text-3xl font-bold text-blue-600">{ch.users.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* Alt Bilgi */}
      <div className="max-w-6xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>📊 Google Analytics 4 • Technofashion.com</p>
        <p className="mt-1">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
      </div>

    </div>
  );
}
