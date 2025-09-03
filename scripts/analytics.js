function findBestMonth(metric) {
    const best = currentData.reduce((max, item) => item[metric] > max[metric] ? item : max);
    return `${best.monthShort} (${formatNumber(best[metric])})`;
}

function getTrend(values) {
    if (values.length < 2) return 'Недостаточно данных';
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    return change > 5 ? 'Растущий' : change < -5 ? 'Снижающийся' : 'Стабильный';
}

function getStability(values) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = (stdDev / avg) * 100;
    return coefficient < 10 ? 'Высокая' : coefficient < 20 ? 'Средняя' : 'Низкая';
}

function getVolatility(values) {
    const changes = [];
    for (let i = 1; i < values.length; i++) {
        changes.push(Math.abs(values[i] - values[i-1]) / values[i-1] * 100);
    }
    const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length;
    return avgChange < 15 ? 'Низкая' : avgChange < 30 ? 'Средняя' : 'Высокая';
}

function getEfficiency() {
    const totalRevenue = currentData.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = currentData.reduce((sum, item) => sum + item.expenses, 0);
    const efficiency = ((totalRevenue - totalExpenses) / totalRevenue) * 100;
    return `${efficiency.toFixed(2)}%`;
}

function getEfficiencyAnalysis() {
    const efficiency = parseFloat(getEfficiency());
    return efficiency > 50 ? 'Отличная эффективность' :
           efficiency > 30 ? 'Хорошая эффективность' :
           efficiency > 10 ? 'Средняя эффективность' :
           'Требует улучшения';
}

function predictNextValue(values) {
    if (values.length < 3) return values[values.length - 1];
    const n = values.length;
    const trend = (values[n-1] - values[0]) / (n-1);
    return values[n-1] + trend;
}

// Анализа и рекомендаций
function getIncomeAnalysis() {
    const incomes = currentData.map(item => item.income);
    const trend = getTrend(incomes);
    return trend === 'Растущий' ? 'Положительная динамика' : 
           trend === 'Снижающийся' ? 'Требует внимания' : 'Стабильные показатели';
}

function getExpenseAnalysis() {
    const expenses = currentData.map(item => item.expenses);
    const stability = getStability(expenses);
    return stability === 'Высокая' ? 'Хороший контроль затрат' : 'Возможна оптимизация';
}

function getProfitAnalysis() {
    const profits = currentData.map(item => item.profit);
    const volatility = getVolatility(profits);
    return volatility === 'Низкая' ? 'Стабильная прибыльность' : 'Нестабильные показатели';
}

function getIncomeRecommendation() {
    const trend = getTrend(currentData.map(item => item.income));
    return trend === 'Снижающийся' ? 'Активизировать продажи и маркетинг' : 
           'Поддерживать текущие инициативы';
}

function getExpenseRecommendation() {
    const stability = getStability(currentData.map(item => item.expenses));
    return stability === 'Низкая' ? 'Усилить контроль над расходами' : 
           'Текущий уровень контроля адекватный';
}

function getProfitRecommendation() {
    const efficiency = parseFloat(getEfficiency());
    return efficiency < 20 ? 'Критически важно оптимизировать операции' :
           efficiency < 40 ? 'Есть потенциал для улучшения' :
           'Показатели в пределах нормы';
}