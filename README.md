# GRIET ERP System

A comprehensive Enterprise Resource Planning (ERP) system for GRIET (Gokaraju Rangaraju Institute of Engineering and Technology) featuring role-based dashboards for Students, Teachers, and HODs with timetable management capabilities.

## 🚀 Features

- **Role-Based Access Control**: Separate dashboards for:
  - **Students**: View timetable, courses, and academic information
  - **Teachers**: Manage classes, view schedules, and course information
  - **HOD (Head of Department)**: Full timetable management with create, edit, and update capabilities

- **Real-time Timetable Synchronization**: 
  - Cross-tab/window synchronization using BroadcastChannel API
  - localStorage persistence
  - Automatic updates across all open sessions

- **Modern UI/UX**: 
  - Responsive design
  - Clean and intuitive interface
  - Institution branding with GRIET and accreditation logos

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **CSS3** - Styling

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd griet_ecap
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
griet_ecap/
├── public/                 # Static assets
│   ├── grietlogo.png      # GRIET logo
│   ├── accredition.png    # Accreditation logos
│   └── tars_logo.jpg      # TARS Networks logo
├── src/
│   ├── pages/             # Dashboard components
│   │   ├── StudentDashboard.tsx
│   │   ├── TeacherDashboard.tsx
│   │   └── HODDashboard.tsx
│   ├── utils/             # Utility functions
│   │   └── timetable.ts
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── vercel.json            # Vercel deployment configuration
```

## 🎯 Usage

### Login
The application starts with a login page featuring three login cards:
- **HOD Login**: Access to full administrative dashboard
- **Teacher Login**: Access to teacher dashboard
- **Student Login**: Access to student dashboard

> **Note**: Currently, authentication is simplified for demonstration. In production, integrate with proper authentication backend.

### HOD Dashboard
- Create and edit timetable entries
- Manage course schedules
- Update class assignments
- Full administrative controls

### Teacher Dashboard
- View assigned courses and schedules
- Access timetable information
- View class details

### Student Dashboard
- View personal timetable
- Access course information
- Check class schedules

## 🌐 Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel.

**Option 1: Deploy via Vercel Dashboard**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Click Deploy

**Option 2: Deploy via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations:
```env
# Add your environment variables here
```

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

This project is developed and maintained by **TARS Networks**.

## 📄 License

Private project for GRIET.

## 👥 Credits

- **Institution**: Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)
- **Developer**: TARS Networks
- **Framework**: React + TypeScript + Vite

---

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

