const content = document.getElementById('content');

// async function getAllItems() {
//   const res = await fetch('/api/admin');
//   console.log('запустилась функция');

// }

// await getAllItems();

function showView(view) {
  switch (view) {
    case 'categories':
      renderCategories();
      break;
    case 'items':
      renderItems();
      break;
    case 'users':
      renderUsers();
  }
  // if (view === 'categories') {
  //   renderCategories();
  // } else if (view === 'items') {
  //   renderItems();
  // }
}
function renderUsers() {
  content.innerHTML = `
  <div class="card">
    <h3>Добавить пользователя</h3>
    <input id="userName" placeholder="Имя" />
    <input id="userSurname" placeholder="Фамилия" />
    <input id="userRole" placeholder="Должность" />
    <input id="userPin" placeholder="ПИН-код" type="number" />
    
    <button class="action" onclick="addUser()">Добавить</button>
  </div>
  
  <div class="card">
    <h3>Список пользователей</h3>
    <ul id="userList"></ul>
  </div>
  `;
  loadUsers();
  
}
function renderCategories() {
  content.innerHTML = `
    <div class="card">
      <h3>Добавить категорию</h3>
      <input id="catName" placeholder="Название" />
      <button class="action" onclick="addCategory()">Добавить</button>
    </div>

    <div class="card">
      <h3>Список категорий</h3>
      <ul id="catList"></ul>
    </div>
  `;

  loadCategories();
}

function renderItems() {
  content.innerHTML = `
    <div class="card">
      <h3>Добавить блюдо</h3>
      <input id="itemName" placeholder="Название" />
      <input id="itemPrice" placeholder="Цена" type="number" />
      <select id="itemCategory"></select>
      <button class="action" onclick="addItem()">Добавить</button>
    </div>

    <div class="card">
      <h3>Список блюд</h3>
      <ul id="itemList"></ul>
    </div>
  `;

  loadCategoriesToSelect();
  loadItems();
}
///
async function loadUsers() {
  const res = await fetch('/api/admin/users');
  const data = await res.json();

  const list = document.getElementById('userList');
  list.innerHTML = '';

  data.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} ${user.surname}: ${user.role}`;
    list.appendChild(li);
  });
}

async function addUser() {
  const name = document.getElementById('userName').value;
  const surname = document.getElementById('userSurname').value;
  const role = document.getElementById('userRole').value;
  const pin = document.getElementById('userPin').value;

  await fetch('/api/admin/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, surname, role, pin})
  });
  
  loadUsers();
  
}
///

async function loadCategories() {
  const res = await fetch('/api/admin/categories');
  const data = await res.json();

  const list = document.getElementById('catList');
  list.innerHTML = '';

  data.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat.name;
    list.appendChild(li);
  });
}

async function addCategory() {
  const name = document.getElementById('catName').value;

  await fetch('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  loadCategories();
}

async function loadCategoriesToSelect() {
  const res = await fetch('/api/admin/categories');
  const data = await res.json();

  const select = document.getElementById('itemCategory');
  select.innerHTML = '';

  data.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

async function loadItems() {
  const res = await fetch('/api/admin/menu-items');
  const data = await res.json();

  const list = document.getElementById('itemList');
  list.innerHTML = '';

  data.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price}`;
    list.appendChild(li);
  });
}

async function addItem() {
  const name = document.getElementById('itemName').value;
  const price = Number(document.getElementById('itemPrice').value);
  const categoryId = Number(document.getElementById('itemCategory').value);

  await fetch('/api/admin/menu-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, categoryId })
  });

  loadItems();
}

showView('categories');

