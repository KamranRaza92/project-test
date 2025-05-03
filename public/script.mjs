const apiBase = 'http://localhost:3000';  

document.getElementById('fabric-form').addEventListener('submit', saveFabric);  

let currentEditId = '';  

const loadFabrics = async () => {  
  const response = await fetch(`${apiBase}/fabrics`);  
  const fabrics = await response.json();  
  const tbody = document.getElementById('fabric-table-body');  
  tbody.innerHTML = '';  
  fabrics.forEach(f => {  
    const row = document.createElement('tr');  
    row.innerHTML = `  
      <td>${f.name}</td>  
      <td>${f.color}</td>  
      <td>${f.quantity}</td>  
      <td>  
        <button onclick="editFabric('${f._id}')">Edit</button>  
        <button onclick="deleteFabric('${f._id}')">Delete</button>  
      </td>`;  
    tbody.appendChild(row);  
  });  
};  

const saveFabric = async (e) => {  
  e.preventDefault();  
  const id
