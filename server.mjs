import express from 'express';  
import mongoose from 'mongoose';  

const app = express();  
app.use(express.json());  

// MongoDB connection - update with your URI  
const mongoURI = 'YOUR_MONGODB_CONNECTION_STRING';  

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

// CRUD routes without auth  
app.get('/fabrics', async (req, res) => {  
  const fabrics = await Fabric.find();  
  res.json(fabrics);  
});  

app.post('/fabrics', async (req, res) => {  
  const newFabric = new Fabric(req.body);  
  await newFabric.save();  
  res.json(newFabric);  
});  

app.put('/fabrics/:id', async (req, res) => {  
  await Fabric.findByIdAndUpdate(req.params.id, req.body);  
  const updatedFabric = await Fabric.findById(req.params.id);  
  res.json(updatedFabric);  
});  

app.delete('/fabrics/:id', async (req, res) => {  
  await Fabric.findByIdAndDelete(req.params.id);  
  res.json({ message: 'Deleted successfully' });  
});  

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
