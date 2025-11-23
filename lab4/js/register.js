// Обработчик формы регистрации
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form__form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const strengthBar = document.querySelector('.password-strength__fill');
    const strengthText = document.querySelector('.password-strength__text');

    console.log('Register script loaded'); // Для отладки

    // Обработчик ввода пароля
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Функция обновления индикатора сложности пароля
    function updatePasswordStrength(password) {
        if (!strengthBar || !strengthText) {
            console.log('Strength elements not found'); // Для отладки
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthClasses = ['password-strength__fill--weak', 'password-strength__fill--medium', 'password-strength__fill--medium', 'password-strength__fill--strong', 'password-strength__fill--strong'];
        const strengthMessages = ['Очень слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный'];
        
        strengthBar.className = 'password-strength__fill ' + strengthClasses[strength];
        strengthText.textContent = strengthMessages[strength];
    }

    // Обработчик отправки формы
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted'); // Для отладки
            
            // Получаем данные из формы
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            console.log('Form data:', { username, email, password, confirmPassword }); // Для отладки
            
            // Создаем объект пользователя
            const user = new UserRegister(username, email, password, confirmPassword);
            
            // Валидация
            const errors = user.validate();
            if (errors.length > 0) {
                NotificationManager.showNotification('❌ Ошибки:\n' + errors.join('\n'), 'error');
                return;
            }
            
            // Выводим в консоль
            user.printToConsole();
            
            // Показываем дополнительную информацию о пароле
            console.log(`💪 Сложность пароля: ${user.getPasswordStrength()}`);
            
            // Показываем уведомление об успехе
            NotificationManager.showNotification('🎉 Регистрация успешна! Данные выведены в консоль.', 'success');
            
            // Очищаем форму (опционально)
            // registerForm.reset();
        });
    } else {
        console.log('Register form not found'); // Для отладки
    }
});