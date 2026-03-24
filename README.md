# MigrantConnect
🌍 MigrantConnect

A Unified Digital Platform for Migrant Worker Inclusion

---

📌 Overview

MigrantConnect is a web-based prototype designed to support migrant workers across India by addressing three critical challenges:

1. Language barriers that limit access to services
2. Lack of awareness of government welfare policies
3. Medical exploitation due to missing or fragmented health records

The platform provides a single, trusted digital interface where migrant workers can access personalized welfare schemes, maintain lifelong medical records, and interact with service providers in their preferred language.

This project is developed as a social-impact solution for the Microsoft Imagine Cup.

---

🎯 Problem Statement

Migrant workers often move across states for employment, facing:

- Inability to understand local languages
- Difficulty accessing state-specific government schemes
- Repeated or unnecessary medical tests due to missing health history
- Dependence on intermediaries, increasing risk of exploitation

There is no unified, portable system that ensures continuity of identity, healthcare, and welfare access across regions.

---

💡 Solution

MigrantConnect introduces a unified digital worker profile that travels with the worker across states.

The platform enables:

- Multilingual access to information
- Transparent and verifiable medical records
- Personalized policy recommendations
- Ethical, consent-based data sharing

This ensures continuity, trust, and empowerment for migrant workers.

---

🧱 Platform Architecture

The system follows a modular and sequential architecture:

```text
MigrantConnect
│
├── Digital Worker Identity
│
├── Language & Accessibility Module
│
├── Policy & Welfare Access Module
│
├── Medical Records & Doctor Interface
│
└── Trust, Security & Consent Layer
```

Each module is designed to be scalable, secure, and cloud-ready.

---

🔑 Key Features

👤 Digital Worker Profile
- Unique Worker ID
- Home state & work state details
- Preferred language
- Portable identity across regions

🌐 Multilingual AI Assistant (NEW)
- **Voice & Chat**: Interactive assistant with Speech-to-Text and Text-to-Speech.
- **Powered by Gemini**: Uses Google's Gemini-1.5-Flash for intelligent, multilingual support.
- **Proactive Help**: Guidance on health, policies, and system navigation.

🏛 Policy & Welfare Hub
- Personalized government scheme suggestions
- Simple eligibility information
- Clear benefit explanations

🏥 Medical Records System
- Lifetime digital health history
- Doctor-side record entry (with consent)
- Prevents repeated or unnecessary tests
- Improves medical transparency

🔐 Ethics & Privacy
- Consent-based data access
- User-controlled records
- Designed with healthcare data sensitivity in mind

---

🛠️ Technology Stack (Prototype)

Frontend
- HTML5 / CSS3 (Tailwind CSS)
- Vanilla JavaScript
- **Web Speech API**: For real-time voice recognition and synthesis.

Backend
- **Python & Flask**: High-performance backend server.
- **Google Gemini AI**: Multilingual LLM for the AI assistant.
- **Firebase Realtime Database**: Primary cloud data store.
- **PyJWT**: Secure token-based authentication.

---

📁 Project Structure

```text
Employee-Health-Hub/
│
├── app.py              # Main Python/Flask Backend
├── ai-assistant.js     # AI Assistant Widget (Voice & Chat)
├── requirements.txt    # Python Dependencies
├── .env.python         # AI & Database Credentials
├── venv/               # Python Virtual Environment
│
├── index.html          # Main application entry point
├── signin.html         # Secure Multi-role Sign-in
├── employee.html       # Patient/Worker Portal
├── hospital.html       # Hospital Management Portal
├── company.html        # Company Admin Dashboard
└── styles.css          # Global UI styling
```

---

▶️ How to Run the Project

### 1. Prerequisites
- Python 3.10 or higher
- `pip` (Python package manager)

### 2. Setup the Backend
1. Clone or download the repository.
2. Open the project folder in your terminal.
3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
4. Activate the virtual environment:
   - **Windows**: `.\venv\Scripts\activate`
   - **macOS/Linux**: `source venv/bin/activate`
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
6. Ensure `.env.python` contains your `GEMINI_API_KEY`.

### 3. Start the Application
1. Run the Flask server:
   ```bash
   python app.py
   ```
2. The server will start on `http://localhost:5000`.

### 4. Access the Frontend
1. Open your web browser and navigate to `http://localhost:5000`.
2. All HTML files are served centrally by the Flask app.
3. Interact with the **AI Assistant** using the floating chat icon on the bottom right.

---

🌱 Future Enhancements

- Role-based authentication (Worker / Doctor / Admin)
- Real-time policy updates via government APIs
- Secure cloud database integration for all users
- Mobile application support (iOS/Android)
- NGO and government analytics dashboards
