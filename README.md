# InternAuto 🚀

> **Automate Your Future. Shape Your Career. Build Your Path.**

InternAuto is a modern career acceleration platform that streamlines the internship application process, provides AI-driven career guidance, and builds polished resumes.

---

## 🌟 Key Features

- 🤖 **Internshala Automation Bot**: Selenium & `undetected-chromedriver`-powered automated internship applications with anti-bot evasion, skill matching, and intelligent form response generation.
- 💡 **AI Career Guidance**: Powered by Google Gemini (`gemini-2.0-flash`) for personalized roadmaps, project recommendations, and certification suggestions.
- 📄 **Interactive Resume Builder**: Multi-step resume generator with live text/document previews and client-side **PDF** and **DOCX** exports.
- 🔐 **Clerk Authentication**: Secure user management and session handling.
- 💬 **Live Customer Support**: Integrated Tawk.to live chat assistance.
- 🐳 **Dockerized Deployment**: Multi-stage Docker containerization running both React frontend and Python backend.

---

## 📖 Comprehensive Documentation

For complete technical specifications, architecture diagrams, API references, local setup instructions, and troubleshooting, read the **[Full Project Documentation](file:///d:/Projects/InternAuto_project/DOCUMENTATION.md)**.

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run_api_server.py --port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 3. Run with Docker Compose
```bash
docker-compose up --build
```
The application will be accessible at `http://localhost:5000`.
