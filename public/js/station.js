document.addEventListener("DOMContentLoaded", async () => {

    const stationRaw = localStorage.getItem('user');
    if (!stationRaw) {
        window.location.hred = '/';
    };

    const station = JSON.parse(stationRaw);
    let stationId = station.id;

    const dishList = document.getElementById('dishList');
    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
        console.log('соединение установлено');
    };

    socket.onmessage = async (event) => {
        console.log('пришло сообщение с сервера:', event.data);
        await loadDishes();
    }
    

    let currentDishes = document.get;

    if (!dishList) console.error("dishList Not Found");
    
    await loadDishes();



    async function loadDishes() {
        const res = await fetch(`/api/station`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ station })
        });

        currentDishes = await res.json();;
        await renderDishes();

        
    }


    // async function renderDishes() {


    //     if (!currentDishes) {
    //         dishList.innerHTML = `
    //         <tr>
    //             <td colspan="5">Нет заказов)</td>
    //         </tr>`

    //     return;
            
    //     }

    //     currentDishes.forEach(ticket => {
    //         const row = document.createElement('tr');


    //         row.innerHTML= `
    //         <td>${ticket.surname}</td>
    //         <td>${ticket.createdAt}</td>
    //         <td>Стол № ${ticket.tableNumber}</td>
    //         <td>
    //             <ul>
    //                 ${ticket.items.map(dish => `
    //                     <li>
    //                         ${dish.name}
    //                         ${dish.quantity}
    //                     </li>
    //                     `).join('')}
    //             </ul>
    //         </td>
            
    //         `;
            
        
    //     dishList.appendChild(row);
            
    //     });
        
    // }
    async function renderDishes() {

    dishList.innerHTML = '';

    if (!currentDishes || currentDishes.length === 0) {
        dishList.innerHTML = `
            <div class="empty-state">
                Нет активных заказов
            </div>
        `;
        return;
    }

    currentDishes.forEach(ticket => {

        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="label">Официант</span>
                    <div class="value">${ticket.surname}</div>
                </div>

                <div>
                    <span class="label">Стол</span>
                    <div class="value">№${ticket.tableNumber}</div>
                </div>

                <div>
                    <span class="label">Время</span>
                    <div class="value">${ticket.createdAt}</div>
                </div>
            </div>

            <div class="order-items">
                ${ticket.items.map(dish => `
                    <div class="dish-item">

                        <div class="dish-main">
                            <span class="dish-name">${dish.name}</span>
                            <span class="dish-qty">x${dish.quantity}</span>
                        </div>

                        ${dish.comment
                            ? `<div class="dish-comment">${dish.comment}</div>`
                            : ''
                        }

                    </div>
                `).join('')}
            </div>
        `;

        dishList.appendChild(orderCard);
    });
}


})