// Класс для хранения данных пользователя при входе
class UserLogin {
    constructor(email, password, rememberMe) {
        this.email = email;
        this.password = password;
        this.rememberMe = rememberMe;
        this.loginTime = new Date().toISOString();
    }

    // Метод форматированного вывода в консоль
    printToConsole() {
        console.log('======= ДАННЫЕ ВХОДА =======');
        console.log(`📧 Email: ${this.email}`);
        console.log(`🔒 Пароль: ${this.password.replace(/./g, '*')}`);
        console.log(`💾 Запомнить: ${this.rememberMe ? 'Да' : 'Нет'}`);
        console.log(`⏰ Время: ${new Date(this.loginTime).toLocaleString('ru-RU')}`);
        console.log('============================');
    }

    // Дополнительный метод для валидации
    validate() {
        const errors = [];
        
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
        
        return errors;
    }
}