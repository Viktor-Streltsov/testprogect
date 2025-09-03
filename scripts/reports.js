// Функция генерации отчета в Excel
function generateReport() {
    if (currentData.length === 0) {
        alert('Сначала загрузите данные из базы данных');
        return;
    }

    try {
        // Создаем workbook (книгу Excel)
        const wb = XLSX.utils.book_new();
        
        // 1. Лист с общей сводкой
        const summaryData = [
            ['ОТЧЕТ ПО ПРОДАЖАМ'],
            ['Дата создания:', new Date().toLocaleString('ru-RU')],
            ['Режим реального времени:', realTimeActive ? 'Активен' : 'Отключен'],
            [''],
            ['ОБЩАЯ СВОДКА'],
            ['Показатель', 'Значение', 'Единица измерения'],
            ['Общий доход', Math.round(currentData.reduce((sum, item) => sum + item.income, 0)), 'руб.'],
            ['Общие расходы', Math.round(currentData.reduce((sum, item) => sum + item.expenses, 0)), 'руб.'],
            ['Общая прибыль', Math.round(currentData.reduce((sum, item) => sum + item.profit, 0)), 'руб.'],
            ['Всего заказов', currentData.reduce((sum, item) => sum + item.orders, 0), 'шт.'],
            ['Средний рост', (currentData.reduce((sum, item) => sum + item.growth, 0) / currentData.length).toFixed(2), '%'],
            ['Средний чек', Math.round((currentData.reduce((sum, item) => sum + item.income, 0)) / (currentData.reduce((sum, item) => sum + item.orders, 0))), 'руб.'],
            [''],
            ['АНАЛИЗ ПО ПЕРИОДАМ'],
            ['Лучший месяц по доходам:', findBestMonth('income')],
            ['Лучший месяц по прибыли:', findBestMonth('profit')],
            ['Месяц с наибольшим ростом:', findBestMonth('growth')]
        ];

        const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
        
        // Стилизация заголовков
        if (!summaryWS['!merges']) summaryWS['!merges'] = [];
        summaryWS['!merges'].push({s: {c: 0, r: 0}, e: {c: 2, r: 0}}); // Объединяем ячейки для заголовка

        XLSX.utils.book_append_sheet(wb, summaryWS, 'Сводка');

        // 2. Лист с детальными данными
        const detailData = [
            ['ДЕТАЛЬНЫЕ ДАННЫЕ ПО ПРОДАЖАМ'],
            [''],
            ['Период', 'Дата', 'Доходы (руб.)', 'Расходы (руб.)', 'Прибыль (руб.)', 'Заказы', 'Рост (%)', 'Топ товар', 'Последнее обновление']
        ];

        currentData.forEach(item => {
            detailData.push([
                item.monthShort,
                item.date.toLocaleDateString('ru-RU'),
                Math.round(item.income),
                Math.round(item.expenses),
                Math.round(item.profit),
                item.orders,
                item.growth.toFixed(2),
                item.product,
                new Date(item.lastUpdate).toLocaleString('ru-RU')
            ]);
        });

        // Добавляем итоговые строки
        detailData.push(['']);
        detailData.push([
            'ИТОГО:',
            '',
            Math.round(currentData.reduce((sum, item) => sum + item.income, 0)),
            Math.round(currentData.reduce((sum, item) => sum + item.expenses, 0)),
            Math.round(currentData.reduce((sum, item) => sum + item.profit, 0)),
            currentData.reduce((sum, item) => sum + item.orders, 0),
            (currentData.reduce((sum, item) => sum + item.growth, 0) / currentData.length).toFixed(2),
            '-',
            '-'
        ]);

        const detailWS = XLSX.utils.aoa_to_sheet(detailData);
        XLSX.utils.book_append_sheet(wb, detailWS, 'Детальные данные');

        // 3. Лист с графическими данными (для построения графиков в Excel)
        const chartData = [
            ['ДАННЫЕ ДЛЯ ГРАФИКОВ'],
            [''],
            ['Месяц', 'Доходы', 'Расходы', 'Прибыль', 'Маржинальность (%)']
        ];

        currentData.forEach(item => {
            const margin = item.income > 0 ? ((item.profit / item.income) * 100).toFixed(2) : 0;
            chartData.push([
                item.monthShort,
                Math.round(item.income),
                Math.round(item.expenses),
                Math.round(item.profit),
                margin
            ]);
        });

        const chartWS = XLSX.utils.aoa_to_sheet(chartData);
        XLSX.utils.book_append_sheet(wb, chartWS, 'Данные для графиков');

        // 4. Лист с аналитикой
        const analyticsData = [
            ['АНАЛИТИКА И ПРОГНОЗЫ'],
            [''],
            ['ТРЕНДЫ И ПОКАЗАТЕЛИ'],
            ['Показатель', 'Значение', 'Комментарий'],
            ['Общий тренд доходов', getTrend(currentData.map(item => item.income)), getIncomeAnalysis()],
            ['Стабильность расходов', getStability(currentData.map(item => item.expenses)), getExpenseAnalysis()],
            ['Волатильность прибыли', getVolatility(currentData.map(item => item.profit)), getProfitAnalysis()],
            ['Эффективность продаж', getEfficiency(), getEfficiencyAnalysis()],
            [''],
            ['РЕКОМЕНДАЦИИ'],
            ['1. Управление доходами:', '', getIncomeRecommendation()],
            ['2. Оптимизация расходов:', '', getExpenseRecommendation()],
            ['3. Увеличение прибыли:', '', getProfitRecommendation()],
            [''],
            ['ПРОГНОЗ НА СЛЕДУЮЩИЙ ПЕРИОД'],
            ['Ожидаемый доход:', Math.round(predictNextValue(currentData.map(item => item.income))), 'руб.'],
            ['Ожидаемые расходы:', Math.round(predictNextValue(currentData.map(item => item.expenses))), 'руб.'],
            ['Ожидаемая прибыль:', Math.round(predictNextValue(currentData.map(item => item.profit))), 'руб.']
        ];

        const analyticsWS = XLSX.utils.aoa_to_sheet(analyticsData);
        XLSX.utils.book_append_sheet(wb, analyticsWS, 'Аналитика');

        // Устанавливаем ширину колонок для лучшего отображения
        const colWidths = [
            { wpx: 200 }, // Период/Показатель
            { wpx: 120 }, // Числовые значения
            { wpx: 120 }, // Числовые значения
            { wpx: 120 }, // Числовые значения
            { wpx: 100 }, // Заказы
            { wpx: 100 }, // Рост
            { wpx: 120 }, // Товар
            { wpx: 180 }  // Время обновления
        ];

        // Применяем ширину колонок ко всем листам
        Object.keys(wb.Sheets).forEach(sheetName => {
            wb.Sheets[sheetName]['!cols'] = colWidths;
        });

        // Генерируем имя файла с датой и временем
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const timeStr = now.toTimeString().slice(0, 5).replace(':', '-'); // HH-MM
        const fileName = `Отчет_по_продажам_${dateStr}_${timeStr}.xlsx`;

        // Сохраняем файл
        XLSX.writeFile(wb, fileName);

        // Показываем уведомление об успехе
        showNotification('✅ Excel отчет успешно создан и скачан!', 'success');
        
        console.log('📊 Excel отчет создан:', fileName);

    } catch (error) {
        console.error('❌ Ошибка при создании Excel отчета:', error);
        showNotification('❌ Ошибка при создании отчета', 'error');
    }
}

// Экспорт данных в JSON
function exportData() {
    if (currentData.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }

    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], {type:'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_data_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
}