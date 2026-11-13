# 🌾 Crop Guard AI

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=flat&logo=leaflet)](https://leafletjs.com/)

**Crop Guard AI** is an intelligent, AI-powered agricultural monitoring and decision-support platform. Engineered to empower farmers, agronomists, and agricultural enterprises, Crop Guard AI combines real-time IoT sensor telemetry, geospatial field mapping, predictive disease/pest risk modeling, and soil condition analytics into a unified, high-performance dashboard.

---

## 🚀 Key Features

### 🌿 Real-Time Crop Health Monitoring
- **Zonal Health Analysis**: Interactive field maps highlighting zones categorized as *Healthy*, *Warning*, or *Critical*.
- **Vegetation Indices & NDVI Tracking**: Track crop vigor, biomass density, and canopy stress over time.
- **Trend Plotting**: Visual representation of vegetative health evolution across seasons.

### 🐛 AI Pest & Disease Risk Engine
- **Early Warning System**: Predict pest infestation probabilities (e.g., aphids, armyworms, blight) before visual symptoms appear.
- **Severity Scoring**: Prioritize interventions with automated impact and affected area estimations.
- **Actionable Mitigations**: Receive agronomist-verified mitigation steps and treatment recommendations.

### 🧪 Soil Condition & Microclimate Telemetry
- **NPK & pH Monitoring**: Real-time metrics for Nitrogen (N), Phosphorus (P), Potassium (K), and soil pH against optimal agronomic thresholds.
- **Moisture & Temperature**: Continuous telemetry for soil volumetric moisture, temperature, and electrical conductivity ($dS/m$).

### 🗺️ Geospatial Field Mapping (GIS)
- **Interactive Leaflet Maps**: Visualize user-defined field boundaries, GPS location tracking, and sensor overlays.
- **Location Caching**: Offline-first location data storage and background synchronization.

### 🔔 Smart Alert & Notification Center
- **Tiered Severity Alerts**: Filter warnings by Critical, Medium, and Low severity.
- **Multi-Category Grouping**: Triage alerts by Pest, Irrigation, Weather, Disease, and System status.
- **Resolution Tracking**: Acknowledge, resolve, and audit incidents to minimize crop loss.

### 🔐 Enterprise-Grade Security
- Secure JWT-based authentication and session handling.
- Cryptographically hashed passwords with `bcryptjs`.
- Location-based multi-farm access controls backed by Prisma ORM and PostgreSQL.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), `next-themes` (Dark/Light Mode) |
| **Data Visualization** | [Recharts](https://recharts.org/), [Embla Carousel](https://www.embla-carousel.com/) |
| **Geospatial & Maps** | [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) |
| **ORM & Database** | [Prisma ORM](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/) |
| **Auth & Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Validation** | [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/) |

---

## 📂 Project Structure

```text
crop-guard-ai/
├── app/
│   ├── alerts/             # Pest, disease, and weather alert center
│   ├── analytics/          # Yield projections & resource efficiency analytics
│   ├── api/                # Next.js API route handlers
│   │   ├── location/       # User GPS and field location endpoints
│   │   ├── login/          # JWT authentication endpoint
│   │   └── signup/         # Account creation & password hashing
│   ├── crop-health/        # Zonal crop health map & NDVI trend analysis
│   ├── dashboard/          # Central telemetry & field status overview
│   ├── fields/             # Field boundary management & map controls
│   ├── login/              # Farmer & agronomist sign-in portal
│   ├── reports/            # Farm summary reports & export features
│   ├── signup/             # Registration portal
│   ├── globals.css         # Global Tailwind CSS configurations
│   └── page.tsx            # Landing page
├── components/
│   ├── agriculture/        # Specialized agronomy UI widgets (metric cards, status badges)
│   ├── auth/               # Route guard wrappers & session validators
│   ├── dashboard/          # Crop health maps, soil cards, risk plots
│   ├── layout/             # Responsive sidebar & navigation headers
│   └── ui/                 # Reusable shadcn/Radix UI primitive components
├── hooks/                  # Custom React hooks (location data, telemetry listeners)
├── prisma/
│   ├── schema.prisma       # Database schema (User, Location models)
│   └── migrations/         # PostgreSQL migration history
├── public/                 # Static assets, SVG icons, and maps
├── utils/                  # API client wrappers & location data services
├── .gitignore              # Multi-tier secret & environment isolation rules
└── package.json            # Project manifest & dependency configuration
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm** / **yarn** / **pnpm**
- **PostgreSQL**: Local instance or hosted service (e.g., Supabase, Neon, AWS RDS)

### 1. Clone the Repository
```bash
git clone https://github.com/nitingupta95/crop-guard-ai.git
cd crop-guard-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database Connection URL (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/crop_guard_db?schema=public"

# Authentication Secrets
JWT_SECRET="your-super-secret-jwt-key-replace-in-production"

# Next.js Public Endpoints
NEXT_PUBLIC_API_URL="/api"
```

> [!NOTE]
> Never commit actual `.env` files with production credentials to source control. A comprehensive [.gitignore](file:///.gitignore) is provided to protect credentials and keys.

### 4. Run Database Migrations
Initialize the database tables with Prisma:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:
```bash
npx prisma generate
```

### 5. Launch the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles the production build |
| `npm run start` | Boots the compiled production server |
| `npm run lint` | Runs ESLint checks across codebase |
| `npx prisma studio` | Opens Prisma GUI to inspect and manage database records |

---

## 🔒 Security & Safe Secrets Management
All sensitive credentials, API keys, service accounts, and environment configurations are strictly excluded from git tracking through [.gitignore](file:///.gitignore).

For sharing configuration schemas with teammates, maintain mock values in `.env.example` without exposing production keys.

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

