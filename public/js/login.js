let pin = '';

const pinDisplay = document.getElementById('pinDisplay');
const keys = document.querySelectorAll('.key');

keys.forEach(key => {
  key.addEventListener('click', () => {
    const value = key.textContent;

    if (value === 'C') {
      pin = '';
    } else if (value === 'OK') {
      submitPin();
      return;
    } else {
      if (pin.length < 4) {
        pin += value;
      }
    }

    updateDisplay();
  });
});

function updateDisplay() {
  pinDisplay.textContent = '•'.repeat(pin.length);
}



function submitPin() {
  if (pin.length < 4) {
    alert('Введите PIN полностью');
    return;
  }

 

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pin })
  })
  .then(res => res.json())
  .then(data => {
 
    if (!data.success) {
      alert('Неверный PIN');
      pin = '';
      updateDisplay();
      return;
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/main';
  });
}

