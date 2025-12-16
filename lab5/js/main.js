document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('plans-table-body');
    const SERVER_URL = 'http://localhost:8000';
    let refreshInterval;
    
    if (!tableBody) {
        console.error('Таблица тарифов не найдена');
        return;
    }
    
    function showLoadingState() {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="comparison__table-cell comparison__table-cell--loading">
                    Загрузка данных с сервера...
                </td>
            </tr>
        `;
    }
    
    function showErrorState(errorMessage) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="comparison__table-cell comparison__table-cell--error">
                    Ошибка загрузки данных: ${errorMessage}
                    <br>
                    <button class="retry-btn" onclick="location.reload()">Обновить страницу</button>
                </td>
            </tr>
        `;
    }
    
    function updateTable(plans) {
        if (!Array.isArray(plans) || plans.length === 0) {
            showErrorState('Нет данных для отображения');
            return;
        }
        
        const rowsData = [
            { key: 'generations', title: 'Количество генераций в месяц' },
            { key: 'quality', title: 'Максимальное качество' },
            { 
                key: 'formats', 
                title: 'Поддерживаемые форматы',
                format: value => Array.isArray(value) ? value.join(', ') : value
            },
            { 
                key: 'priority', 
                title: 'Приоритетная обработка',
                format: value => value ? '✅' : '❌',
                cellClass: value => value ? 'status--active' : 'status--inactive'
            },
            { key: 'support', title: 'Техническая поддержка' },
            { 
                key: 'price', 
                title: 'Стоимость в месяц',
                cellClass: () => 'price'
            },
            { key: 'yearlySave', title: 'Годовая экономия' }
        ];
        
        let rowsHTML = '';
        
        rowsData.forEach(row => {
            rowsHTML += `<tr class="comparison__table-row">`;
            rowsHTML += `<td class="comparison__table-cell text--left">${row.title}</td>`;
            
            plans.forEach(plan => {
                let value = plan[row.key];
                if (row.format) value = row.format(value);
                
                let cellClass = 'comparison__table-cell text--center';
                if (row.cellClass) cellClass += ` ${row.cellClass(plan[row.key])}`;
                
                rowsHTML += `<td class="${cellClass}">${value}</td>`;
            });
            
            rowsHTML += `</tr>`;
        });
        
        tableBody.innerHTML = rowsHTML;
        
        if (!window.tableInitialized) {
            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.showNotification('✅ Таблица загружена', 'success');
            }
            window.tableInitialized = true;
        }
    }
    
    async function loadPlansData() {
        try {
            const response = await fetch(`${SERVER_URL}/plans`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            console.log('Полученный ответ:', response);
            
            if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);
            
            const result = await response.json();
            const plans = result.data;
            console.log('Полученный план:', plans);
            
            if (!plans) throw new Error('Сервер вернул пустые данные');
            
            updateTable(plans);
            return plans;
            
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            showErrorState(error.message);
            throw error;
        }
    }
    
    function startAutoRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        
        refreshInterval = setInterval(async () => {
            try {
                await loadPlansData();
                if (typeof NotificationManager !== 'undefined') {
                    NotificationManager.showNotification('📊 Таблица тарифов обновлена', 'info');
                }
            } catch (error) {
                console.error('Ошибка при автообновлении:', error);
            }
        }, 300000);
    }
    
    async function init() {
        showLoadingState();
        
        try {
            await loadPlansData();
            startAutoRefresh();
        } catch (error) {
            console.error('Ошибка инициализации:', error);
        }
    }
    
    init();
    
    window.refreshTable = loadPlansData;
    window.stopAutoRefresh = function() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    };
    window.startAutoRefresh = startAutoRefresh;
});