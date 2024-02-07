const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Add this line
const connectDb = require('./config/database');
const router = require('./routes/routes');
const admin = require('./routes/adminRoutes');
const userRoutes = require('./routes/ownRoutes');
const cors = require('cors')

const { protect } = require('./middlewares/auth');
const dotenv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const mongoDbUri = process.env.MONGOURL;
// Middleware
app.use(bodyParser.json());
app.use(express.json());
const corsOptions = {
    origin: ['https://confirmbuyers.com', 'www.confirmbuyers.com/','http://localhost:5173','http://localhost:3000','https://cbadmin-six.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (if needed)
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Add this line
// app.use(protect);// Connect to Database
connectDb(mongoDbUri);

app.use('/api', router);
app.use('/mangement', admin);
app.use('/user', userRoutes);
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  });
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
