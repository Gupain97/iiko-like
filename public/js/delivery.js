
document.addEventListener('DOMContentLoaded', async () => {


    
//     const weather = document.querySelector('.weather-list');
    

    
//     async function renderWeather() {
//     const res = await fetch(`/api/delivery`, );
//     const data = await res.json();
//     weather.textContent = 'температура в Ростове-на-Дону: ' + data + '°';
    
// }

    const filters = new Set(["NEW", "SENT", "COMPLETE"]);

    document.querySelectorAll(".status-filter").forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) {
          filters.add(cb.value);
        } else {
          filters.delete(cb.value);
        }
        renderOrders();
      });
    });

    console.log('filters', filters);

    const socket = new WebSocket('ws://localhost:3002');

    socket.onopen = () => {
        console.log('Соединение установлено с портом 3002');
    };

    socket.onmessage = async (event) => {
        console.log('Пришло сообщение:', event.data);
        await loadOrders();
        renderOrders();
    };

let orders = [];


const ordersList =
  document.querySelector("#ordersList");
  
  const details =
  document.querySelector("#details");



  details.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const orderId = btn.dataset.orderId;
    
    if (btn.classList.contains("sent")) {
      handleSend(orderId, "SENT");
    } else if (btn.classList.contains("complete")) {
      handleSend(orderId, "COMPLETE");
    }
  })

async function handleSend(orderId, status) {
    console.log("orderId", orderId);
    try {
      const res = await fetch(`/api/delivery/send`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify({status,  orderId})
      }
      )

      await loadOrders();
      renderOrders();
      console.log("orders", orders, "orderId:", orderId);

      const order = orders.find((order) => Number(order.orderId) === Number(orderId))
      if (!order) return  
      console.log("order:", order)
      renderDetails(order);


      if (!res.ok) {
        throw new Error("Действие не выполнено");
      }
    } catch (err) {
      console.error("Действие не выполнено", err);
    }
}

async function loadOrders() {
    const res = await fetch(`/api/delivery/get-orders`);
    const data = await res.json();
    orders = data 
}

await loadOrders();


function getTotal(order) {
  return order.items.reduce(
    (sum, item) => {
      return sum + item.price * item.quantity;
    },
    0
  );
}


function renderOrders() {

  ordersList.innerHTML = "";
  if (!orders) return
  const visiable = orders.filter(o => filters.has(o.deliveryStatus));


  visiable.forEach(order => {
    const status = order.deliveryStatus;
    console.log("status", status)
    const card =
      document.createElement("div");

      
    card.className = "order-card";
    if ( status === "SENT") {
      card.classList.add("sent");
    } else if (status === "COMPLETE") {
      card.classList.add("is-done");
    }

    card.innerHTML = `
      <div class="order-number">
      #${order.orderId}
      </div>

      <div class="order-customer">
        ${order.customerName}
      </div>
      
      <div class="order-address">
      ${order.address}
      </div>
      
      <div class="order-price">
        ₽${getTotal(order).toFixed(2)}
      </div>
    `;


    card.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".order-card")
          .forEach(card => {
            card.classList.remove("active");
          });
          
        card.classList.add("active");

        renderDetails(order);
    }
);


    ordersList.appendChild(card);
});
}


function renderDetails(order) {
    
  details.innerHTML = `

    <div class="details-inner">

      <div class="detail-header">

      <div class="detail-number">
          #${order.orderId}
        </div>

        <div class="detail-time">
        ${order.createdAt}
        </div>
        
        </div>
        

      <div class="info">

        <h3>Клиент</h3>

        <div class="info-row">
          <span class="info-label">
            Имя:
          </span>

          ${order.customerName}
        </div>
        
        <div class="info-row">
        <span class="info-label">
        Телефон:
          </span>

          ${order.phoneNumber}
        </div>
        <div class="info-row">
        <span class="info-label">
        Кол-во персон:
          </span>

          ${order.guestsCount}
        </div>
        

      </div>
      
      
      <div class="info">
      
      <h3>Доставка</h3>
      
      <div class="info-row">
      ${order.address}
      
      </div>

      <h3>Комментарии:</h3>
      
      <div class="info-row">
      ${order.comments}
      
      </div>
      
      </div>
      
      
      <div class="info">
      
        <h3>Заказ</h3>

        ${order.items.map(item => `

          <div class="item">
          
            <span>
              ${item.name}
              × ${item.quantity}
            </span>

            <span>
            ₽${(
                item.price * item.quantity
              ).toFixed(2)}
            </span>

            </div>

        `).join("")}


        <div class="total">
        
          <span>
            Итого
          </span>

          <span>
            ₽${getTotal(order).toFixed(2)}
          </span>

        </div>

            ${rednerActions(order)}
            

      </div>

      </div>
  `;
}
const ACTIONS_BY_STATUS = {
    NEW : ["sent"],
    SENT : ["complete"],
    COMPLETE : ["completed-badge"]
}

const ACTIONS = {
  sent: (order) => `
  <button
    class="sent"
    data-order-id="${order.orderId}"
    data-action="sent"
  >Отправить</button> 
  `,

  complete: (order) => `
    <button
      class="complete"
      data-order-id="${order.orderId}"
      data-action="complete"
    >Завершить</button>
  `,
    
  "completed-badge": () => `
    <span class="status completed">
      Завершено
    </span>
  `,
  
}

function rednerActions(order) {
  const actions = ACTIONS_BY_STATUS[order.deliveryStatus] ?? [];

  if (!actions.length) {
    return "";
  };

  return `
    <div class="actions">
      ${actions
        .map((action) => ACTIONS[action](order))
        .join("")}
    </div>
    `;
}


renderOrders();


// renderWeather();


})