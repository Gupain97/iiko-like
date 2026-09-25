// ✅ Один DOMContentLoaded, всё внутри

let currentSelectWaiter = null;


document.addEventListener('DOMContentLoaded', () => {
  // Локальные переменные доступны во всех функциях внутри
  // const logoutBtn = document.getElementById('logoutBtn');
  // const closeShiftBtn = document.getElementById('closeShiftBtn');
  // const staffList = document.querySelector('.staff-list');
  // const deliveryBtn = document.querySelector('.deliveryBtn');
  
  // Проверка авторизации - первым делом
   const userRaw = localStorage.getItem('user');
  // if (!userRaw) {
  //   window.location.href = '/';
  //   return;
  // }
 
  const user = JSON.parse(userRaw);
  console.log(user);
  currentSelectWaiter = user.id;
  
  // Заполняем данные пользователя
  
  // Навешиваем обработчики
  
  // closeShiftBtn.addEventListener('click', async () => {
  //   await closeShiftUser();
  // });
  
  // deliveryBtn.addEventListener('click', () => {
  //   window.location.href = 'html/delivery.html';
  // });
  
  // Обработчики для столов
  document.querySelectorAll('.table-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const tableId = cell.dataset.id;
      const userId = cell.dataset.waiterId;
      window.location.href = `/html/table.html?id=${tableId}&waiterId=${currentSelectWaiter}`;
    });
  });
  
  // Загружаем данные
  renderActiveUsers();
  loadOrders(user.id);
});

     
 

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
      if (user.userId != currentSelectWaiter ) {
        div.classList = "staff-item"
      } else {
        div.classList = "current-user"
      };
      div.textContent = `${user.name} ${user.surname}`;

      div.addEventListener("click", async () => {
        div.classList = "current-user";
        currentSelectWaiter = user.userId;
        await renderActiveUsers();
        await loadOrders(user.userId);
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
  let id = waiterId;
  currentSelectWaiter = waiterId;
  if (!id){
    const waiter = JSON.parse(localStorage.getItem('user'));
    id = waiter.id
    currentSelectWaiter = waiter.id;
    
    
  }
 


    // ✅ Очищаем ВСЕ ячейки столов перед загрузкой новых данных
  const allCells = document.querySelectorAll('.table-cell');
  allCells.forEach(cell => {
    cell.classList.remove('open', 'printed', 'prechecked', 'locked');
    cell.textContent = '+'; // или ваш текст по умолчанию
    // Если нужно вернуть исходный текст:
    // cell.textContent = cell.dataset.originalText || '+';
  });


  const res = await fetch(`/api/orders/${id}`, {
    credentials: 'include'
  });
  const orders = await res.json();

  orders.forEach(slot => {
    const cell = document.querySelector(
      `.table-cell[data-id="${slot.tableSlot}"]`
    );
    
    if (!cell) return;
    
    cell.classList.remove('open', 'printed', 'prechecked', 'locked');
    
    switch (slot.status) {
      case 'OPEN':
        cell.classList.add('open');
        cell.textContent = slot.tableNumber;
          
        break;
        
        case 'PRINTED':
          cell.classList.add('printed');
          cell.textContent = slot.tableNumber;
          
          break;
          
          case 'PRECHECK':
            cell.classList.add('prechecked');
            cell.textContent = slot.tableNumber;
        break;
        
        
        default:
          // нет заказа
          break;
    }
  });
  
    
};

 
