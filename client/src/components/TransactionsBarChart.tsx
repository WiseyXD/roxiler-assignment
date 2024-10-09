
import React, { useEffect, useState } from 'react';
import { fetchBarChartData } from '../api/api';
import { Bar } from 'react-chartjs-2';

const TransactionsBarChart: React.FC<{ month: string }> = ({ month }) => {
    const [chartData, setChartData] = useState<any>({});

    useEffect(() => {
        const getBarChartData = async () => {
            const data = await fetchBarChartData(month);
            const labels = Object.keys(data.priceRanges);
            const values = Object.values(data.priceRanges);

            setChartData({
                labels,
                datasets: [{
                    label: 'Number of Items',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }],
            });
        };

        getBarChartData();
    }, [month]);

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Transactions Bar Chart</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default TransactionsBarChart;
