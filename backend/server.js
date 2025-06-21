// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const http = require('http');
// const { Server } = require('socket.io');

// const disasterRoutes = require('./routes/disasterRoutes');
// const aiRoutes = require('./routes/aiRoutes');
// const geocodeRoutes = require('./routes/geocodeRoutes');
// const socialRoutes = require('./routes/socialRoutes');
// const officialRoutes = require('./routes/officialUpdates'); // ✅ use the correct variable name

// dotenv.config(); // Load .env variables

// const app = express();
// const server = http.createServer(app);

// // WebSocket setup
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API routes
// app.use('/api/disasters', disasterRoutes);
// app.use('/api/disasters', socialRoutes);
// app.use('/api/disasters', officialRoutes); // ✅ fixed variable name: `officialRoutes` not `officialUpdates`
// app.use('/api/ai', aiRoutes);
// app.use('/api/geocode', geocodeRoutes);

// // WebSocket events
// io.on('connection', (socket) => {
//   console.log('🟢 WebSocket connected');
// });

// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load env
dotenv.config();

// App init
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const disasterRoutes = require('./routes/disasterRoutes');
const aiRoutes = require('./routes/aiRoutes');
const geocodeRoutes = require('./routes/geocodeRoutes');
const socialRoutes = require('./routes/socialRoutes');
const officialRoutes = require('./routes/officialUpdates');

app.use('/api/disasters', disasterRoutes);
app.use('/api/disasters', socialRoutes);
app.use('/api/disasters', officialRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/geocode', geocodeRoutes);

// Serve frontend
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// For any other route, return React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// WebSocket
io.on('connection', (socket) => {
  console.log('🟢 WebSocket connected');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
