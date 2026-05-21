// table.js

document.addEventListener('DOMContentLoaded', async () => {
  // ===== helpers =====
  const params = new URLSearchParams(window.location.search);
  const tableId = Number(params.get('id'));
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    window.location.href = '/';
    return;
  }

  let allItems = [];
  let currentOrder = null;
  let selectedItemId = null;
 // let tableIsOpen = false;


  // ===== DOM =====
  const tableNumberEl = document.getElementById('tableNumber');
  const openTableBtn = document.getElementById('openTableBtn');
  const closeTableBtn = document.getElementById('closeTableBtn');
  const exitTableBtn = document.getElementById('exitTableBtn');

  const incrementBtn = document.querySelector('.btn-increment');
  const decrementBtn = document.querySelector('.btn-decrement');
  const deleteBtn = document.querySelector('.btn-delete');

  
  // const addItemBtn = document.getElementById('addItemBtn');
  const itemsList = document.getElementById('itemsList');
  const orderTotalEl = document.getElementById('orderTotal');
  const precheckOrderBtn = document.getElementById('precheckOrder');
  const printOrderBtn = document.getElementById('printOrderBtn');
  const cancelPrecheckBtn = document.getElementById('cancelPrecheckBtn');

  const categoriesEl = document.getElementById("categories");
  const menuItemsEl = document.getElementById("menuItems");
  const waiterNameEl = document.getElementById('waiterName');

  // document.getElementById('userName').textContent =
  //   `${user.name} ${user.surname}`;

  tableNumberEl.textContent = tableId;

  // ===== init =====
  // await checkTableState();
  await loadOrCreateOrder();
  await loadMenu();
 // await openTable();
  await renderOrder();
  await renderTotal();

  // ===== events =====

  deleteBtn.addEventListener('click', async () => {
    await deleteItems();
  });

  decrementBtn.addEventListener('click', async () => {
    await decrementItems();
  });

  incrementBtn.addEventListener('click', async () => {
    await incrementItems();
  });

  openTableBtn.addEventListener('click', async () => {
    await openTable();
  });


  printOrderBtn.addEventListener('click', async() => {
    await printOrder();
  });

  precheckOrderBtn.addEventListener('click', async () => {
    await precheckOrder();
  });

  cancelPrecheckBtn.addEventListener('click', async () => {
    await cancelPrecheck();
  })

  closeTableBtn.addEventListener('click', async () => {
    await closeTable();
  });

  exitTableBtn.addEventListener('click', () => {
    window.location.href = '/main';
  });
  

  async function loadOrCreateOrder() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let tableNumber = undefined;
      let guestsCount = undefined;
      const waiterId = urlParams.get('waiterId');
      let res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id, 'x-user-role': user.role },
        body: JSON.stringify({ tableId , waiterId: waiterId})
      });
      

      
      
      if (!res.ok) {
        const data = await res.json();
        if (data.message==="GUEST_COUNT_REQUIRED!"){
          tableNumber = Number(prompt('Введите номер стола'));
          guestsCount = Number(prompt("Введите кол-во гостей"));
          if (!guestsCount) return;
 

          res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'x-user-id': user.id, 
              'x-user-role': user.role  },
            body: JSON.stringify({ 
              tableId , 
              userId: user.id, 
              waiterId,
              guestsCount, tableNumber ,
            })
        });
        
        
        
      } else {alert(data.message);
        return;
      }
    }
      
    currentOrder = await res.json();
    console.log(currentOrder);
      waiterNameEl.textContent = currentOrder.waiterName + ' ' +  currentOrder.waiterSurname;
      tableNumberEl.textContent = currentOrder.tableNumber;
      await renderOrder();
 
    } catch (err) {
      console.error('Ошибка при загрузке заказа', err);
    }
  }

  async function addItemToOrder(menuItemId) {
    if (!currentOrder) return;

    try {
      const res = await fetch(`/api/order-items/${currentOrder.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItemId,
          quantity: 1
        })
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message);
        return;
      }
      const data = await res.json();
      currentOrder = data.order;
      selectedItemId = data.addedItemId;

      await renderOrder();

    } catch (err) {
      console.error('Ошибка добавления', err);
    }
  }


  async function incrementItems() {
    if (!selectedItemId) return
    const res = await fetch(`/api/order-items/${selectedItemId}/increment`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ orderId: currentOrder.id})

    });
    
    currentOrder = await res.json();
    await renderOrder();
    
  };

  async function decrementItems() {
    try {
      if (!selectedItemId) return
      const res = await fetch(`/api/order-items/${selectedItemId}/decrement`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ orderId: currentOrder.id})
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message); 
      }
      currentOrder = data.order;
      selectedItemId = data.itemId;
      await renderOrder();
    } catch (err) {
      console.error('Операция недоступна!', err);
    }
  };

  async function deleteItems() {
    if (!selectedItemId) return
    try {
       const res = await fetch(`/api/order-items/${selectedItemId}/delete`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json', 'x-user-role': user.role},
        body: JSON.stringify({ orderId: currentOrder.id, userId: user.id})
      });
      selectedItemId = null;
      const data  = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      currentOrder = data; 
      await renderOrder();
    } catch (err) {
      console.error('Ошибка', err);
    }
  }

  async function printOrder() {
 
    if (!currentOrder) return;
    try {
      const res = await fetch('/api/orders/print', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           orderId: currentOrder.id,
           tableId,
            userId: user.id })
        
          });
        
          currentOrder = await res.json();
          selectedItemId = null;
          await renderOrder();
          
    } catch (err) {
      console.error("Ошибка печати", err)
    }
    
  }

  async function precheckOrder() {
    if (!currentOrder) return;

    try {
      const res = await fetch('/api/orders/precheck',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           orderId: currentOrder.id,
           tableId,
            userId: user.id })
        
      });

      currentOrder = await res.json();
      await renderOrder();

    } catch (err) {
      console.error("Ошибка при пречеке стола", err)
    }
  }

  async function cancelPrecheck() {
    if(!currentOrder) return 
    try {
      const res = await fetch('/api/orders/cancel-precheck', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "x-user-id": user.id , "x-user-role": user.role},
        body: JSON.stringify({orderId: currentOrder.id})
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      } else {
       currentOrder = data;
      } 
      await renderOrder();


    } catch (err) {
      alert(err);
      console.error('Недостаточно прав', err.message);
    }
    
  }

  async function closeTable() {
   if (!currentOrder) return;
   
    try {
  
 
      await fetch('/api/orders/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           orderId: currentOrder.id,
           tableId,
            userId: user.id })
      });
 
      currentOrder.isOpen = false;
      
      window.location.href = '/main'
    } catch (err) {
      console.error('Ошибка при закрытии стола', err);
    }
  }


  async function loadMenu() {
  const res = await fetch("/api/menu");
  if (!res.ok) {
    console.error('Ошибка загрузки меню', res.status);
    return;
  }
  const data = await res.json();

  allItems = data.items;

  renderCategories(data.categories);

  if (data.categories.length > 0) {
    renderMenuItems(data.categories[0].id);
  }
}

  async function renderOrder() {
    await renderOrderItems();
    await renderTotal();
    await updateButtons();


    }


  async function updateButtons() {
    if (!currentOrder) {
      show(openTableBtn, true);
      // show(addItemBtn, false);
      show(precheckOrderBtn, false);
      show(closeTableBtn, false);
      show(cancelPrecheckBtn, false);
      return;
    }
    if (currentOrder.status === 'OPEN' || currentOrder.status === 'PRINTED') {
      show(openTableBtn, false);
      // show(addItemBtn, true);
      show(precheckOrderBtn, true);
      show(precheckOrderBtn, true);
      show(closeTableBtn, false);
      show(cancelPrecheckBtn, false);
      


    } else if (currentOrder.status ==="PRECHECK"){
      show(openTableBtn, false);
      // show(addItemBtn, false);
      show(printOrderBtn, false);
      show(precheckOrderBtn, false);
      show(closeTableBtn, true);
      show(cancelPrecheckBtn, true);
    }  

    
  }

  function show(element, visible) {
    element.style.display = visible ? "inline-block" : "none"
  }


  async function renderOrderItems() {
    itemsList.innerHTML = '';

  
    if (!currentOrder || currentOrder.items.length === 0) {
      itemsList.innerHTML = `
        <tr>
          <td colspan="5">Нет позиций</td>
        </tr>
      `;
      return;
    }
  
    currentOrder.items.forEach(item => {
      const row = document.createElement('tr');
      row.onclick = () => {
        selectedItemId = item.id;
      };
      if (currentOrder.status === "PRECHECK"){
        row.classList.add('precheck')
      }
      
      else if (item.printed) {
        row.classList.add('printed')
      } else {
        row.classList.add('added')
      }

      row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price} ₽</td>
      <td>${item.total} ₽</td>
      <td>${item.printedAt ? new Date(item.printedAt).toLocaleTimeString() : ''}</td>
    `;

    itemsList.appendChild(row);
    });
  }

  async function renderTotal() {
    if (!currentOrder) {
      orderTotalEl.textContent = '';
      return;
    }

   orderTotalEl.textContent = `Итого: ${currentOrder.total} ₽`;
  }

  function renderCategories(categories) {
    categoriesEl.innerHTML = "";

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "category-btn";
      btn.innerText = cat.name;

      btn.onclick = () => {
        document.querySelectorAll(".category-btn")
          .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        renderMenuItems(cat.id);
      };

      categoriesEl.appendChild(btn);
    });
  }

  function renderMenuItems(categoryId) {
    menuItemsEl.innerHTML = "";

    const items = allItems.filter(i => i.category_id === categoryId);

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "menu-item";

      if (item.is_active !== true ) {
        div.classList.add('stop-list');
      }

      div.innerHTML = `
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-price">${item.price / 100} ₽</div>
      `;

      div.onclick = () => addItemToOrder(item.id);

      menuItemsEl.appendChild(div);
  });
}



  
});


