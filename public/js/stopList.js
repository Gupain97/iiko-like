document.addEventListener("DOMContentLoaded", async () =>{
    console.log("stopList.js")


    let currentStopList = null;

    const itemsList = document.getElementById("itemsList");
    const categoriesEl = document.getElementById("categories");
    const menuItemsEl = document.getElementById("menuItems");
    const deleteBtn = document.querySelector("delete-btn");

    await loadStopList();
    await renderStopListItems();
    await loadMenu();
    console.log("current SList", currentStopList);

  


    async function loadStopList() {
    
        try {
            const res = await fetch('/api/menu/get-stop-list');
            if (res.ok) currentStopList = await res.json();
            console.log(currentStopList);
            
            
        } catch (err) {
            console.error("Ошибка при загрузке стоп-листа", err);
        }
    }
    




    
    
    async function renderStopListItems() {
        itemsList.innerHTML = '';
        
        
        if (!currentStopList || currentStopList.length === 0) {
            itemsList.innerHTML = `
        <tr>
        <td colspan="5">Стоп-лист пуст</td>
        </tr>
      `;
      return;
    }
    
    currentStopList.forEach(item => {
        const row = document.createElement('tr');
        row.onclick = () => {
            selectedItemId = item.id;
        };
        
        

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${""}</td>
      <td>${""}</td>
      <td>${""}</td>
      <td><button class="delete-btn" data-id="${item.id}">удалить</button></td>
    `;

    
    itemsList.appendChild(row);
  });
}
deleteBtn.addEventListener('click', () =>{
  deleteItemStop(item.id);
})

  async function deleteItemStop(itemId) {
    try {
      const res = await fetch(`/api/menu/delete-stop/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({itemId})
      })
    } catch (err) {
      console.error("Не удалось очистить позицию!", err);
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

      if (item.is_active !== true) { // исправить ДТО !
        div.classList.add('stop-list');
      }

      div.innerHTML = `
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-price">${item.price / 100} ₽</div>
      `;

      div.onclick = () => addItemToStop(item.id);

      menuItemsEl.appendChild(div);
  });
}

async function addItemToStop(itemId) {
  console.log("addToStop", itemId);
  try {
    const res = await fetch(`/api/menu/add-to-stop`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({itemId})
    });

    const data = await res.json();
    currentStopList = data;
    renderStopListItems();
  } catch (err) {
    console.error("Нельзя добавить блюдо в стоп лист", err);
  }
}



})