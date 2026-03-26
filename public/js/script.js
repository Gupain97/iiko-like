const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = 'green';
      message.textContent = 'Успешный вход! JWT: ' + data.token + ' ' + data.user.role;
      console.log(data)
    } else {
      message.style.color = 'red';
      message.textContent = data.message;
    }
  } catch (err) {
    message.style.color = 'red';
    message.textContent = 'Ошибка сервера';
  }
});
