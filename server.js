const express = require('express');  
const cors = require('cors');  
const app = express();  

app.use(cors());  
app.use(express.json());  

let fabrics = [  
  { id: 1, name: 'Cotton', color: 'Blue', quantity: 100 },  
  { id: 2, name: 'Silk', color: 'Red', quantity: 50 }  
];  
let currentId = 3;  

// Get all fabrics  
app.get('/fabrics', (req, res) => {  
  res.json(fabrics);  
});  

// Create new fabric  
app.post('/fabrics', (req, res) => {  
  const newFabric = { id: currentId++, ...req.body };  
  fabrics.push(newFabric);  
  res.json(newFabric);  
});  

// Update fabric  
app.put('/fabrics/:id', (req, res) => {  
  const id = parseInt(req.params.id);  
  const fabricIndex = fabrics.findIndex(f => f.id === id);  
  if (fabricIndex !== -1) {  
    fabrics[fabricIndex] = { id, ...req.body };  
    res.json(fabrics[fabricIndex]);  
  } else {  
    res.status(404).json({ message: 'Fabric not found' });  
  }  
});  

// Delete fabric  
app.delete('/fabrics/:id', (req, res) => {  
  const id = parseInt(req.params.id);  
  fabrics = fabrics.filter(f => f.id !== id);  
  res.json({ message: 'Deleted successfully' });  
});  

const PORT = 3000;  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  
