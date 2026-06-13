document.addEventListener("DOMContentLoaded", async () => {

    const dishList = document.getElementById('dishList');

    let station = null;
    let currentDishes = null;

    if (!dishList) console.error("dishList Not Found");
    console.log(dishList);
    
    await loadDishes();



    async function loadDishes() {
        console.log("сработал лоадДишес");
        const res = await fetch(`/api/station/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ station })
        });

        currentDishes = await res.json();
        console.log(currentDishes);
        await renderDishes();

        
    }


    async function renderDishes() {


        if (!currentDishes) {
            dishList.innerHTML = `
            <tr>
                <td colspan="5">Нет заказов)</td>
            </tr>`

        return;
            
        }

        currentDishes.forEach(ticket => {
            const row = document.createElement('tr');


            row.innerHTML= `
            <td>${ticket.surname}</td>
            <td>${ticket.createdAt}</td>
            <td>Стол № ${ticket.tableNumber}</td>
            <td>
                <ul>
                    ${ticket.items.map(dish => `
                        <li>
                            ${dish.name}
                            ${dish.quantity}
                        </li>
                        `).join('')}
                </ul>
            </td>
            
            `;
            
        
        dishList.appendChild(row);
            
        });
        
    }


})