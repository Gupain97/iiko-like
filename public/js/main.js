console.log('table cells:', document.querySelectorAll('.table-cell'));


document.querySelectorAll('.table-cell')
  .forEach(cell => {
    cell.addEventListener('click', () => {
  const tableId = cell.dataset.id;
  window.location.href = `/html/table.html?id=${tableId}`;
});

  });



const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = '/';
});


document.addEventListener('DOMContentLoaded', () => {
  const userRaw = localStorage.getItem('user');
  console.log('userRaw', userRaw)
  

  if (!userRaw) {
    window.location.href = '/';
    return;
  }

  const user = JSON.parse(userRaw);

  document.getElementById('userName').textContent =
    `${user.name} ${user.surname}`;

  document.getElementById('userRole').textContent =
    // user.role === 'manager' ? 'Менеджер' : 'Директор';
    `${user.role}`;
});

async function loadTablesForCashier() {
  const res = await fetch(`/api/tables/cashier/:${userId}`);
  const tables = await res.json();

  tables.forEach(table => {
    const cell = document.querySelector(
      `.table-cell[data-id="${table.id}"]`
    );

    if (!cell) return;

    cell.classList.remove('open', 'printed', 'locked');

    switch (table.orderStatus) {
      case 'OPEN':
        cell.classList.add('open');
        break;

      case 'PRINTED':
        cell.classList.add('printed');
        break;

      case 'PRECHECK':
        cell.classList.add('prechecked');
        break;
      

      default:
        // нет заказа
        break;
    }


  });
}

async function loadTables() {
  const res = await fetch('/api/tables');
  const tables = await res.json();
  console.log(tables)

  tables.forEach(table => {
    const cell = document.querySelector(
      `.table-cell[data-id="${table.id}"]`
    );

    if (!cell) return;

    cell.classList.remove('open', 'printed', 'locked');

    switch (table.orderStatus) {
      case 'OPEN':
        cell.classList.add('open');
        break;

      case 'PRINTED':
        cell.classList.add('printed');
        break;

      case 'PRECHECK':
        cell.classList.add('prechecked');
        break;
      

      default:
        // нет заказа
        break;
    }


  });
}

document.addEventListener('DOMContentLoaded', loadTables);

 
