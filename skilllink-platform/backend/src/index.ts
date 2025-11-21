import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { websocketService } from './services/websocket.service';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize WebSocket
websocketService.initialize(httpServer);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Import reminder service
import reminderService from './services/reminder.service';

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket ready`);
  
  // Start assignment reminder service
  reminderService.startReminderCron();
});
