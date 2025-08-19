# HyperTrack

📊 HyperTrack is an open-source PnL and Trade History Explorer for the Hyperliquid chain.
It pulls your complete trading history via Hyperliquid APIs and gives you clean insights, visualizations, and exports for accounting and tax reporting.

## ✨ Features

  - 📈 PnL Charts – Visualize profit & loss over time
  - 🎯 Win/Loss % – See your trading performance at a glance
  - 💰 Asset Breakdown – Know which assets drive your PnL
  - 📊 Volume by Day – Spot trading activity trends
  - 📤 CSV Export – Simplify accounting & tax filings
  - 💻 Open Source – Built with React/Next.js, minimal backend

## 🛠️ Tech Stack

  - Frontend: React + Next.js + Tailwind CSS
  - Backend: Node.js + Express (minimal API proxy)
  - Data Source: Hyperliquid API
  - Charts: Recharts / Chart.js

## 🚀 Getting Started
1. Clone the repo

        git clone https://github.com/your-username/hypertrack.git
        cd hypertrack

2. Install dependencies
   
        npm install

3. Configure environment variables

        Create a .env.local file and add your Hyperliquid API settings if required:
        NEXT_PUBLIC_HYPERLIQUID_API=https://api.hyperliquid.xyz

4. Run the app locally

         npm run dev
         Visit: http://localhost:3000

## 📊 Example Dashboard

  - PnL over time (line chart)
  - Win rate donut chart
  - Asset allocation bar chart
  - Export trades as CSV

## 📂 Project Structure

        hypertrack/
         ├── backend/           # Minimal API proxy
         ├── components/        # Reusable React components
         ├── pages/             # Next.js pages
         ├── public/            # Static assets
         ├── styles/            # Tailwind CSS styles
         └── utils/             # API + helper functions

## 🤝 Contributing

  - We welcome contributions! 🚀
  - Open issues for bugs & feature requests
  - Submit PRs for improvements
  - Help us improve documentation

## 📜 License

  - MIT License – free to use, modify, and share.

