let token = null;  
const apiBase = 'http://localhost:3000';  

document.getElementById('auth-form').addEventListener('submit', async (e) => {  
  e.preventDefault();  
  const username = document.getElementById('auth-username').value;  
  const password = document.getElementById('auth-password').value;  
  try {  
    const res = await fetch(`${apiBase}/login`, {  
      method: 'POST',  
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify({ username, password })  
    });  
    const data = await res.json();  
    if (res.ok) {  
      token = data.token;  
      document.getElementById('auth-section').style.display = 'none';  
      document.getElementById('app-section').style.display = 'block';  
      loadFabrics();  
    } else {  
      alert(data.message);  
    }  
  } catch (err) {  
    alert('Login failed');  
  }  
});  

const showRegister = () => {  
  document.getElementById('auth-title').textContent = 'Register';  
  document.getElementById('auth-form').removeEventListener('submit', login);  
  document.getElementById('auth-form').addEventListener('submit', register);  
};  

const register = async (e) => {  
  e.preventDefault();  
  const username = document.getElementById('auth-username').value;  
  const password = document.getElementById('auth-password').value;  

  try {  
    const res = await fetch(`${apiBase}/register`, {  
      method: 'POST',  
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify({ username, password })  
    });  
    const data = await res.json();  
    alert(data.message);  
    if (res.ok) {  
      // Switch back to login  
      document.getElementById('auth-title').textContent = 'Login';  
      document.getElementById('auth-form').removeEventListener('submit', register);  
      document.getElementById('auth-form').addEventListener('submit', login);  
    }  
  } catch (err) {  
    alert('Registration failed');  
  }  
};  

const loadFabrics = async () => {  
  const res = await fetch(`${apiBase}/fabrics`, {  
    headers: { 'Authorization': `Bearer ${token}` }  
  });  
  const data = await res.json();  
  const tbody = document.getElementById('fabric-table-body');  
  tbody.innerHTML = '';  
  data.forEach(f => {  
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

const editFabric = async (id) => {  
  const res = await fetch(`${apiBase}/fabrics/${id}`, {  
    headers: { 'Authorization': `Bearer ${token}` }  
  });  
  const f = await res.json();  
  document.getElementById('fabric-id').value = f._id;  
  document.getElementById('name').value = f.name;  
  document.getElementById('color').value = f.color;  
  document.getElementById('quantity').value = f.quantity;  
  document.getElementById('form-title').textContent = 'Edit Fabric';  
};  

const deleteFabric = async (id) => {  
  await fetch(`${apiBase}/fabrics/${id}`, {  
    method: 'DELETE',  
    headers: { 'Authorization': `Bearer ${token}` }  
  });  
  loadFabrics();  
};  

const saveFabric = async (e) => {  
  e.preventDefault();  
  const id = document.getElementById('fabric-id').value;  
  const name = document.getElementById('name').value;  
  const color = document.getElementById('color').value;  
  const quantity = parseInt(document.getElementById('quantity').value);  
  const data = { name, color, quantity };  
  const method = id ? 'PUT' : 'POST';  
  const url = id ? `${apiBase}/fabrics/${id}` : `${apiBase}/fabrics`;  

  await fetch(url, {  
    method,  
    headers: {  
      'Content-Type': 'application/json',  
      'Authorization': `Bearer ${token}`  
    },  
    body: JSON.stringify(data)  
  });  
  resetForm();  
  loadFabrics();  
};  

const resetForm = () => {  
  document.getElementById('fabric-form').reset();  
  document.getElementById('fabric-id').value = '';  
  document.getElementById('form-title').textContent = 'Add New Fabric';  
};  

const logout = () => {  
  token = null;  
  document.getElementById('auth-section').style.display = 'block';  
  document.getElementById('app-section').style.display = 'none';  
};  
