import express from 'express';  
import mongoose from 'mongoose';  
import cors from 'cors';  
import jwt from 'jsonwebtoken';  
import bcrypt from 'bcryptjs';  

const app = express();  

app.use(cors());  
app.use(express.json());  

// Replace with your MongoDB connection string  
const mongoURI = 'YOUR_MONGODB_CONNECTION_STRING';  

// Connect to MongoDB  
mongoose.connect(mongoURI, {  
  useNewUrlParser: true,  
  useUnifiedTopology: true  
});  

const fabricSchema = new mongoose.Schema({  
  name: String,  
  color: String,  
  quantity: Number  
});  
const Fabric = mongoose.model('Fabric', fabricSchema);  

const userSchema = new mongoose.Schema({  
  username: { type: String, unique: true },  
  passwordHash: String  
});  
const User = mongoose.model('User', userSchema);  

const authenticateJWT = (req, res, next) => {  
  const authHeader = req.headers.authorization;  
  if (authHeader) {  
    const token = authHeader.split(' ')[1];  
    jwt.verify(token, 'SECRET_KEY', (err, user) => {  
      if (err) return res.sendStatus(403);  
      req.user = user;  
      next();  
    });  
  } else {  
    res.sendStatus(401);  
  }  
};  

// Registration route  
app.post('/register', async (req, res) => {  
  const { username, password } = req.body;  
  const passwordHash = await bcrypt.hash(password, 10);  
  try {  
    const user = new User({ username, passwordHash });  
    await user.save();  
    res.json({ message: 'User registered' });  
  } catch (err) {  
    res.status(400).json({ message: 'Registration failed', error: err.message });  
  }  
});  

// Login route  
app.post('/login', async (req, res) => {  
  const { username, password } = req.body;  
  const user = await User.findOne({ username });  
  if (!user) return res.status(400).json({ message: 'Invalid username or password' });  
  const valid = await bcrypt.compare(password, user.passwordHash);  
  if (!valid) return res.status(400).json({ message: 'Invalid username or password' });  
  const token = jwt.sign({ username, id: user._id }, 'SECRET_KEY', { expiresIn: '1h' });  
  res.json({ token });  
});  

// CRUD routes (secured)  
app.get('/fabrics', authenticateJWT, async (req, res) => {  
  const fabrics = await Fabric.find();  
  res.json(fabrics);  
});  

app.post('/fabrics', authenticateJWT, async (req, res) => {  
  const newFabric = new Fabric(req.body);  
  await newFabric.save();  
  res.json(newFabric);  
});  

app.put('/fabrics/:id', authenticateJWT, async (req, res) => {  
  await Fabric.findByIdAndUpdate(req.params.id, req.body);  
  const updated = await Fabric.findById(req.params.id);  
  res.json(updated);  
});  

app.delete('/fabrics/:id', authenticateJWT, async (req, res) => {  
  await Fabric.findByIdAndDelete(req.params.id);  
  res.json({ message: 'Deleted successfully' });  
});  

// Server  
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
