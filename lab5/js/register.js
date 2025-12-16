// Обработчик формы регистрации с динамической валидацией и POST-запросом
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    const usernameHint = document.getElementById('usernameHint');
    const emailHint = document.getElementById('emailHint');
    const passwordHint = document.getElementById('passwordHint');
    const confirmPasswordHint = document.getElementById('confirmPasswordHint');
    
    const strengthBar = document.querySelector('.password-strength__fill');
    const strengthText = document.querySelector('.password-strength__text');
    
    if (!registerForm) {
        console.error('Форма регистрации не найдена');
        return;
    }
    
    // Функции валидации
    function validateUsername(username) {
        const errors = [];
        
        if (!username) {
            errors.push('Имя пользователя обязательно');
        } else if (username.length < 3) {
            errors.push('Имя пользователя должно быть не менее 3 символов');
        } else if (username.length > 20) {
            errors.push('Имя пользователя должно быть не более 20 символов');
        } else if (!/^[a-zA-Zа-яА-Я0-9_]+$/.test(username)) {
            errors.push('Имя пользователя может содержать только буквы, цифры и подчеркивание');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
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
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Некорректный формат email');
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
        } else if (!/[A-Z]/.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну заглавную букву');
        } else if (!/[0-9]/.test(password)) {
            errors.push('Пароль должен содержать хотя бы одну цифру');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    function validateConfirmPassword(password, confirmPassword) {
        const errors = [];
        
        if (!confirmPassword) {
            errors.push('Подтверждение пароля обязательно');
        } else if (password !== confirmPassword) {
            errors.push('Пароли не совпадают');
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
    
    // Функция обновления индикатора сложности пароля
    function updatePasswordStrength(password) {
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const strengthClasses = [
            'password-strength__fill--weak',
            'password-strength__fill--weak',
            'password-strength__fill--medium',
            'password-strength__fill--strong',
            'password-strength__fill--strong'
        ];
        
        const strengthMessages = [
            'Очень слабый',
            'Слабый',
            'Средний',
            'Сильный',
            'Очень сильный'
        ];
        
        strengthBar.className = 'password-strength__fill ' + strengthClasses[strength];
        strengthText.textContent = strengthMessages[strength];
    }
    
    // Обработчики событий для динамической валидации
    usernameInput.addEventListener('input', function() {
        const result = validateUsername(this.value);
        
        if (this.value === '') {
            clearHint(usernameHint);
        } else if (!result.isValid) {
            showHint(usernameHint, result.errors[0], 'error');
        } else {
            showHint(usernameHint, '✓ Имя пользователя доступно', 'success');
        }
    });
    
    usernameInput.addEventListener('blur', function() {
        if (this.value === '') {
            showHint(usernameHint, 'Введите имя пользователя', 'info');
        }
    });
    
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
        const password = this.value;
        const result = validatePassword(password);
        
        // Обновляем индикатор сложности
        updatePasswordStrength(password);
        
        if (password === '') {
            clearHint(passwordHint);
        } else if (!result.isValid) {
            showHint(passwordHint, result.errors[0], 'error');
        } else {
            showHint(passwordHint, '✓ Пароль надежный', 'success');
        }
        
        // Проверяем подтверждение пароля, если оно уже введено
        if (confirmPasswordInput.value) {
            const confirmResult = validateConfirmPassword(password, confirmPasswordInput.value);
            if (!confirmResult.isValid) {
                showHint(confirmPasswordHint, confirmResult.errors[0], 'error');
            } else {
                showHint(confirmPasswordHint, '✓ Пароли совпадают', 'success');
            }
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        if (this.value === '') {
            showHint(passwordHint, 'Придумайте пароль', 'info');
        }
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        const confirmResult = validateConfirmPassword(passwordInput.value, this.value);
        
        if (this.value === '') {
            clearHint(confirmPasswordHint);
        } else if (!confirmResult.isValid) {
            showHint(confirmPasswordHint, confirmResult.errors[0], 'error');
        } else {
            showHint(confirmPasswordHint, '✓ Пароли совпадают', 'success');
        }
    });
    
    confirmPasswordInput.addEventListener('blur', function() {
        if (this.value === '') {
            showHint(confirmPasswordHint, 'Повторите пароль', 'info');
        }
    });
    
    // Обработчик отправки формы
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Финальная валидация
        const usernameResult = validateUsername(username);
        const emailResult = validateEmail(email);
        const passwordResult = validatePassword(password);
        const confirmResult = validateConfirmPassword(password, confirmPassword);
        
        let hasErrors = false;
        
        if (!usernameResult.isValid) {
            showHint(usernameHint, usernameResult.errors[0], 'error');
            hasErrors = true;
        }
        
        if (!emailResult.isValid) {
            showHint(emailHint, emailResult.errors[0], 'error');
            hasErrors = true;
        }
        
        if (!passwordResult.isValid) {
            showHint(passwordHint, passwordResult.errors[0], 'error');
            hasErrors = true;
        }
        
        if (!confirmResult.isValid) {
            showHint(confirmPasswordHint, confirmResult.errors[0], 'error');
            hasErrors = true;
        }
        
        if (hasErrors) {
            NotificationManager.showNotification('❌ Исправьте ошибки в форме', 'error');
            return;
        }
        
        try {
            // Создаем объект пользователя для консоли (старый функционал)
            const user = new UserRegister(username, email, password, confirmPassword);
            user.printToConsole();
            
            // Отправляем POST-запрос на сервер
            const response = await fetch('http://localhost:8000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    action: 'register',
                    registeredAt: new Date().toISOString(),
                    userId: user.userId
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! Статус: ${response.status}`);
            }
            
            const responseData = await response.json();
            console.log('Ответ сервера:', responseData);
            
            // Показываем уведомление об успехе
            NotificationManager.showNotification('✅ Регистрация успешна! Данные отправлены на сервер.', 'success');
            
            // Очищаем форму (опционально)
            // registerForm.reset();
            
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            NotificationManager.showNotification(`❌ Ошибка регистрации: ${error.message}`, 'error');
        }
    });
    
    // Инициализация индикатора сложности пароля
    updatePasswordStrength('');
});