// Отображение таблицы с подсветкой изменений и реальными датами
function renderTable(data) {
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Период</th>
                    <th>Дата</th>
                    <th>Доходы, руб.</th>
                    <th>Расходы, руб.</th>
                    <th>Прибыль, руб.</th>
                    <th>Заказы</th>
                    <th>Рост, %</th>
                    <th>Топ товар</th>
                    <th>Обновлено</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        <td><strong>${item.monthShort}</strong></td>
                        <td style="font-size: 0.9em; color: #4a5568;">${item.date.toLocaleDateString('ru-RU')}</td>
                        <td>${formatNumber(item.income)}</td>
                        <td>${formatNumber(item.expenses)}</td>
                        <td class="${item.profit >= 0 ? 'positive' : 'negative'}">${formatNumber(item.profit)}</td>
                        <td>${item.orders}</td>
                        <td class="${item.growth >= 0 ? 'positive' : 'negative'}">${item.growth.toFixed(1)}%</td>
                        <td>${item.product}</td>
                        <td style="font-size: 0.8em; color: #718096;">${new Date(item.lastUpdate).toLocaleTimeString('ru-RU')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('tableContainer').innerHTML = tableHTML;
}

// Обновление дашборда с анимациями
function updateDashboard(data) {
    // Обновляем статистику с анимациями
    const totalSales = data.reduce((sum, item) => sum + item.income, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
    const avgGrowth = data.reduce((sum, item) => sum + item.growth, 0) / data.length;
    const avgSale = totalSales / totalOrders;

    // Анимированное обновление значений
    animateValue('totalSales', formatNumber(totalSales));
    animateValue('totalOrders', totalOrders);
    animateValue('growth', avgGrowth.toFixed(1) + '%');
    animateValue('avgSale', formatNumber(avgSale));

    // Обновляем цвет роста
    const growthElement = document.getElementById('growth');
    growthElement.className = avgGrowth >= 0 ? 'stat-value positive' : 'stat-value negative';

    // Обновляем график
    updateChart(data);
}

// Анимация изменения значений
function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Создание/обновление графика с плавными переходами
function updateChart(data) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    if (salesChart) {
        // Обновление существующего графика
        salesChart.data.labels = data.map(item => item.monthShort);
        salesChart.data.datasets[0].data = data.map(item => item.income);
        salesChart.data.datasets[1].data = data.map(item => item.expenses);
        salesChart.data.datasets[2].data = data.map(item => item.profit);
        
        salesChart.update('active'); // плавная анимация обновления
    } else {
        // Создаем новый график
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.monthShort),
                datasets: [
                    {
                        label: 'Доходы',
                        data: data.map(item => item.income),
                        borderColor: '#38a169',
                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#38a169',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: 'Расходы',
                        data: data.map(item => item.expenses),
                        borderColor: '#e53e3e',
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#e53e3e',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    },
                    {
                        label: 'Прибыль',
                        data: data.map(item => item.profit),
                        borderColor: '#3182ce',
                        backgroundColor: 'rgba(49, 130, 206, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3182ce',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatNumber(context.parsed.y) + ' руб.';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatNumber(value);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Добавляем стили для уведомлений
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #38a169, #48bb78);
                border-left: 4px solid #25855a;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #e53e3e, #fc8181);
                border-left: 4px solid #c53030;
            }
            
            .notification-info {
                background: linear-gradient(135deg, #3182ce, #63b3ed);
                border-left: 4px solid #2c5aa0;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Автоматически убираем уведомление через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Форматирование чисел
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
}