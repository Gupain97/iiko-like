
const content = document.getElementById('content');

// ================================
// ОБЩИЕ ФУНКЦИИ
// ================================

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
      break;
    case 'ingredients':
      renderIngredients();
      break;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

async function readJson(response) {
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return response.json();
}

function showError(container, message) {
  if (!container) return;

  let error = container.querySelector('.admin-error');

  if (!error) {
    error = document.createElement('p');
    error.className = 'admin-error';
    container.prepend(error);
  }

  error.textContent = message;
}

// ================================
// ПОЛЬЗОВАТЕЛИ
// ================================

function renderUsers() {
  content.innerHTML = `
    <div class="card">
      <h3>Добавить пользователя</h3>

      <input id="userName" placeholder="Имя">
      <input id="userSurname" placeholder="Фамилия">
      <input id="userRole" placeholder="Должность">
      <input id="userPin" placeholder="ПИН-код" type="password">

      <button class="action" id="addUserButton">
        Добавить
      </button>

      <p id="userError" class="admin-error"></p>
    </div>

    <div class="card">
      <h3>Список пользователей</h3>
      <ul id="userList"></ul>
    </div>
  `;

  document
    .getElementById('addUserButton')
    .addEventListener('click', addUser);

  loadUsers();
}

async function loadUsers() {
  const list = document.getElementById('userList');
  if (!list) return;

  try {
    const data = await readJson(
      await fetch('/api/admin/users')
    );

    list.replaceChildren();

    data.forEach(user => {
      const li = document.createElement('li');

      li.textContent =
        `${user.name} ${user.surname}: ${user.role}`;

      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    showError(
      list.closest('.card'),
      'Не удалось загрузить пользователей.'
    );
  }
}

async function addUser() {
  const name =
    document.getElementById('userName').value.trim();

  const surname =
    document.getElementById('userSurname').value.trim();

  const role =
    document.getElementById('userRole').value.trim();

  const pin =
    document.getElementById('userPin').value.trim();

  const error = document.getElementById('userError');
  error.textContent = '';

  if (!name || !surname || !role || !pin) {
    error.textContent = 'Заполни все поля.';
    return;
  }

  try {
    await readJson(
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          surname,
          role,
          pin
        })
      })
    );

    document.getElementById('userName').value = '';
    document.getElementById('userSurname').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('userPin').value = '';

    await loadUsers();
  } catch (err) {
    console.error(err);
    error.textContent = 'Не удалось добавить пользователя.';
  }
}

// ================================
// КАТЕГОРИИ
// ================================

function renderCategories() {
  content.innerHTML = `
    <div class="card">
      <h3>Добавить категорию</h3>

      <input id="catName" placeholder="Название">

      <button class="action" id="addCategoryButton">
        Добавить
      </button>

      <p id="categoryError" class="admin-error"></p>
    </div>

    <div class="card">
      <h3>Список категорий</h3>
      <ul id="catList"></ul>
    </div>
  `;

  document
    .getElementById('addCategoryButton')
    .addEventListener('click', addCategory);

  loadCategories();
}

async function loadCategories() {
  const list = document.getElementById('catList');
  if (!list) return;

  try {
    const data = await readJson(
      await fetch('/api/admin/categories')
    );

    list.replaceChildren();

    data.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat.name;
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    showError(
      list.closest('.card'),
      'Не удалось загрузить категории.'
    );
  }
}

async function addCategory() {
  const name =
    document.getElementById('catName').value.trim();

  const error = document.getElementById('categoryError');
  error.textContent = '';

  if (!name) {
    error.textContent = 'Введи название категории.';
    return;
  }

  try {
    await readJson(
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
    );

    document.getElementById('catName').value = '';

    await loadCategories();
  } catch (err) {
    console.error(err);
    error.textContent = 'Не удалось добавить категорию.';
  }
}

async function loadCategoriesToSelect() {
  const select = document.getElementById('itemCategory');
  if (!select) return;

  try {
    const data = await readJson(
      await fetch('/api/admin/categories')
    );

    select.replaceChildren();

    if (!data.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Сначала добавь категорию';
      select.appendChild(option);
      return;
    }

    data.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);

    showError(
      select.closest('.card'),
      'Не удалось загрузить категории.'
    );
  }
}

// ================================
// СПРАВОЧНИК ИНГРЕДИЕНТОВ
// ================================

