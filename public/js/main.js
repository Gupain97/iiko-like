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
  const deliveryBtn = document.querySelector('.deliveryBtn');
  
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  });

  closeShiftBtn.addEventListener('click', async () => {
    await closeShiftUser();
  });

  deliveryBtn.addEventListener('click',() => {
    window.location.href = 'html/delivery.html'

  })


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
      div.className = "staff-item";
      div.textContent = `${user.name} ${user.surname}`;

      div.addEventListener("click", async () => {
        // div.className = "activeUser"
        await loadOrders(user.user_id)
      })

      staffList.appendChild(div);
    });

  } catch (err) {
    console.error("Ошибка загрузки пользователей:", err);
  }
}

// запуск
renderActiveUsers();

async function loadOrders(waiterId = null) {
  let id = waiterId
  if (!id){
    const waiter = JSON.parse(localStorage.getItem('user'));
    id = waiter.id

  }


    // ✅ Очищаем ВСЕ ячейки столов перед загрузкой новых данных
  const allCells = document.querySelectorAll('.table-cell');
  allCells.forEach(cell => {
    cell.classList.remove('open', 'printed', 'prechecked', 'locked');
    cell.textContent = '+'; // или ваш текст по умолчанию
    // Если нужно вернуть исходный текст:
    // cell.textContent = cell.dataset.originalText || '+';
  });


  const res = await fetch(`/api/orders/${id}`);
  const orders = await res.json();

  orders.forEach(slot => {
    const cell = document.querySelector(
      `.table-cell[data-id="${slot.table_id}"]`
    );
    
    if (!cell) return;
    
    cell.classList.remove('open', 'printed', 'prechecked', 'locked');
    
    switch (slot.status) {
      case 'OPEN':
        cell.classList.add('open');
        cell.textContent = slot.table_number;
          
        break;
        
        case 'PRINTED':
          cell.classList.add('printed');
          cell.textContent = slot.table_number;
          
          break;
          
          case 'PRECHECK':
            cell.classList.add('prechecked');
            cell.textContent = slot.table_number;
        break;
        
        
        default:
          // нет заказа
          break;
    }
  });
    
}

document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
 
  
});

 
