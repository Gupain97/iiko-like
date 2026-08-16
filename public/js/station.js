document.addEventListener("DOMContentLoaded", async () => {

    const dishList = document.getElementById('dishList');

    const configurationBtn = document.getElementById("configuration");
    const modalOverlay = document.getElementById("modalOverlay");
    const closeModal = document.getElementById("closeModal");


    const statusFilters = document.querySelectorAll(".status-filter");
    let activeStatusFilters = [];

    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
        console.log('Соединение установлено');
    };

    socket.onmessage = async (event) => {
        console.log('Пришло сообщение:', event.data);
        await loadDishes();
    };


    configurationBtn.addEventListener("click", () => {
        statusFilters.forEach(checkbox => {
            const status = checkbox.dataset.status;
            if (!status) console.error('статус не найден');
            checkbox.checked = activeStatusFilters.includes(status);
        });
        modalOverlay.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
       modalOverlay.classList.add("hidden");
    });

    // statusFilters.addEventListener('change', async () => {
    //     const status = this.dataset.status;
    //     const enabled = this.checked;

    //     await changeStatusFilter(status, enabled);
        
    // });

    await getStatusFiter();

    statusFilters.forEach(checkbox => {
        checkbox.addEventListener('change', async () => {
            const status = checkbox.dataset.status;
            const enabled = checkbox.checked
 
            await changeStatusFilter(status, enabled);
        })
    })

    
    modalOverlay.addEventListener("click", (event) => {
        
        if (event.target === modalOverlay) {
            modalOverlay.classList.add("hidden");
        }
        
    });
    
    
    let currentDishes = [];
    
    if (!dishList) {
        console.error("dishList not found");
        return;
    }

    async function loadDishes() {
        const res = await fetch('/api/station', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!res.ok) return;
        
        currentDishes = await res.json();
        renderDishes();
    };


    async function getStatusFiter() {
        const res =  await fetch(`/api/station/get-status-filter`);
        if (!res.ok) console.error('Не удалось взять статусы' );
        activeStatusFilters = await res.json();
        console.log(activeStatusFilters);
        
    }

    function renderDishes() {
        
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
                    ${ticket.items.map((dish, index) => `
                        <div class="dish-item ${getStatusClass(dish.status)}" data-index="${index}">

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
            
            orderCard.addEventListener('click', (event) => {

                const dishElement = event.target.closest('.dish-item');

                if (!dishElement) return;

                document
                .querySelector('.dish-item.selected')
                    ?.classList.remove('selected');
                    
                    dishElement.classList.add('selected');
                    
                    const index = Number(dishElement.dataset.index);
                    const dish = ticket.items[index];

                    showDishMenu(
                        event.pageX,
                        event.pageY,
                        ticket,
                    dish,
                    dishElement
                );
                
            });

            dishList.appendChild(orderCard);

        });
        
    }


    async function changeStatusFilter(dataStatus, enabled) {
        const res = await fetch(`/api/station/change-status-filter`, {
            method: "POST",
            headers: {'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({status: dataStatus, enabled})
        });

        if (!res.ok) console.error('Что-то пошло не так');
        activeStatusFilters = await res.json();

        await loadDishes();
        
    }


    
    const getStatusClass = (status) => {
        const classes = {
            'NEW' : 'dish-cooking',
            'READY': 'dish-ready',
            'GIVEN': 'dish-given'
        }

        return classes[status];
    };

    function showDishMenu(x, y, ticket, dish, dishElement) {

        document.querySelector('.dish-menu')?.remove();

        const menu = document.createElement('div');
        menu.className = 'dish-menu';

        menu.innerHTML = `
            <button data-status="READY">
                ✔ Приготовлено
            </button>

            <button data-status="GIVEN">
                📦 Отдано
            </button>
        `;

        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        document.body.appendChild(menu);

        menu.querySelectorAll('button').forEach(button => {

            button.addEventListener('click', async () => {

                const status = button.dataset.status;

                await updateDishStatus(dish.id, status);

                // console.log(ticket);
                // console.log(dish);
                // console.log(status);
                // console.log(dish.id);

                // ==========================
                // TODO:
                // Здесь будет твой fetch()
                // await updateDishStatus(ticket.id, dish.id, status);
                // ==========================

                menu.remove();
                dishElement.classList.remove('selected');

            });

        });

        setTimeout(() => {

            document.addEventListener('click', function close(e) {

                if (!menu.contains(e.target)) {
                    menu.remove();
                    dishElement.classList.remove('selected');
                }

            }, { once: true });

        });

    }

    async function updateDishStatus(dishId, status) {
        const res = await fetch(`/api/station/update-dish-status`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({dishId, status})
        });
        if (!res.ok) {
            console.error('Не удалось изменить статус');
        }

        await loadDishes();

    }

    await loadDishes();


});