function renderIngredients() {
  content.innerHTML = `
    <div class="card">
      <h3>Добавить ингредиент</h3>

      <input
        id="ingredientName"
        placeholder="Например, Помидор"
      >

      <input
        id="ingredientUnit"
        placeholder="Единица измерения, например г"
      >

      <input
        id="ingredientQuantity"
        placeholder="Кол-во"
      >

      <button class="action" id="addIngredientButton">
        Добавить ингредиент
      </button>

      <p id="ingredientError" class="admin-error"></p>
    </div>

    <div class="card">
      <h3>Справочник ингредиентов</h3>
      <ul id="ingredientList"></ul>
    </div>
  `;

  document
    .getElementById('addIngredientButton')
    .addEventListener('click', addIngredient);

  loadIngredients();
}

async function loadIngredients() {
  const list = document.getElementById('ingredientList');
  if (!list) return;

  try {
    const data = await readJson(
      await fetch('/api/admin/ingredients')
    );

    list.replaceChildren();

    if (!data.length) {
      const li = document.createElement('li');
      li.textContent = 'Ингредиентов пока нет.';
      list.appendChild(li);
      return;
    }

    data.forEach(ingredient => {
      const li = document.createElement('li');

      const name =
        ingredient.name ?? ingredient.ingredientName;

      const unit = ingredient.unit
        ? ` (${ingredient.unit})`
        : '';
      const quantity = ingredient.quantity

      li.textContent = `${name} ${quantity}${unit}`;

      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);

    showError(
      list.closest('.card'),
      'Не удалось загрузить ингредиенты. Проверь API.'
    );
  }
}

async function addIngredient() {
  const name =
    document.getElementById('ingredientName').value.trim();

  const unit =
    document.getElementById('ingredientUnit').value.trim();

  const quantity =
    document.getElementById('ingredientQuantity').value.trim();

  const error = document.getElementById('ingredientError');
  error.textContent = '';

  if (!name) {
    error.textContent = 'Введи название ингредиента.';
    return;
  }

  try {
    await readJson(
      await fetch('/api/admin/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, unit, quantity})
      })
    );

    document.getElementById('ingredientName').value = '';
    document.getElementById('ingredientUnit').value = '';

    await loadIngredients();
    renderIngredients();
  } catch (error) {
    console.error(error);

    document.getElementById('ingredientError').textContent =
      'Не удалось добавить ингредиент. Проверь API.';
  }
}

// ================================
// БЛЮДА
// ================================

function renderItems() {
  content.innerHTML = `
    <div class="card">
      <h3>Добавить блюдо</h3>

      <input id="itemName" placeholder="Название">

      <input
        id="itemPrice"
        placeholder="Цена"
        type="number"
        min="0"
        step="0.01"
      >

      <select id="itemCategory"></select>

      <button class="action" id="addItemButton">
        Добавить
      </button>

      <p id="itemError" class="admin-error"></p>
    </div>

    <div class="card">
      <h3>Список блюд</h3>
      <p>Нажми на блюдо, чтобы открыть его рецепт.</p>
      <ul id="itemList" class="item-list"></ul>
    </div>
  `;

  document
    .getElementById('addItemButton')
    .addEventListener('click', addItem);

  loadCategoriesToSelect();
  loadItems();
}

async function loadItems() {
  const list = document.getElementById('itemList');
  if (!list) return;

  try {
    const data = await readJson(
      await fetch('/api/admin/menu-items')
    );

    list.replaceChildren();

    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'item-entry';

      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'item-row';
      row.setAttribute('aria-expanded', 'false');

      row.innerHTML = `
        <span>${escapeHtml(item.name)}</span>
        <span>${escapeHtml(item.price)} ₽　⌄</span>
      `;

      const details = document.createElement('div');
      details.className = 'recipe-details';
      details.hidden = true;

      row.addEventListener('click', async () => {
        if (!details.hidden) {
          details.hidden = true;
          row.setAttribute('aria-expanded', 'false');
          return;
        }

        list.querySelectorAll('.recipe-details')
          .forEach(el => {
            el.hidden = true;
          });

        list.querySelectorAll('.item-row')
          .forEach(el => {
            el.setAttribute('aria-expanded', 'false');
          });

        details.hidden = false;
        row.setAttribute('aria-expanded', 'true');
        details.textContent = 'Загрузка рецепта…';

        try {
          const recipe = await readJson(
            await fetch(`/api/admin/get-item/${item.id}`)
          );

          renderRecipeDetails(item, recipe, details);
        } catch (error) {
          console.error(error);

          details.textContent =
            'Не удалось загрузить рецепт. Проверь API.';
        }
      });

      li.append(row, details);
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);

    showError(
      list.closest('.card'),
      'Не удалось загрузить блюда.'
    );
  }
}

