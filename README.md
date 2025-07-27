# Dawaback Frontend

## Project Overview

Dawaback is a comprehensive platform designed to facilitate medicine deals and pharmacy management within the medical community. This repository contains the frontend application, built with modern web technologies to provide a rich, responsive, and user-friendly experience.

## Features

- User Authentication (Sign In, Sign Up, Password Reset)
- Pharmacy Management (Add, Edit, Delete, List for Sale)
- Medicine Deal Management (Create, View, Filter, Drug Alerts)
- Subscription Plans & Payment Integration
- Real-time Chat for deals and pharmacies
- User Profile Management
- Advertising opportunities
- Comprehensive User Manual

## Technologies Used

- **React.js**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool that provides a lightning-fast development experience.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Zustand**: A small, fast, and scalable bearbones state-management solution.
- **React Router DOM**: Declarative routing for React.
- **Formik & Yup**: For form management and validation.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Sonner**: For toast notifications.
- **Lucide React & React Icons**: For iconography.
- **Google Maps API**: For location-based features.

## Getting Started

### Prerequisites

Make sure you have Node.js (v18 or later) and npm (or yarn/pnpm) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```

3. Create a `.env` file in the root of the `frontend` directory and add your environment variables. You will at least need your Google Maps API Key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
   VITE_API_BASE_URL=YOUR_BACKEND_API_URL # e.g., http://localhost:5000/api/v1
   ```
   _Replace `YOUR_GOOGLE_MAPS_API_KEY` and `YOUR_BACKEND_API_URL` with your actual keys and URLs._

### Running the Development Server

```bash
npm run dev
# or yarn dev
# or pnpm dev
```

This will start the development server, usually at `http://localhost:5173`.

### Building for Production

```bash
npm run build
# or yarn build
# or pnpm build
```

This command builds the app for production to the `dist` folder.

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── api/            # API service calls
│   ├── assets/         # Static assets like images/icons
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Shadcn/ui components
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Main application layouts (e.g., MainLayout, SharedLayout)
│   ├── lib/            # Utility functions (e.g., cn for Tailwind CSS classes)
│   ├── pages/          # Individual page components (e.g., Home, Login, Settings)
│   ├── services/       # External service integrations (e.g., chat socket)
│   ├── store/          # Zustand store for state management
│   └── utils/          # General utility functions (e.g., error handling, PWA setup)
├── index.html          # Main HTML file
├── package.json        # Project dependencies and scripts
├── vite.config.js      # Vite configuration
├── .env.example        # Example environment variables
└── README.md           # Project overview (this file)
```

## Contributing

We welcome contributions to the Dawaback frontend project! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'feat: Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please ensure your code adheres to the project's coding standards and passes all tests.

## License

[Specify your license here, e.g., MIT License]
