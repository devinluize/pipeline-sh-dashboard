# pipeline.sh - Intelligent AI Rerouting CRM & Dashboard

pipeline.sh is a mock AI rerouting API gateway designed to automatically optimize, cache, and fall back LLM requests dynamically. This repository provides a unified React single-page app displaying:
1. **Client Developer Dashboard**: Live telemetry charts, ROI cost-saving transparency calculations, routing configurations, and credentials.
2. **Admin CRM Portal**: Customer health and churn directory, expansion/upsell actions, and downstream model router status indicators.

---

## Getting Started

Follow these steps to run the application locally on your machine:

### 1. Install Dependencies
Run this in the root of the project to install required packages (`react`, `recharts`, `lucide-react`, etc.):
```bash
npm install
```

### 2. Start the Development Server
Run this command to boot up the local dev server:
```bash
npm run dev
```
Once started, open your browser and navigate to the address shown in the terminal, usually:
**[http://localhost:5173/](http://localhost:5173/)**

### 3. Build for Production
To generate a compiled production-ready bundle inside the `dist` directory:
```bash
npm run build
```

---

## Interface Layout & Interaction

- **Portal Toggle**: Use the switch in the top-right of the header to toggle between the client **Developer Hub** and the internal **Admin CRM**.
- **Interactive Weight Sliders**: In the "AI Rerouting" tab under the client dashboard, modify weight allocations to watch average latencies and cache calculations adjust instantly.
- **Simulator Cockpit**: In the bottom of the sidebar, use buttons to simulate traffic spikes, signup activation flows, or trigger an OpenAI downtime failover event to watch the automatic rerouting in action.

---

## Running with Docker

You can containerize the application and serve it via Nginx using Docker.

### Using Docker Compose (Recommended)
To build and run the container in the background:
```bash
docker compose up -d --build
```
Once started, the dashboard will be hosted at **[http://localhost:8080](http://localhost:8080)**.

To stop the containers:
```bash
docker compose down
```

### Using Docker CLI Directly
1. **Build the Docker Image**:
   ```bash
   docker build -t pipeline-dashboard .
   ```
2. **Run the Container**:
   ```bash
   docker run -d -p 8080:80 --name pipeline_dashboard_container pipeline-dashboard
   ```
   Access the dashboard at **[http://localhost:8080](http://localhost:8080)**.

