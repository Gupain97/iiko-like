// table.js

document.addEventListener('DOMContentLoaded', async () => {
  // ===== helpers =====
  const params = new URLSearchParams(window.location.search);
  const tableId = Number(params.get('id'));
  console.log('params:', params.get('slot'));
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('localstorage', localStorage);

  if (!user) {
    window.location.href = '/';
    return;
  }

  let allItems = [];
  let currentOrder = null;
 // let tableIsOpen = false;


  // ===== DOM =====
  const tableNumberEl = document.getElementById('tableNumber');
  const openTableBtn = document.getElementById('openTableBtn');
  const closeTableBtn = document.getElementById('closeTableBtn');
  const exitTableBtn = document.getElementById('exitTableBtn');
  // const addItemBtn = document.getElementById('addItemBtn');
  const itemsList = document.getElementById('itemsList');
  const orderTotalEl = document.getElementById('orderTotal');
  const precheckOrderBtn = document.getElementById('precheckOrder');
  const printOrderBtn = document.getElementById('printOrderBtn');

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
  openTableBtn.addEventListener('click', async () => {
    await openTable();
  });


  printOrderBtn.addEventListener('click', async() => {
    await printOrder();
  });

  precheckOrderBtn.addEventListener('click', async () => {
    await precheckOrder();
  });

  closeTableBtn.addEventListener('click', async () => {
    await closeTable();
  });

  exitTableBtn.addEventListener('click', () => {
    window.location.href = '/main';
  });

  // ===== functions =====


  // async function openTable() {
  //   const res = await fetch('/api/tables/:tableId');
  //   if (!res.ok) console.log('сработал не рес ок')
 
  //   const data = await res.json();
 
    
    
  // };


  // async function openTable() {
  //   try {
  //     const res = await fetch('/api/tables/open', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ tableId, userId: user.id })
  //     });

  //     if (!res.ok) {
  //       const data = await res.json();
  //       if (data.message !== 'TABLE_ALREADY_OPEN') alert(data.message);
  //     }

 
  //     await loadOrCreateOrder();
  //     renderOrder();
  //     renderTotal();
  //   } catch (err) {
  //     console.error('Ошибка при открытии стола', err);
  //   }
  // }

  // // async function loadOrCreateOrder() {

  // //     const res = await fetch('/api/orders', {
  // //       method: 'GET',
  // //     });
  // //     const data = res.json();
  // //     console.log('get orders');
  // //     console.log(data )

  // //     if (!res.ok) {
  // //       const guestsCount = 3;
  // //       console.log('не рес ок ')
  // //       const res = await fetch('/api/orders', {
  // //       method: 'POST',
  // //       headers: { 'Content-Type': 'application/json' },
  // //       body: JSON.stringify({ tableId , userId: user.id, guestsCount})
  // //     });
      
  // //       const data = await res.json();
 
 
  // //       alert(data.message);
  // //       return;
  // //     }
      
  // //     currentOrder = await res.json();
 
  // //     renderOrder();

  // // };
  

  async function loadOrCreateOrder() {
    try {
      let tableNumber = undefined;
      let guestsCount = undefined;
      let res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId , userId: user.id})
      });
 

 
      
      if (!res.ok) {
        const data = await res.json();
        if (data.message==="GUEST_COUNT_REQUIRED!"){
          tableNumber = Number(prompt('Введите номер стола'));
          guestsCount = Number(prompt("Введите кол-во гостей"));
          if (!guestsCount) return;
 

        res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableId , userId: user.id, guestsCount, tableNumber})
        });
  
 
 
      } else {alert(data.message);
        return;
      }
    }
      
      currentOrder = await res.json();
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
      const res = await fetch(`/api/orders/${currentOrder.id}/items`, {
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
      currentOrder = await res.json();

      await renderOrder();

    } catch (err) {
      console.error('Ошибка добавления', err);
    }
  }

  // async function addItem() {
  //   if (!currentOrder ) return;

  //   const name = prompt('Название позиции');
  //   const price = Number(prompt('Цена'));
  //   const quantity = Number(prompt('Количество'));

  //   if (!name || price <= 0 || quantity <= 0) {
  //     alert('Некорректные данные');
  //     return;
  //   }
 

  //   try {
  //     const res = await fetch('/api/orders/add-item', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         orderId: currentOrder.id,
  //         tableId,
  //         name,
  //         price,
  //         quantity,
  //       })
  //     });

  //     if (!res.ok) {
  //       const data = await res.json();
  //       alert(data.message);
  //       return;
  //     }

  //     await loadOrCreateOrder();
 
  //     renderItems();
  //     console.log('загрузил позиции');
  //     renderTotal();
  //     console.log('загрузил тотал');
  //   } catch (err) {
  //     console.error('Ошибка при добавлении позиции', err);
  //   }
  // }

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
      console.log('тебл жс, дошли до конца пречека')

      currentOrder = await res.json();
      await renderOrder();

    } catch (err) {
      console.error("Ошибка при пречеке стола", err)
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
      console.log('currentOrder', currentOrder)
      
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
  console.log(data);

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
      return;
    }
    if (currentOrder.status === 'OPEN' || currentOrder.status === 'PRINTED') {
      show(openTableBtn, false);
      // show(addItemBtn, true);
      show(precheckOrderBtn, true);
      show(precheckOrderBtn, true);
      show(closeTableBtn, false);


    } else if (currentOrder.status ==="PRECHECK"){
      show(openTableBtn, false);
      // show(addItemBtn, false);
      show(printOrderBtn, false);
      show(precheckOrderBtn, false);
      show(closeTableBtn, true);
    }  

    
  }

  function show(element, visible) {
    element.style.display = visible ? "inline-block" : "none"
  }


  async function renderOrderItems() {
    itemsList.innerHTML = '';
    console.log('renderItems in function');

  
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

      div.innerHTML = `
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-price">${item.price} €</div>
      `;

      div.onclick = () => addItemToOrder(item.id);

      menuItemsEl.appendChild(div);
  });
}



  
});


