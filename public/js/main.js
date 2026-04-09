console.log('table cells:', document.querySelectorAll('.table-cell'));


document.querySelectorAll('.table-cell')
  .forEach(cell => {
    cell.addEventListener('click', () => {
      const tableId = cell.dataset.id;
      window.location.href = `/html/table.html?id=${tableId}`;
    });
    
  });
  

  
  const logoutBtn = document.getElementById('logoutBtn');
  const closeShiftBtn = document.getElementById('closeShiftBtn');
  const staffList = document.querySelector('.staff-list');
  
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  });

  closeShiftBtn.addEventListener('click', async () => {
    await closeShiftUser();
  });


document.addEventListener('DOMContentLoaded', () => {
  const userRaw = localStorage.getItem('user');

  
  
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

// async function loadTablesForCashier() {
  //   const res = await fetch(`/api/tables/cashier/:${userId}`);
  //   const tables = await res.json();
  
  //   tables.forEach(table => {
    //     const cell = document.querySelector(
      //       `.table-cell[data-id="${table.id}"]`
      //     );
      
      //     if (!cell) return;
      
      //     cell.classList.remove('open', 'printed', 'locked');
      
      //     switch (table.orderStatus) {
        //       case 'OPEN':
        //         cell.classList.add('open');
        //         break;
        
        //       case 'PRINTED':
        //         cell.classList.add('printed');
        //         break;
        
        //       case 'PRECHECK':
        //         cell.classList.add('prechecked');
        //         break;
        
        
        //       default:
        //         // нет заказа
        //         break;
        //     }
        
        
        //   });
      // }
      
async function closeShiftUser() {
  const userRaw = localStorage.getItem('user');
  const user = JSON.parse(userRaw);

  const res = await fetch('/api/shifts/closeShiftUser', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId: user.id})
  });
  const data = await res.json();

}      

      

// async function loadActiveUsers() {
//   const res = await fetch('/api/shifts/');
//   const data = await res.json();

  
// }

async function renderActiveUsers() {
  const staffList = document.querySelector(".staff-list");

  if (!staffList) return;

  try {
    // получаем пользователей с сервера
    const res = await fetch("/api/shifts");
 

 
    const activeUsers = await res.json(); 

    // очищаем список
    staffList.innerHTML = "";

    // создаём элементы
    activeUsers.forEach(user => {
      const div = document.createElement("div");
      div.className = "user";
      div.textContent = `${user.name} ${user.surname}`;

      staffList.appendChild(div);
    });

  } catch (err) {
    console.error("Ошибка загрузки пользователей:", err);
  }
}

// запуск
renderActiveUsers();


async function loadTables() {
  const res = await fetch('/api/tables');
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

document.addEventListener('DOMContentLoaded', () => {
  loadTables()
 // loadActiveUsers()
  
});

 
