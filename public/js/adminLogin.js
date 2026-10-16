
const form = document.getElementById('loginForm');
const button = document.getElementById('submitBtn');
const message = document.getElementById('message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("мы в логине")
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value;

    message.className = 'message';
    message.textContent = '';

    if (!login || !password) {
        message.className = 'message error';
        message.textContent = 'Заполните логин и пароль.';
        return;
    }

    button.disabled = true;
    button.textContent = 'Вход...';


    try {
        const res = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login,
            password
        })
    });
    if (!res.ok) {
        throw new Error("Пользователь не найден", res.message);
    } 
    window.location.href= ('/admin/main')

    } catch (err) {
    console.error("Ошибка входа", err);
}

    setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Войти';

        message.className = 'message success';
        message.textContent = 'Данные отправлены.';
    }, 700);
});
