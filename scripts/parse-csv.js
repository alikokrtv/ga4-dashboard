// CSV verilerini parse edip dashboard için JSON oluşturur
const fs = require('fs');
const path = require('path');

// CSV dosyasını oku ve parse et
function parseCSV(filename) {
  const content = fs.readFileSync(path.join(__dirname, '..', filename), 'utf-8');
  const lines = content.split('\n');
  
  const data = {
    period: '',
    dailyUsers: [],
    dailyNewUsers: [],
    dailyEngagement: [],
    dailyRevenue: [],
    channels: [],
    countries: [],
    products: [],
    totalRevenue: 0
  };
  
  let section = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Period detection
    if (line.includes('Başlangıç tarihi:')) {
      const start = line.match(/(\d{8})/)?.[1];
      if (start) {
        data.startDate = start;
      }
    }
    if (line.includes('Bitiş tarihi:')) {
      const end = line.match(/(\d{8})/)?.[1];
      if (end) {
        data.endDate = end;
      }
    }
    
    // Section detection
    if (line.includes('Etkin kullanıcı sayısı') && line.startsWith('N. gün')) {
      section = 'users';
      continue;
    }
    if (line.includes('Yeni kullanıcı sayısı') && line.startsWith('N. gün')) {
      section = 'newUsers';
      continue;
    }
    if (line.includes('ortalama etkileşim süresi') && line.startsWith('N. gün')) {
      section = 'engagement';
      continue;
    }
    if (line.includes('Toplam gelir') && line.startsWith('N. gün')) {
      section = 'revenue';
      continue;
    }
    if (line.includes('birincil kanal grubu') && line.includes('Yeni kullanıcı sayısı')) {
      section = 'channels';
      continue;
    }
    if (line.includes('Ülke,Etkin kullanıcı sayısı')) {
      section = 'countries';
      continue;
    }
    if (line.includes('Ürün adı,Satın alınan ürünler')) {
      section = 'products';
      continue;
    }
    
    // Parse data based on section
    if (line.startsWith('#') || line === '') {
      section = '';
      continue;
    }
    
    const parts = line.split(',');
    
    if (section === 'users' && parts.length === 2) {
      const value = parseFloat(parts[1]);
      if (!isNaN(value)) data.dailyUsers.push(value);
    }
    
    if (section === 'newUsers' && parts.length === 2) {
      const value = parseFloat(parts[1]);
      if (!isNaN(value)) data.dailyNewUsers.push(value);
    }
    
    if (section === 'engagement' && parts.length === 2) {
      const value = parseFloat(parts[1]);
      if (!isNaN(value)) data.dailyEngagement.push(value);
    }
    
    if (section === 'revenue' && parts.length === 2) {
      const value = parseFloat(parts[1]);
      if (!isNaN(value)) {
        data.dailyRevenue.push(value);
        data.totalRevenue += value;
      }
    }
    
    if (section === 'channels' && parts.length === 2 && parts[0] !== 'İlk kullanıcı birincil kanal grubu (Varsayılan Kanal Grubu)') {
      const value = parseInt(parts[1]);
      if (!isNaN(value)) {
        data.channels.push({ name: parts[0], value });
      }
    }
    
    if (section === 'countries' && parts.length === 2 && parts[0] !== 'Ülke') {
      const value = parseInt(parts[1]);
      if (!isNaN(value)) {
        data.countries.push({ country: parts[0], users: value });
      }
    }
    
    if (section === 'products' && parts.length === 2 && parts[0] !== 'Ürün adı') {
      const qty = parseInt(parts[1]);
      if (!isNaN(qty) && parts[0]) {
        data.products.push({ name: parts[0].replace(/^"|"$/g, ''), qty });
      }
    }
  }
  
  return data;
}

// Ana fonksiyon
function main() {
  const files = [
    { name: 'Raporlar_anlık_görüntüsü.csv', label: 'Ocak' },
    { name: 'Raporlar_anlık_görüntüsü (1).csv', label: 'Şubat' },
    { name: 'Raporlar_anlık_görüntüsü (2).csv', label: 'Mart' },
    { name: 'Raporlar_anlık_görüntüsü (3).csv', label: 'Nisan' },
    { name: 'Raporlar_anlık_görüntüsü (4).csv', label: 'Mayıs' },
    { name: 'Raporlar_anlık_görüntüsü (5).csv', label: 'Haziran' },
    { name: 'Raporlar_anlık_görüntüsü (6).csv', label: 'Temmuz' },
    { name: 'Raporlar_anlık_görüntüsü (7).csv', label: 'Ağustos' },
    { name: 'Raporlar_anlık_görüntüsü (9).csv', label: 'Eylül-Ekim' }
  ];
  
  const allData = {};
  
  files.forEach(file => {
    try {
      console.log(`Parsing ${file.name}...`);
      const data = parseCSV(file.name);
      allData[file.label] = {
        ...data,
        totalUsers: data.dailyUsers.reduce((a, b) => a + b, 0),
        totalNewUsers: data.dailyNewUsers.reduce((a, b) => a + b, 0),
        avgEngagement: data.dailyEngagement.reduce((a, b) => a + b, 0) / data.dailyEngagement.length,
        avgUsers: data.dailyUsers.reduce((a, b) => a + b, 0) / data.dailyUsers.length,
      };
    } catch (err) {
      console.error(`Error parsing ${file.name}:`, err.message);
    }
  });
  
  // JSON olarak kaydet
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'ga4-data.json'),
    JSON.stringify(allData, null, 2)
  );
  
  console.log('\n✅ Veriler başarıyla parse edildi!');
  console.log(`📁 Dosya: src/data/ga4-data.json`);
}

main();

