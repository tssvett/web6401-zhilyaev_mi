// Обработчик формы входа с динамической валидацией и POST-запросом
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailHint = document.getElementById('emailHint');
    const passwordHint = document.getElementById('passwordHint');
    
    if (!loginForm) {
        console.error('Форма входа не найдена');
        return;
    }
    
    // Функции валидации
    function validateEmail(email) {
        const errors = [];
        
        if (!email) {
            errors.push('Email обязателен');
        } else if (!email.includes('@')) {
            errors.push('Email должен содержать @');
        } else if (!email.includes('.')) {
            errors.push('Email должен содержать точку');
        } else if (email.length < 5) {
            errors.push('Email слишком короткий');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    function validatePassword(password) {
        const errors = [];
        
        if (!password) {
            errors.push('Пароль обязателен');
        } else if (password.length < 6) {
            errors.push('Пароль должен быть не менее 6 символов');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Функция отображения подсказки
    function showHint(element, message, type) {
        element.textContent = message;
        element.className = 'form-hint';
        
        if (type === 'error') {
            element.classList.add('form-hint--error');
        } else if (type === 'success') {
            element.classList.add('form-hint--success');
        } else {
            element.classList.add('form-hint--info');
        }
    }
    
    function clearHint(element) {
        element.textContent = '';
        element.className = 'form-hint';
    }
    
    // Обработчики событий для динамической валидации
    emailInput.addEventListener('input', function() {
        const result = validateEmail(this.value);
        
        if (this.value === '') {
            clearHint(emailHint);
        } else if (!result.isValid) {
            showHint(emailHint, result.errors[0], 'error');
        } else {
            showHint(emailHint, '✓ Email корректен', 'success');
        }
    });
    
    emailInput.addEventListener('blur', function() {
        if (this.value === '') {
            showHint(emailHint, 'Введите ваш email', 'info');
        }
    });
    
    passwordInput.addEventListener('input', function() {
        const result = validatePassword(this.value);
        
        if (this.value === '') {
            clearHint(passwordHint);
        } else if (!result.isValid) {
            showHint(passwordHint, result.errors[0], 'error');
        } else {
            showHint(passwordHint, '✓ Пароль корректен', 'success');
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        if (this.value === '') {
            showHint(passwordHint, 'Введите ваш пароль', 'info');
        }
    });
    
    // Обработчик отправки формы
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = document.querySelector('input[name="remember"]').checked;
        
        // Финальная валидация
        const emailResult = validateEmail(email);
        const passwordResult = validatePassword(password);
        
        let hasErrors = false;
        
        if (!emailResult.isValid) {
            showHint(emailHint, emailResult.errors[0], 'error');
            hasErrors = true;
        }
        
        if (!passwordResult.isValid) {
            showHint(passwordHint, passwordResult.errors[0], 'error');
            hasErrors = true;
        }
        
        if (hasErrors) {
            NotificationManager.showNotification('❌ Исправьте ошибки в форме', 'error');
            return;
        }
        
        try {
            // Создаем объект пользователя для консоли (старый функционал)
            const user = new UserLogin(email, password, rememberMe);
            user.printToConsole();
            
            // Отправляем POST-запрос на сервер
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    rememberMe: rememberMe,
                    action: 'login',
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }
            
            const responseData = await response.json();
            console.log('Ответ сервера:', responseData);
            
            // Показываем уведомление об успехе
            NotificationManager.showNotification('✅ Данные успешно отправлены на сервер!', 'success');
            
            // Очищаем форму (опционально)
            // loginForm.reset();
            
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            NotificationManager.showNotification(`❌ Ошибка отправки: ${error.message}`, 'error');
        }
    });
});