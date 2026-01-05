require('dotenv').config();
const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');
const userRoutes=require('./routes/userRoutes');
const disasterRoutes=require('./routes/disasterRoute');
const contributionRoutes=require('./routes/contributionRoutes');
const rescueTeamRoutes=require('./routes/rescueTeamRoutes');
const path=require('path');
const app=express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

connectDB();
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/user',userRoutes);
app.use('/api/disaster',disasterRoutes);
app.use('/api/contribution',contributionRoutes);
app.use('/api/rescue-team',rescueTeamRoutes);

app.listen(process.env.PORT || 5000,()=>{
    console.log(`server running on port ${process.env.PORT || 5000}`);
});