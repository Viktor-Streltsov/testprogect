class DatabaseConnection {
    constructor() {
        this.data = [];
        this.isConnected = false;
        this.updateInterval = null;
        this.realTimeMode = false;
    }

    // Симуляция подключения к базе данных
    async connect() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isConnected = true;
                console.log('✅ Подключение к базе данных установлено');
                resolve(true);
            }, 1000);
        });
    }

    // Генерация базовых данных с реальными датами
    generateBaseData() {
        const currentDate = new Date();
        const products = ['Товар A', 'Товар B', 'Товар C', 'Товар D', 'Товар E'];
        const data = [];
        
        // Создаем данные за последние 6 месяцев
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - i);
            
            const monthNames = [
                'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ];
            
            data.push({
                id: 6 - i,
                month: monthNames[date.getMonth()],
                monthShort: date.toLocaleString('ru-RU', { month: 'short' }),
                date: new Date(date.getFullYear(), date.getMonth(), 1), // первое число месяца
                year: date.getFullYear(),
                baseIncome: 900000 + ((5-i) * 50000), // базовый доход растет
                baseExpenses: 400000 + ((5-i) * 20000),
                income: 0, // будет обновляться динамически
                expenses: 0, // будет обновляться динамически
                profit: 0,
                orders: 150 + ((5-i) * 10),
                growth: 0,
                product: products[Math.floor(Math.random() * products.length)],
                lastUpdate: Date.now()
            });
        }
        
        return data;
    }

    // Динамическое обновление данных
    updateDataRealTime() {
        if (this.data.length === 0) {
            this.data = this.generateBaseData();
        }

        this.data.forEach((item, index) => {
            // Имитация колебаний рынка
            const timeNow = Date.now();
            const timeDiff = (timeNow - item.lastUpdate) / 1000; // в секундах
            
            // Динамические изменения на основе времени
            const marketVolatility = Math.sin(timeNow / 10000) * 0.1; // волатильность рынка
            const seasonalTrend = Math.cos((timeNow / 1000) + (index * 0.5)) * 0.05; // сезонные тренды
            
            // Обновление доходов (колебания ±10% от базового значения)
            const incomeVariation = (Math.sin(timeNow / 5000 + index) * 0.1) + marketVolatility + seasonalTrend;
            item.income = Math.max(0, item.baseIncome * (1 + incomeVariation));
            
            // Обновление расходов (более стабильные, но тоже изменяются)
            const expenseVariation = (Math.sin(timeNow / 8000 + index) * 0.05) + (marketVolatility * 0.5);
            item.expenses = Math.max(0, item.baseExpenses * (1 + expenseVariation));
            
            // Обновление заказов
            const orderVariation = Math.sin(timeNow / 6000 + index) * 15;
            item.orders = Math.max(1, Math.floor(item.orders + orderVariation));
            
            // Пересчет прибыли и роста
            const oldProfit = item.profit;
            item.profit = item.income - item.expenses;
            item.growth = oldProfit > 0 ? ((item.profit - oldProfit) / oldProfit) * 100 : 0;
            
            item.lastUpdate = timeNow;
        });

        return this.data;
    }

    // Симуляция SQL запроса с динамическими данными
    async query(sql) {
        if (!this.isConnected) {
            await this.connect();
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const dynamicData = this.updateDataRealTime();
                resolve([...dynamicData]); // возвращаем копию
            }, 200);
        });
    }

    // Запуск режима реального времени
    startRealTimeUpdates(callback, interval = 2000) {
        this.realTimeMode = true;
        console.log('🔄 Запущен режим обновления в реальном времени');
        
        this.updateInterval = setInterval(async () => {
            if (this.realTimeMode) {
                const data = await this.query('SELECT * FROM sales_data');
                callback(data);
            }
        }, interval);
    }

    // Остановка режима реального времени
    stopRealTimeUpdates() {
        this.realTimeMode = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('⏹️ Режим реального времени остановлен');
        }
    }

    // Симуляция обновления данных в реальном времени
    async updateData(id, newData) {
        console.log(`🔄 Обновление записи ${id} в базе данных:`, newData);
        return Promise.resolve(true);
    }
}