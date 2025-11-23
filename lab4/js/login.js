// Обработчик формы входа
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form__form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные из формы
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.querySelector('input[name="remember"]').checked;
            
            // Создаем объект пользователя
            const user = new UserLogin(email, password, rememberMe);
            
            // Валидация
            const errors = user.validate();
            if (errors.length > 0) {
                alert('Ошибки:\n' + errors.join('\n'));
                return;
            }
            
            // Выводим в консоль
            user.printToConsole();
            
            // Показываем уведомление
            NotificationManager.showNotification('✅ Данные успешно обработаны! Проверьте консоль браузера.', 'success');
            
            // Очищаем форму (опционально)
            // loginForm.reset();
        });
    }
});