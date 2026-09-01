# GRIET ERP

Role-based ERP system for GRIET (Gokaraju Rangaraju Institute of Engineering and Technology) with separate dashboards for students, teachers, and HODs, plus timetable management.

## Features

- **Role-based dashboards** — Student, Teacher, and HOD views with scoped access
- **Timetable management** — HODs can create and edit schedules; teachers and students view assigned timetables
- **Cross-tab sync** — timetable updates propagate across browser tabs via BroadcastChannel API with localStorage persistence

## Tech stack

| Layer | Technologies |
|-------|-------------|
| Framework | React 18, TypeScript |
| Build | Vite 7 |
| Styling | CSS3 |
| Deployment | Vercel |

## Project structure

```
src/
├── pages/
│   ├── StudentDashboard.tsx
│   ├── TeacherDashboard.tsx
│   └── HODDashboard.tsx
├── utils/
│   └── timetable.ts       # Timetable data and sync logic
├── App.tsx
└── main.tsx
```

## Getting started

```bash
git clone https://github.com/Yash-d21/GRIET_ERP.git
cd GRIET_ERP
npm install
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (`tsc && vite build`) |
| `npm run preview` | Preview production build |

## Notes

Authentication is currently simplified for demonstration. Production deployment would require a proper auth backend.

## Credits

Developed by TARS Networks for GRIET.
