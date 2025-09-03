// Запуск режима реального времени
function startRealTimeMode() {
    if (realTimeActive) return;
    
    realTimeActive = true;
    
    // Добавляем индикатор реального времени
    addRealTimeIndicator();
    
    db.startRealTimeUpdates((data) => {
        currentData = data;
        updateDashboard(data);
        renderTable(data);
        
        // Обновляем индикатор
        updateRealTimeIndicator();
        
    }, 10000); // обновление каждые 10 секунды
}

// Остановка режима реального времени
function stopRealTimeMode() {
    realTimeActive = false;
    db.stopRealTimeUpdates();
    removeRealTimeIndicator();
}

// Добавление индикатора реального времени
function addRealTimeIndicator() {
    const header = document.querySelector('.header');
    if (header && !header.querySelector('.real-time-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'real-time-indicator';
        indicator.innerHTML = `
            <div class="indicator-dot"></div>
            <span>Данные обновляются в реальном времени</span>
            <button onclick="toggleRealTimeMode()" class="real-time-toggle">⏸️ Пауза</button>
        `;
        
        // Добавляем стили для индикатора
        const style = document.createElement('style');
        style.textContent = `
            .real-time-indicator {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 15px;
                font-size: 0.9em;
                opacity: 0.9;
            }
            
            .indicator-dot {
                width: 8px;
                height: 8px;
                background: #38a169;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            .real-time-toggle {
                font-size: 0.8em;
                padding: 5px 10px;
                margin-left: 10px;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }
            
            .data-updated {
                animation: highlight 1s ease-out;
            }
            
            @keyframes highlight {
                0% { background-color: rgba(56, 161, 105, 0.2); }
                100% { background-color: transparent; }
            }
        `;
        document.head.appendChild(style);
        
        header.appendChild(indicator);
    }
}

// Обновление индикатора реального времени
function updateRealTimeIndicator() {
    const indicator = document.querySelector('.indicator-dot');
    if (indicator) {
        indicator.style.background = '#38a169';
        setTimeout(() => {
            indicator.style.background = '#667eea';
        }, 200);
    }
    
    // Подсвечиваем обновленные данные
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.classList.add('data-updated');
        setTimeout(() => row.classList.remove('data-updated'), 1000);
    });
}

// Удаление индикатора реального времени
function removeRealTimeIndicator() {
    const indicator = document.querySelector('.real-time-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Переключение режима реального времени
function toggleRealTimeMode() {
    if (realTimeActive) {
        stopRealTimeMode();
    } else {
        startRealTimeMode();
    }
}