document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const resultContainer = document.getElementById('result-container');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, password })
        });

        const result = await response.text();

        if (response.ok && result.includes("<!DOCTYPE html>")) {
          // نجاح، نوجه المستخدم للصفحة الرئيسية
          window.location.href = '/home.html';
        } else {
          // رسالة خطأ تظهر في الصفحة
          resultContainer.textContent = result;
        }
      } catch (error) {
        console.error('خطأ في الاتصال بالخادم:', error);
        alert('حدث خطأ في تسجيل الدخول');
      }
    });
  }
});