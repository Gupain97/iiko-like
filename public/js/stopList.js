document.addEventListener("DOMContentLoaded", async () =>{
    const user = JSON.parse(localStorage.getItem('user'));



    let currentStopList = null;
    let selectedItemId = null;

    const itemsList = document.getElementById("itemsList");
    const categoriesEl = document.getElementById("categories");
    const menuItemsEl = document.getElementById("menuItems");
    const remainderBtn = document.getElementById("remainder");
    
    await loadStopList();
    await renderStopListItems();
    await loadMenu();

    document.getElementById('itemsList').addEventListener('click', (e) => {
      if (e.target.classList.contains('addRemainder-btn')) {
        const itemId = e.target.dataset.id;
        addRemainder(itemId);
        e.stopPropagation();
      } else if (e.target.classList.contains('delete-btn')) {
        const itemId = e.target.dataset.id;
        deleteItemStop(itemId);
        e.stopPropagation();
      }
    })



    // document.getElementById('itemsList').addEventListener('click', (e) => {
    //   if (e.target.classList.contains('delete-btn')) {
    //     const itemId = e.target.dataset.id;
    //     deleteItemStop(itemId);
    //     e.stopPropagation();
    //   }
    // })

    remainderBtn.addEventListener('click', async () => {
      await addRemainder(selectedItemId);
    })
    
    
    
    
    async function loadStopList() {
      
      try {
        const res = await fetch('/api/stop-list/get-stop-list');
        if (res.ok) currentStopList = await res.json();
        
        
      } catch (err) {
            console.error("Ошибка при загрузке стоп-листа", err);
        }
    }
    




    
    
    async function renderStopListItems() {
        itemsList.innerHTML = '';

        const sortedStopList = [...currentStopList].sort((a,b)  => a.id - b.id )
        
        
        if (!currentStopList || currentStopList.length === 0) {
            itemsList.innerHTML = `
        <tr>
        <td colspan="5">Стоп-лист пуст</td>
        </tr>
      `;
      return;
    }
    
    sortedStopList.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('stopListItem');
        
        row.onclick = () => {
         selectedItemId = item.id;
        // addRemainder(selectedItemId);
         console.log(selectedItemId);
        };
        
        
        row.innerHTML = `
        <td><button class="addRemainder-btn" data-id="${item.id}">${item.name}</button></td>
        <td>${item.createdBy}</td>
        <td>${item.remainder || 0}</td>
        <td>${item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</td>
        <td><button class="delete-btn" data-id="${item.id}">удалить</button></td>
        `;

    // row.oncklick = () => {
    //   selectedItemId = item.id;
    //   console.log(selectedItemId);
    // };
        
    // const deleteBtn = document.querySelector("delete-btn");
    // deleteBtn.addEventListener('click', () =>{
    //   deleteItemStop(item.id);
    // })
    
    itemsList.appendChild(row);
  });
}

  async function deleteItemStop(itemId) {
    try {
      const res = await fetch(`/api/stop-list/remove-stop/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({itemId, userId: user.id})
      })

    currentStopList = await res.json();
    await renderStopListItems();
    await loadMenu();
    } catch (err) {
      console.error("Не удалось очистить позицию!", err);
    }
    
  }


  async function loadMenu(catId) {
  const res = await fetch("/api/menu");
  if (!res.ok) {
    console.error('Ошибка загрузки меню', res.status);
    return;
  }
  const data = await res.json();

  allItems = data.items;

  renderCategories(data.categories);

  if (data.categories.length > 0 && !catId) {
    renderMenuItems(data.categories[0].id);
  } else if (data.categories.length > 0 ) {
    renderMenuItems(catId);
  }

  
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
    const items = allItems.filter(i => i.categoryId === categoryId).sort((a,b) => a.id - b.id );

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "menu-item";

      if (item.isStopped ) { // исправить ДТО !
        div.classList.add('stop-list');
      }

      div.innerHTML = `
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-price">${item.price / 100} ₽</div>
        <div class="menu-item-remainder">${item.remainder || ''}</div>
      `;

      div.onclick = () => addItemToStop(item.id);

      menuItemsEl.appendChild(div);
  });
}

async function addItemToStop(itemId) {
  try {
    const res = await fetch(`/api/stop-list/add-dish`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({itemId, userId: user.id})
    });
    const data = await res.json();
    currentStopList = data.currentStopList;
    console.log(data);
    const catId = data.catId;
    await renderStopListItems();
    await loadMenu(catId);
  } catch (err) {
    console.error("Нельзя добавить блюдо в стоп лист", err);
  }
}

async function addRemainder(dishId) {
  let count = Number(prompt("Введите кол-во блюд"));
  if (!count) return 
  const res = await fetch(`/api/stop-list/add-rem`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({dishId, count})
  })

  currentStopList = await res.json();
  await renderStopListItems();
  await loadMenu();
}



})