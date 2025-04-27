# Market Mentor Dashboard

A comprehensive dashboard for market analysis and mentoring.

## Features

- Real-time market data visualization
- User authentication and authorization
- Interactive charts and graphs
- Responsive design for all devices

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Python with FastAPI
- Database: PostgreSQL
- Authentication: JWT

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Add necessary environment variables

4. Run the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   uvicorn main:app --reload
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
