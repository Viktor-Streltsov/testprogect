// Фильтрация по периодам с использованием реальных дат
function filterByPeriod() {
    const period = document.getElementById('periodSelect').value;
    let filteredData = [...currentData];

    if (period !== 'all') {
        console.log(`🔍 Фильтрация данных по периоду: ${period}`);
        
        const now = new Date();
        let cutoffDate;
        
        // Определяем дату отсечения в зависимости от выбранного периода
        switch(period) {
            case 'week':
                cutoffDate = new Date(now);
                cutoffDate.setDate(cutoffDate.getDate() - 7);
                break;
                
            case 'month':
                cutoffDate = new Date(now);
                cutoffDate.setMonth(cutoffDate.getMonth() - 1);
                break;
                
            case 'quarter':
                cutoffDate = new Date(now);
                cutoffDate.setMonth(cutoffDate.getMonth() - 3);
                break;
        }
        
        // Фильтруем данные по дате
        filteredData = currentData.filter(item => {
            return item.date >= cutoffDate;
        });
        
        // Показываем информацию о фильтрации
        const periodNames = {
            'week': 'последние 7 дней',
            'month': 'последний месяц', 
            'quarter': 'последний квартал (3 месяца)'
        };
        
        const fromDateStr = cutoffDate.toLocaleDateString('ru-RU');
        const toDateStr = now.toLocaleDateString('ru-RU');
        
        showNotification(
            `📊 Показаны данные за ${periodNames[period]} (${fromDateStr} - ${toDateStr}). Найдено записей: ${filteredData.length}`, 
            'info'
        );
        
        console.log(`Отфильтровано ${filteredData.length} записей из ${currentData.length}`);
        console.log(`Период: с ${fromDateStr} по ${toDateStr}`);
        
    } else {
        showNotification('📊 Показаны все данные', 'info');
    }

    // Если нет данных после фильтрации, показываем предупреждение
    if (filteredData.length === 0) {
        showNotification('⚠️ Нет данных за выбранный период', 'error');
        // Показываем пустую таблицу
        document.getElementById('tableContainer').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #718096;">
                <h3>📅 Нет данных за выбранный период</h3>
                <p>Попробуйте выбрать другой временной диапазон</p>
            </div>
        `;
        return;
    }

    updateDashboard(filteredData);
    renderTable(filteredData);
}

// Дополнительная функция для получения подробной информации о датах
function getDateRangeInfo(period) {
    const now = new Date();
    let startDate, endDate;
    
    switch(period) {
        case 'week':
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
            endDate = now;
            break;
            
        case 'month':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 1);
            endDate = now;
            break;
            
        case 'quarter':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 3);
            endDate = now;
            break;
            
        default:
            return null;
    }
    
    return {
        start: startDate,
        end: endDate,
        startString: startDate.toLocaleDateString('ru-RU', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        endString: endDate.toLocaleDateString('ru-RU', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
}