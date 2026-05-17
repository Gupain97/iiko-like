

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("header-container");

  // если контейнера нет — выходим
  if (!container) return;

  try {

    // ===== загружаем html хедера =====
    const res = await fetch("/components/header.html");

    if (!res.ok) {
      throw new Error("HEADER_NOT_LOADED");
    }

    // ===== получаем html как текст =====
    const html = await res.text();

    // ===== вставляем хедер в страницу =====
    container.innerHTML = html;
    const logoutBtn = document.getElementById('logoutBtn');
    const menuBtn = document.getElementById('menuBtn');


    const userRaw = localStorage.getItem('user');
  if (!userRaw) {
    window.location.href = '/';
    return;
  }
 
  const user = JSON.parse(userRaw);
  
  // Заполняем данные пользователя
  document.getElementById('userName').textContent = `${user.name} ${user.surname}`;
  document.getElementById('userRole').textContent = `${user.role}`;
    

  menuBtn.addEventListener("click", () => { 
    if (window.currentPage === "menu") {
      window.location.href = "/main";
    } else {
    window.location.href = '/html/menu.html';}
  });

  
  logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/';
  });

}catch (err) {
    console.error("Ошибка загрузки хедера", err);
}
})   ;