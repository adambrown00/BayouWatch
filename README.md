# BayouWatch 🌊

A community-driven flood tracking and alert system designed to help residents monitor and report flooding conditions in real-time.

## Features

### 🗺️ Interactive Flood Map

- Real-time visualization of flood reports on an interactive map
- Color-coded markers indicating severity levels (minor, moderate, severe)
- Historical flood data from the past 7 days
- Cluster view for dense report areas

### 📢 Official Alerts

- View active flood alerts from official sources
- Severity-based alert categorization
- Area-specific notifications
- Time-stamped alerts with expiration tracking

### 📝 Community Reporting

- Submit flood reports with location, severity, and descriptions
- Photo upload support for visual documentation
- User authentication for report submission
- Geolocation-based reporting

### 👨‍💼 Admin Dashboard

- Review and moderate pending flood reports
- Approve or reject community submissions
- Manage official alerts
- User role management

### 🔐 User Authentication

- Secure account creation and login
- Role-based access control (user/admin)
- Protected API endpoints
- User profile management
- Passwords hashed with bcrypt

### 📊 Flood History

- Browse community flood reports from past 7 days
- Filter reports by severity level
- Analyze flood patterns over time
- Track frequently flooded areas

## Tech Stack

**Frontend:**

- React + TypeScript
- Vite
- Leaflet for mapping
- Tailwind CSS for styling

**Backend:**

- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL database
- JWT authentication
- Uvicorn server

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment (recommended):

```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up your PostgreSQL database and create a `.env` file with:

```
DATABASE_URL=postgresql://user:password@localhost/bayouwatch
SECRET_KEY=your-secret-key-here
```

5. Run the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend/BayouWatch_Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file for API configuration:

```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Public Endpoints

- `GET /api/reports` - Retrieve approved flood reports from the last 7 days
- `GET /api/alerts` - Get active official flood alerts
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - User login

### Authenticated Endpoints

- `POST /api/reports` - Submit a new flood report (requires account creation)
- `POST /api/upload-photo` - Upload photos for flood reports (requires account creation)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Admin Authenticated Endpoints

- `GET /api/reports/pending` - View pending reports awaiting approval
- `PUT /api/reports/{id}/status` - Approve or reject a flood report

## Project Structure

```
BayouWatch/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routers/     # API route handlers
│   │   ├── models.py    # Database models
│   │   ├── schemas.py   # Pydantic schemas
│   │   ├── auth.py      # Authentication logic
│   │   └── main.py      # Application entry point
│   └── requirements.txt
├── frontend/            # React frontend
│   └── BayouWatch_Frontend/
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Page components
│       │   ├── context/     # React context (auth)
│       │   └── layout/      # Layout components
│       └── package.json
└── README.md
```

## Future Enhancements

- Push notifications for nearby flood alerts
- Mobile app development
- Integration with NOAA/NWS APIs for official weather data
- Advanced analytics and flood prediction models using previous data
- Multi-language support

## License

This project is licensed under the MIT License, see the LICENSE file for details.

---

A fullstack web app that helps Baton Rouge residents track flooding in real time. Users can view a live map of flooded areas, submit reports with photos, and access official weather alerts, while admins verify reports to ensure accurate and reliable information.
