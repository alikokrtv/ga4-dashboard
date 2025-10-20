# Technofashion GA4 Dashboard

Interactive analytics dashboard for Technofashion.com built with React, TypeScript, and Recharts. Displays Google Analytics 4 data including user metrics, engagement statistics, sales data, and geographic distribution.

## Features

✨ **Interactive Visualizations**
- Monthly trend analysis (Line charts)
- Channel breakdown (Bar charts)
- Geographic distribution (Bar + Pie charts)
- Weekly user patterns
- Sales comparison

📊 **Key Metrics**
- Active Users & New Users
- Average Engagement Time
- Revenue Tracking
- Month-over-Month Growth
- Geographic Distribution
- Top Pages Analysis

🎨 **Modern UI**
- Responsive design with Tailwind CSS
- Tab-based navigation
- Clean card-based layout
- Mobile-friendly interface

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide Icons** - Icon library
- **shadcn/ui** - UI components

## Getting Started

### Prerequisites

- Node.js 16+ or later
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "web report"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
web report/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx      # Button component
│   │   │   └── card.tsx        # Card components
│   │   └── GA4Dashboard.tsx    # Main dashboard component
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # Type declarations
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
├── tailwind.config.js           # Tailwind config
└── README.md                    # This file
```

## Customizing Data

The dashboard uses static data defined in `src/components/GA4Dashboard.tsx`. To update the data:

1. Open `src/components/GA4Dashboard.tsx`
2. Modify the data constants at the top of the file:
   - `monthly` - Monthly trend data
   - `kpiAfter` - Current period KPIs
   - `weekdays` - Weekly user data
   - `channelsWeek` - Channel breakdown
   - `countries` - Geographic data
   - `topPages` - Top pages data
   - `salesBefore` & `salesAfter` - Sales data

### Example:

```typescript
const monthly = [
  { key: "Mar→Nis", month: "1 Mar – 1 Nis", users: 2000, newUsers: 1900, avg: 48 },
  // Add more months...
];
```

## Dashboard Sections

1. **Özet (Summary)** - Overview KPIs and comparisons
2. **Trend** - Monthly user trends
3. **Kanallar (Channels)** - Traffic sources and weekday patterns
4. **Ülkeler (Countries)** - Geographic distribution
5. **Sayfalar (Pages)** - Top visited pages
6. **Hafta Günleri (Weekdays)** - Weekly patterns (also in Channels view)
7. **Satışlar (Sales)** - Product sales comparison

## Export to PDF

To create a PDF report:

1. Open the dashboard in your browser
2. Navigate to the section you want to export
3. Use your browser's Print function (Cmd/Ctrl + P)
4. Select "Save as PDF" as the destination
5. Adjust print settings as needed (landscape recommended)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Sections

1. Add a new section object to the `sections` array
2. Create a new conditional block in the render method
3. Add your charts/components using Recharts

### Styling

The project uses Tailwind CSS for styling. Modify `tailwind.config.js` to customize the theme.

## Notes

- Data represents the period: March - October 2025
- Focus comparison: September 1 - October 20, 2025 vs. March-August average
- "B" suffix in original data interpreted as thousands (k)
- All text is in Turkish (Türkçe)

## License

This project is created for internal analytics purposes.

## Support

For questions or issues, please contact the development team.

---

Built with ❤️ for Technofashion.com

