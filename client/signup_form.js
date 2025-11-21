const form = document.querySelector('#signup-form');
const submitBtn = document.querySelector('#submit-btn');
const loadBtn = document.querySelector('#load-participants-btn');
const resultEl = document.querySelector('#result');
const toastEl = document.querySelector('#toast');

const API_BASE = 'http://localhost:3001';

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.classList.remove('d-none', 'alert-success', 'alert-danger');
  toastEl.classList.add(isError ? 'alert-danger' : 'alert-success');

  setTimeout(() => {
    toastEl.classList.add('d-none');
  }, 3000);
}

function buildPayloadFromForm(formElement) {
  const formData = new FormData(formElement);

  const interests = formData.getAll('interests');

  const payload = {
    name: formData.get('name')?.trim(),
    email: formData.get('email')?.trim(),
    phone: formData.get('phone')?.trim(),
    password: formData.get('password') || '',
    confirmPassword: formData.get('confirmPassword') || '',
    interests,
    terms: formData.get('terms') === 'on'
  };

  return payload;
}

async function submitSignup(data) {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload.error || '報名失敗');
  }

  return payload;
}

async function fetchParticipants() {
  const res = await fetch(`${API_BASE}/api/signup`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || '取得清單失敗');
  }

  return data;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = buildPayloadFromForm(form);

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';
    resultEl.textContent = '送出中...';

    const result = await submitSignup(payload);

    showToast(false);
    resultEl.textContent = JSON.stringify(result, null, 2);
    form.reset();
  } catch (error) {
    console.error(error);
    showToast(true);
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});

loadBtn.addEventListener('click', async () => {
  try{
    loadBtn.disabled = true;
    loadBtn.textContent = '載入中...';
    resultEl.textContent = '載入中...';

    const list = await fetchParticipants();
    resultEl.textContent = JSON.stringify(list, null, 2);
    showToast(false);
  } catch (error) {
    console.error(error);
    showToast(true);
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    loadBtn.disabled = false;
    loadBtn.textContent = '查看報名清單';
  }
});
