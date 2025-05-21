# Support App Frontend

A web application for ordering digital device repair services.

## Main Features

- User registration and login
- Service request for device repairs (phones, computers, tablets, etc.)
- View and select service types
- Submit a repair request with problem description
- Responsive design for mobile and desktop devices
- Protected routes for authorized users

## Technologies

- React
- React Router
- React Hook Form
- Axios
- Tailwind CSS
- Lucide React Icons

## Quick Start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/support-app-frontend.git
   cd support-app-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (or another port shown in the console).

## Configuration

- Requires backend server: [https://computer-service-backend.onrender.com](https://computer-service-backend.onrender.com)
- Auth token is stored in browser `localStorage`

## Project Structure

- `src/components` — reusable components (Navbar, etc.)
- `src/pages` — application pages (Login, Register, Service, etc.)
- `src/App.jsx` — main application routing
- `src/main.jsx` — entry point

## License

MIT
