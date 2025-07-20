# 🏥 Disease Diagnosis & Symptom Checker

A comprehensive full-stack web application for exploring diseases and checking symptoms. Built with modern technologies and featuring an intelligent symptom matching system with a database of 395+ diseases.

## 🌟 **Key Features**

### 🔍 **Advanced Disease Database**
- **395+ Diseases**: Comprehensive medical database with detailed information
- **Smart Search**: Search by disease name, symptoms, or medical codes
- **Advanced Filtering**: Filter diseases by contagious/chronic status
- **Pagination**: Optimized browsing with 20 results per page
- **Real-time Results**: Instant search with fuzzy matching

### 🩺 **Intelligent Symptom Checker**
- **Multi-Symptom Input**: Add up to 10 symptoms with dynamic form
- **AI-Powered Matching**: Advanced algorithm ranks diseases by symptom overlap
- **Match Scoring**: Percentage-based matching with confidence scores
- **Ranked Results**: Top 10 most likely matches with detailed explanations
- **Direct Navigation**: One-click access to full disease information

### 📊 **Comprehensive Disease Information**
- **Complete Profiles**: Disease name, unique medical codes, and classifications
- **Detailed Symptoms**: Organized symptom lists with clear descriptions
- **Treatment Information**: Available treatments and medical guidance
- **Medical Classifications**: Contagious/chronic status indicators
- **Metadata**: Last updated timestamps and data sources

### 📱 **Modern User Experience**
- **Responsive Design**: Mobile-first approach, works on all devices
- **Professional UI**: Clean, medical-grade interface design
- **Fast Performance**: Optimized loading with <2 second response times
- **Intuitive Navigation**: Easy-to-use interface with clear call-to-actions
- **Loading States**: Professional loading indicators and error handling

### ♿ **Accessibility & Safety**
- **WCAG Compliant**: Keyboard navigation and screen reader support
- **High Contrast**: Focus indicators and accessible color schemes
- **Medical Disclaimers**: Clear warnings about educational use only
- **Reduced Motion**: Support for users with motion sensitivity
- **Safe Design**: No personal data collection, privacy-focused

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and building
- **React Router v6** for client-side routing
- **Axios** for HTTP requests and API communication
- **SCSS** with modern syntax for styling
- **CSS Grid & Flexbox** for responsive layouts
- **Modern ES6+** features and hooks

### **Backend**
- **Django 4.1** with Python 3.9+
- **Django REST Framework** for robust API development
- **Django ORM** with optimized queries and indexing
- **CORS Headers** for secure cross-origin requests
- **SQLite** database (production-ready, easily upgradeable)
- **Pandas** for efficient CSV data processing

### **Development & Deployment**
- **TypeScript** for enhanced developer experience
- **ESLint** for code quality and consistency
- **Modern SCSS** with deprecation-free syntax
- **Vercel-ready** configuration for seamless deployment
- **Environment-based** configuration for different stages

## 🔌 **API Endpoints**

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/diseases/` | List diseases with pagination | `search`, `contagious`, `chronic`, `page` |
| `GET` | `/api/diseases/<id>/` | Get detailed disease information | Disease ID |
| `POST` | `/api/symptom-checker/` | Intelligent symptom matching | `{"symptoms": ["fever", "headache"]}` |
| `GET` | `/api/stats/` | Database statistics and metrics | None |

### **API Examples**
```bash
# Search for diseases containing "fever"
GET /api/diseases/?search=fever

# Filter contagious diseases
GET /api/diseases/?contagious=true

# Check symptoms
POST /api/symptom-checker/
{
  "symptoms": ["headache", "fever", "nausea"]
}
```

## 🚀 **Quick Start**

### **Prerequisites**
- **Python 3.9+** (for backend)
- **Node.js 16+** (for frontend)
- **Git** (for cloning)

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd DiseaseDiagonose
```

### **2. Backend Setup (Django)**
```bash
# Navigate to backend directory
cd disease_diagnosis_backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Load disease data from CSV
python manage.py load_diseases

# Start the Django development server
python manage.py runserver 8000
```

### **3. Frontend Setup (React)**
```bash
# Navigate to frontend directory (in a new terminal)
cd disease-diagnosis-frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm run dev
```

### **4. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 🎯 **Development Workflow**

### **Running Both Servers**
```bash
# Terminal 1 - Backend
cd disease_diagnosis_backend
python manage.py runserver 8000

# Terminal 2 - Frontend
cd disease-diagnosis-frontend
npm run dev
```