async function addItem() {
  const name =
    document.getElementById('itemName').value.trim();

  const price =
    Number(document.getElementById('itemPrice').value);

  const categoryValue =
    document.getElementById('itemCategory').value;

  const categoryId = Number(categoryValue);

  const error = document.getElementById('itemError');
  error.textContent = '';

  if (
    !name ||
    !categoryValue ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    error.textContent =
      'Укажи название, корректную цену и категорию.';
    return;
  }

  try {
    await readJson(
      await fetch('/api/admin/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          price,
          categoryId
        })
      })
    );

    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';

    await loadItems();
  } catch (err) {
    console.error(err);
    error.textContent = 'Не удалось добавить блюдо.';
  }
}

// ================================
// РЕЦЕПТ: ПРОСМОТР
// ================================

function getRecipeIngredients(recipe) {
  if (Array.isArray(recipe)) return recipe;

  if (Array.isArray(recipe?.ingredients)) {
    return recipe.ingredients;
  }

  if (Array.isArray(recipe?.recipe?.ingredients)) {
    return recipe.recipe.ingredients;
  }

  return [];
}

function renderRecipeDetails(item, recipe, container) {
  container.replaceChildren();

  const title = document.createElement('h4');
  title.textContent = `Рецепт: ${item.name}`;
  container.appendChild(title);

  const ingredients = getRecipeIngredients(recipe);

  if (!ingredients.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Рецепт пока не добавлен.';
    container.appendChild(empty);
  } else {
    const list = document.createElement('ul');

    ingredients.forEach(ingredient => {
      const li = document.createElement('li');

      const name = ingredient.ingredientName;

      const quantity = ingredient.quantity ?? '';

      const unit = ingredient.unit;

      li.textContent = `${name} — ${quantity} ${unit}`;

      list.appendChild(li);
    });

    container.appendChild(list);
  }

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'action';
  editButton.textContent = 'Редактировать рецепт';

  editButton.addEventListener('click', async () => {
    try {
      const availableIngredients = await readJson(
        await fetch('/api/admin/ingredients')
      );

      renderRecipeEditor(
        item,
        recipe,
        availableIngredients,
        container
      );
    } catch (error) {
      console.error(error);

      showError(
        container,
        'Не удалось загрузить справочник ингредиентов.'
      );
    }
  });

  container.appendChild(editButton);
}

// ================================
// РЕЦЕПТ: РЕДАКТИРОВАНИЕ
// ================================

