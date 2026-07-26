
# AI Resume Analyzer

A small React + Vite application that analyzes resumes (PDF) and provides an ATS-style score, summary, and visual feedback to help improve resumes.

## Features

- Upload PDF resumes and preview parsed content
- ATS scoring and visual score badges/gauges
- Resume summary and suggestions
- Lightweight, client-first processing using pdf.js

## Tech stack

- Vite + React + TypeScript
- pdf.js (worker provided in `public/`)
- Simple component structure under `app/components`

## Quick start

Install dependencies and run the dev server:

```bash
npm install
npm run dev
# then open http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

## Docker

Build and run the included Docker image:

```bash
docker build -t ai-resume-analyzer .
docker run -p 5173:5173 ai-resume-analyzer
```

## Project structure (brief)

- app/: main frontend source, routes and components
- public/: static assets (includes `pdf.worker.min.mjs`)
- lib/: helper utilities for PDF handling and parsing
- types/: project type declarations

## Contributing

Contributions are welcome — open an issue or PR with suggested improvements.

## License

MIT — feel free to change to your preferred license.
