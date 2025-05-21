import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-blue-600 mb-4">
        <svg
          className="w-20 h-20 mx-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 48 48"
        >
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" fill="#fff"/>
          <path d="M16 20h16M16 28h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" fill="#fff"/>
          <path d="M24 18v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-6">Страница не найдена</p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
      >
        На главную
      </Link>
    </div>
  );
}
