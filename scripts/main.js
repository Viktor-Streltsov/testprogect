// Глобальные переменные
const db = new DatabaseConnection();
let salesChart = null;
let currentData = [];
let realTimeActive = false;

// Загрузка данных из "базы данных"
async function loadSampleData() {
    try {
        // Показываем индикатор загрузки
        document.getElementById('tableContainer').innerHTML = 
            '<div class="loading">Выполняем SQL запрос к базе данных...</div>';

        // Выполняем запрос к базе данных
        const data = await db.query('SELECT * FROM sales_data ORDER BY month');
        currentData = data;

        // Обновляем интерфейс
        updateDashboard(data);
        renderTable(data);
        
        console.log('📊 Данные успешно загружены из базы данных:', data);
        
        // Запускаем режим реального времени
        if (!realTimeActive) {
            startRealTimeMode();
        }
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке данных:', error);
        document.getElementById('tableContainer').innerHTML = 
            '<div style="text-align: center; padding: 40px; color: #e53e3e;">Ошибка подключения к базе данных</div>';
    }
}

// Автозагрузка данных при запуске
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация динамического дашборда...');
    
    setTimeout(() => {
        loadSampleData();
    }, 1000);
});

// Остановка обновлений при закрытии страницы
window.addEventListener('beforeunload', function() {
    if (realTimeActive) {
        db.stopRealTimeUpdates();
    }
});