### **Building for Production**
```bash
# Build frontend
cd disease-diagnosis-frontend
npm run build

# Collect static files (Django)
cd ../disease_diagnosis_backend
python manage.py collectstatic
```

## 📖 **How to Use**

### **🏠 Homepage**
- View database statistics (395+ diseases)
- Quick access to symptom checker
- Feature overview and navigation
- Medical disclaimer information

### **🔍 Browsing Diseases**
1. **Navigate** to the "Diseases" page
2. **Search** using the search bar (disease names, symptoms, codes)
3. **Filter** by contagious/chronic status using dropdown filters
4. **Browse** paginated results (20 per page)
5. **Click** on any disease card to view detailed information

### **🩺 Symptom Checker**
1. **Go** to the "Symptom Checker" page
2. **Enter** one or more symptoms (up to 10)
3. **Add** additional symptoms using the "+" button
4. **Remove** symptoms using the "×" button
5. **Click** "Check Symptoms" to get AI-powered matches
6. **Review** ranked results with match scores and percentages
7. **Click** "View Details" for complete disease information

### **📋 Disease Details**
- **Complete Information**: Name, code, classification
- **Symptom Lists**: Organized and detailed symptoms
- **Treatment Info**: Available treatments and guidance
- **Navigation**: Back button and related actions
- **Medical Flags**: Contagious/chronic indicators

### **💡 Search Tips**
- **General Terms**: Use "fever", "headache", "pain", "nausea"
- **Specific Symptoms**: Try "chest pain", "difficulty breathing"
- **Partial Matching**: System supports fuzzy search
- **Multiple Keywords**: Combine terms for better results
- **Medical Codes**: Search by ICD codes if known

## 📊 **Project Structure**

```
DiseaseDiagonose/
├── 📁 disease_diagnosis_backend/    # Django API Backend
│   ├── 📁 diseases/                 # Main Django app
│   │   ├── 📄 models.py            # Disease data model
│   │   ├── 📄 views.py             # API endpoints
│   │   ├── 📄 serializers.py       # Data serialization
│   │   └── 📁 management/commands/ # CSV data loader
│   ├── 📄 settings.py              # Django configuration
│   ├── 📄 urls.py                  # URL routing
│   └── 📄 requirements.txt         # Python dependencies
├── 📁 disease-diagnosis-frontend/   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable components
│   │   ├── 📁 pages/               # Page components
│   │   ├── 📁 services/            # API service layer
│   │   └── 📄 App.tsx              # Main app component
│   ├── 📄 package.json             # Node.js dependencies
│   └── 📄 vite.config.ts           # Vite configuration
├── 📄 Diseases_Symptoms.csv        # Source data (395+ diseases)
├── 📄 vercel.json                  # Vercel deployment config
├── 📄 README.md                    # This file
└── 📄 test_application.py          # Comprehensive test suite
```

## 🗄️ **Data Source**

### **Comprehensive Medical Database**
- **395+ Diseases**: Curated medical conditions database
- **Detailed Symptoms**: Comprehensive symptom descriptions
- **Treatment Information**: Available treatments and medical guidance
- **Classifications**: Contagious/chronic status indicators
- **Medical Codes**: Unique disease identification codes
- **Regular Updates**: Maintained and updated dataset

### **Data Quality**
- **Validated Information**: Medically reviewed content
- **Structured Format**: Consistent data organization
- **Complete Records**: Full information for each disease
- **Search Optimized**: Indexed for fast retrieval


## ⚠️ **Medical Disclaimer**

**🏥 IMPORTANT MEDICAL NOTICE**

This application is designed for **educational and informational purposes only**. It is **NOT intended** to:
- Replace professional medical advice, diagnosis, or treatment
- Provide medical recommendations or health guidance
- Diagnose medical conditions or diseases
- Substitute consultation with qualified healthcare providers

**Always consult with a physician or qualified healthcare professional** for:
- Medical advice and diagnosis
- Treatment recommendations
- Health concerns or symptoms
- Emergency medical situations

**In case of medical emergency, contact your local emergency services immediately.**

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes with proper testing
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Medical Data**: Curated from reliable medical sources
- **Open Source**: Built with amazing open-source technologies
- **Community**: Thanks to all contributors and users
- **Healthcare**: Dedicated to improving health education

---

**🏥 Built with ❤️ for medical education and public health awareness**

**⭐ If this project helped you, please consider giving it a star!**
