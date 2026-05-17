window.currentPage = "menu"
document.addEventListener("DOMContentLoaded", () => {
    

    const deliveryBtn = document.getElementById("deliveryBtn");
    const ordersBtn = document.getElementById("ordersBtn");
    const closeShiftBtn = document.getElementById("closeShiftBtn");
    const stopListBtn = document.getElementById("stopListBtn");



    deliveryBtn.addEventListener("click", async () => {
        window.location.href = "/html/delivery.html"
    });
    

    ordersBtn.addEventListener("click", async () => {
        window.location.href = "/main"
    });

    closeShiftBtn.addEventListener("click", async () => {
        await closeShiftUser();
    })

    stopListBtn.addEventListener("click", async () => {
        window.location.href = "/html/stopList.html"

    });



})

async function closeShiftUser() {
  const userRaw = localStorage.getItem('user');
  const user = JSON.parse(userRaw);

  const res = await fetch('/api/shifts/closeShiftUser', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId: user.id})
  });
  const data = await res.json();
  if (data != "Смена закрыта!")  { alert ("Незакрытых столов на сумму " + data + " рублей")
  } else {
    alert(data)};

}     