function renderRecipeEditor(
  item,
  recipe,
  availableIngredients,
  container
) {
  const originalIngredients = getRecipeIngredients(recipe);

  const ingredients = originalIngredients.map(ingredient => ({
    ingredientId:
      ingredient.ingredientId ??
      ingredient.ingredient_id ??
      ingredient.ingredient?.id ??
      ingredient.id,

    ingredientName:
      ingredient.ingredientName ??
      ingredient.name ??
      ingredient.ingredient?.name ??
      '',

    quantity: ingredient.quantity ?? '',

    unit:
      ingredient.unit ??
      ingredient.ingredient?.unit ??
      ''
  }));

  container.replaceChildren();

  const title = document.createElement('h4');
  title.textContent = `Редактирование рецепта: ${item.name}`;
  container.appendChild(title);

  const rows = document.createElement('div');
  rows.className = 'recipe-editor-list';
  container.appendChild(rows);

  function renderRows() {
    rows.replaceChildren();

    if (!ingredients.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Добавь ингредиенты ниже.';
      rows.appendChild(empty);
    }

    ingredients.forEach((ingredient, index) => {
      const row = document.createElement('div');
      row.className = 'ingredient-edit-row';

      const select = document.createElement('select');
      select.setAttribute('aria-label', 'Ингредиент');

      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Выбери ингредиент';
      select.appendChild(placeholder);

      availableIngredients.forEach(available => {
        const option = document.createElement('option');
        option.value = String(available.id);

        option.textContent =
          available.name ??
          available.ingredientName ??
          `Ингредиент ${available.id}`;

        select.appendChild(option);
      });

      if (ingredient.ingredientId != null) {
        select.value = String(ingredient.ingredientId);
      }

      select.addEventListener('change', () => {
        const selected = availableIngredients.find(
          entry => String(entry.id) === select.value
        );

        ingredient.ingredientId = selected?.id ?? '';
        ingredient.ingredientName =
          selected?.name ?? selected?.ingredientName ?? '';

        ingredient.unit = selected?.unit ?? ingredient.unit ?? '';

        const unitInput = row.querySelector('.ingredient-unit');

        if (unitInput) {
          unitInput.value = ingredient.unit;
        }
      });

      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.min = '0';
      quantity.step = 'any';
      quantity.placeholder = 'Количество';
      quantity.setAttribute('aria-label', 'Количество');
      quantity.value = ingredient.quantity;

      quantity.addEventListener('input', () => {
        ingredient.quantity = quantity.value;
      });

      const unit = document.createElement('input');
      unit.className = 'ingredient-unit';
      unit.placeholder = 'Ед. изм.';
      unit.setAttribute('aria-label', 'Единица измерения');
      unit.value = ingredient.unit;

      unit.addEventListener('input', () => {
        ingredient.unit = unit.value;
      });

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'danger-button';
      remove.textContent = 'Удалить';

      remove.addEventListener('click', () => {
        ingredients.splice(index, 1);
        renderRows();
      });

      row.append(select, quantity, unit, remove);
      rows.appendChild(row);
    });
  }

  renderRows();

  const addRow = document.createElement('div');
  addRow.className = 'add-ingredient-form';

  const addSelect = document.createElement('select');
  addSelect.setAttribute('aria-label', 'Новый ингредиент');

  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.textContent = 'Выбери ингредиент';
  addSelect.appendChild(firstOption);

  availableIngredients.forEach(available => {
    const option = document.createElement('option');
    option.value = String(available.id);

    option.textContent =
      available.name ??
      available.ingredientName ??
      `Ингредиент ${available.id}`;

    addSelect.appendChild(option);
  });

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'action';
  addButton.textContent = 'Добавить строку';

  addButton.addEventListener('click', () => {
    const selected = availableIngredients.find(
      entry => String(entry.id) === addSelect.value
    );


    if (!selected) {
      showError(container, 'Сначала выбери ингредиент.');
  
      return;
    }

    ingredients.push({
      ingredientId: selected.id,
      ingredientName:
        selected.name ?? selected.ingredientName ?? '',
      quantity: '',
      unit: selected.unit ?? ''
    });

    renderRows();
    addSelect.value = '';

    const error = container.querySelector('.admin-error');
    if (error) error.remove();
  });

  addRow.append(addSelect, addButton);
  container.appendChild(addRow);

  const actions = document.createElement('div');
  actions.className = 'recipe-actions';

  const save = document.createElement('button');
  save.type = 'button';
  save.className = 'action';
  save.textContent = 'Сохранить рецепт';

  save.addEventListener('click', async () => {
    const oldError = container.querySelector('.admin-error');
    if (oldError) oldError.remove();

    for (const ingredient of ingredients) {
      if (!ingredient.ingredientId) {
        showError(container, 'Выбери ингредиент в каждой строке.');
        return;
      }

      if (
        ingredient.quantity === '' ||
        !Number.isFinite(Number(ingredient.quantity)) ||
        Number(ingredient.quantity) <= 0
      ) {
        showError(
          container,
          'Количество должно быть больше нуля.'
        );
        return;
      }

      if (!String(ingredient.unit ?? '').trim()) {
        showError(
          container,
          'Укажи единицу измерения для каждого ингредиента.'
        );
        return;
      }
    }

    save.disabled = true;
    save.textContent = 'Сохранение…';

      try {
        const payload = {
          ingredients: ingredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId,
            quantity: Number(ingredient.quantity),
            unit: String(ingredient.unit).trim()
          }))
        };

        await readJson(
          await fetch(
            `/api/admin/get-item/${item.id}/recipe`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            }
          )
        );

      const updatedRecipe = await readJson(
        await fetch(`/api/admin/get-item/${item.id}`)
      );

      renderRecipeDetails(item, updatedRecipe, container);
    } catch (error) {
      console.error(error);

      showError(
        container,
        'Не удалось сохранить рецепт. Проверь API и формат данных.'
      );

      save.disabled = false;
      save.textContent = 'Сохранить рецепт';
    }
  });

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'secondary-button';
  cancel.textContent = 'Отмена';

  cancel.addEventListener('click', () => {
    renderRecipeDetails(item, recipe, container);
  });

  actions.append(save, cancel);
  container.appendChild(actions);
}

// ================================
// СТАРТОВЫЙ ЭКРАН
// ================================

showView('categories');
