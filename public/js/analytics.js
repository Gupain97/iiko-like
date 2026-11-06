

// Для примера создаём даты относительно сегодняшнего дня.
function dateOffset(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}


let demoEmployees = [];
let sales = []
let total = 0

let ingredientsUsage = []

let activeReport = 'revenue';

const moneyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2
});



async function loadSales(from, to, userId) {
  try {
    const res = await fetch(`/api/admin/revenue?from=${from}&to=${to}&userId=${userId}`);
    if (!res.ok) {
      throw new Error('Ошибка получения данных о выручке');
    }
    const data  = await res.json();
    sales = data.employes;
    total = data.totalRevenue;

  } catch (err) {
    console.error(err);
  }
  
};



function formatMoney(amount) {
  return moneyFormatter.format(amount);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function isInPeriod(date, from, to) {
  return (!from || date >= from) && (!to || date <= to);
}

function getFilters(container) {
  return {
    from: container.querySelector('#report-from').value,
    to: container.querySelector('#report-to').value,
    employeeId: container.querySelector('#report-employee').value
  };
}

function getFilteredSales(filters) {
  return sales.filter(sale => {
    const dateMatches = isInPeriod(
      sale.date,
      filters.from,
      filters.to
    );

    const employeeMatches =
      !filters.employeeId ||
      String(sale.employeeId) === filters.employeeId;

    return dateMatches && employeeMatches;
  });
}

async function renderRevenue(container, filters) {
  await loadSales(filters.from, filters.to, filters.employeeId)

  const employeeName = filters.employeeId
    ? demoEmployees.find(
        employee => String(employee.id) === filters.employeeId
      )?.name ?? 'Неизвестный сотрудник'
    : 'Все сотрудники';

  const rows = sales.map(sale => {
    const employee = demoEmployees.find(
      item => item.id === sale.id
    );

    return `
      <tr>
        <td>${escapeHtml(employee?.name ?? 'Неизвестно')}</td>
        <td>${formatMoney(sale.revenue)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="report-summary">
      <div class="report-card">
        <span>Выручка</span>
        <strong>${formatMoney(total)}</strong>
      </div>

      <div class="report-card">
        <span>Количество записей</span>
        <strong>${sales.length}</strong>
      </div>

      <div class="report-card">
        <span>Сотрудник</span>
        <strong>${escapeHtml(employeeName)}</strong>
      </div>
    </div>

    <h3>Продажи</h3>

    ${sales.length ? `
      <div class="report-table-wrapper">
        <table class="report-table">
          <thead>
            <tr>
              <th>Сотрудник</th>
              <th>Выручка</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    ` : '<p>За выбранный период продаж нет.</p>'}
  `;
}

async function loadIgredientsUsage(from, to) {
  try {
    const res = await fetch(`/api/admin/ingredients-usage?from=${from}&to=${to}`)
    if (!res.ok) {
      throw new Error('Ошибка получения использованных ингредиентов');
    } 
    ingredientsUsage = await res.json();
  } catch (err) {
    console.error('Ошибка получаения данных', err);
  }
  
} 


async function renderIngredientUsage(container, filters) {
  await loadIgredientsUsage(filters.from, filters.to);
  
  // // const usage = ingredientsUsage.filter(item =>
  // //   isInPeriod(item.date, filters.from, filters.to)
  // // );

  // // Группируем расход по названию ингредиента и единице измерения.
  // const grouped = new Map();

  // for (const item of ingredientsUsage) {
  //   const key = `${item.name}::${item.unit}`;
  //   const current = grouped.get(key) ?? {
  //     name: item.name,
  //     unit: item.unit,
  //     quantity: 0
  //   };

  //   current.quantity += item.quantity;
  //   grouped.set(key, current);
  // }

  const rows = [...ingredientsUsage].map(item  => `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${item.quantity.toLocaleString('ru-RU', {
        maximumFractionDigits: 3
      })} ${escapeHtml(item.unit)}</td>
    </tr>
  `).join('');

  return `
    <h3>Расход ингредиентов за период</h3>

    ${ingredientsUsage.length ? `
      <div class="report-table-wrapper">
        <table class="report-table">
          <thead>
            <tr>
              <th>Ингредиент</th>
              <th>Общий расход</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    ` : '<p>За выбранный период данных нет.</p>'}
  `;
}

async function updateReport(container) {
  const filters = getFilters(container);
  const output = container.querySelector('#report-output');

  if (filters.from && filters.to && filters.from > filters.to) {
    output.innerHTML = '<p>Начальная дата не может быть позже конечной.</p>';
    return;
  }

  output.innerHTML = activeReport === 'revenue'
    ? await renderRevenue(container, filters)
    : await renderIngredientUsage(container, filters);
}


async function loadEmploys() {
  try {
    const res = await fetch(`/api/admin/users`);
    if (!res.ok) {
      throw new Error('Пользователи не найдены')
    }
    demoEmployees = await res.json()
  } catch (err) {
    console.error("Ошибка загрузки персонала", err)
  }
}

await loadEmploys()

export async function renderAnalytics(container) {
  const today = dateOffset(0);
  const weekAgo = dateOffset(6);

  container.innerHTML = `
    <section class="analytics">
      <h2>Отчёты</h2>

      <div class="report-tabs">
        <button type="button"
          class="report-tab active"
          data-report="revenue">
          Выручка
        </button>

        <button type="button"
          class="report-tab"
          data-report="ingredients">
          Расход ингредиентов
        </button>
      </div>

      <div class="report-filters">
        <label>
          С даты
          <input type="date" id="report-from"
            value="${weekAgo}">
        </label>

        <label>
          По дату
          <input type="date" id="report-to"
            value="${today}">
        </label>

        <label id="employee-filter">
          Сотрудник
          <select id="report-employee">
            <option value="">Все сотрудники</option>
            ${demoEmployees.map(employee => `
              <option value="${employee.id}">
                ${escapeHtml(employee.name)}
              </option>
            `).join('')}
          </select>
        </label>

        <button type="button" id="apply-report-filters">
          Применить
        </button>
      </div>

      <div id="report-output"></div>
    </section>
  `;

  container.querySelectorAll('[data-report]').forEach(button => {
    button.addEventListener('click', async () => {
      activeReport = button.dataset.report;

      container.querySelectorAll('[data-report]').forEach(tab => {
        tab.classList.toggle('active', tab === button);
      });

      // Для расхода ингредиентов сотрудник не нужен.
      container.querySelector('#employee-filter').hidden =
        activeReport === 'ingredients';

      await updateReport(container);
    });
  });

  container.querySelector('#apply-report-filters')
    .addEventListener('click', async () => updateReport(container));

  // Обновляем отчёт и при изменении фильтров.
  container.querySelectorAll(
    '#report-from, #report-to, #report-employee'
  ).forEach(input => {
    input.addEventListener('change', async () => updateReport(container));
  });

  await updateReport(container);
}
