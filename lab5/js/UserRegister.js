// Класс для хранения данных регистрации
class UserRegister {
    constructor(username, email, password, confirmPassword) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.registrationTime = new Date().toISOString();
        this.userId = this.generateUserId();
    }

    // Генерация ID пользователя
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Метод форматированного вывода в консоль
    printToConsole() {
        console.log('======= ДАННЫЕ РЕГИСТРАЦИИ =======');
        console.log(`👤 Имя пользователя: ${this.username}`);
        console.log(`📧 Email: ${this.email}`);
        console.log(`🔒 Пароль: ${this.password.replace(/./g, '*')}`);
        console.log(`🔒 Подтверждение: ${this.confirmPassword.replace(/./g, '*')}`);
        console.log(`🆔 ID пользователя: ${this.userId}`);
        console.log(`⏰ Время: ${new Date(this.registrationTime).toLocaleString('ru-RU')}`);
        console.log(`✅ Пароли совпадают: ${this.passwordsMatch() ? 'Да' : 'Нет'}`);
        console.log('==================================');
    }

    // Проверка совпадения паролей
    passwordsMatch() {
        return this.password === this.confirmPassword;
    }

    // Валидация данных
    validate() {
        const errors = [];
        
        if (!this.username) {
            errors.push('Имя пользователя обязательно');
        } else if (this.username.length < 3) {
            errors.push('Имя пользователя должно быть не менее 3 символов');
        }
        
        if (!this.email) {
            errors.push('Email обязателен');
        } else if (!this.email.includes('@')) {
            errors.push('Некорректный email');
        }
        
        if (!this.password) {
            errors.push('Пароль обязателен');
        } else if (this.password.length < 6) {
            errors.push('Пароль должен быть не менее 6 символов');
        }
        
        if (!this.passwordsMatch()) {
            errors.push('Пароли не совпадают');
        }
        
        return errors;
    }

    // Дополнительный метод для оценки сложности пароля
    getPasswordStrength() {
        let strength = 0;
        if (this.password.length >= 8) strength++;
        if (/[A-Z]/.test(this.password)) strength++;
        if (/[0-9]/.test(this.password)) strength++;
        if (/[^A-Za-z0-9]/.test(this.password)) strength++;
        
        const levels = ['очень слабый', 'слабый', 'средний', 'сильный', 'очень сильный'];
        return levels[strength];
    }
}