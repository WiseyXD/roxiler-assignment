
import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../api/api';

const TransactionsStats: React.FC<{ month: string }> = ({ month }) => {
    const [stats, setStats] = useState({ totalSales: 0, soldItems: 0, unsoldItems: 0 });

    useEffect(() => {
        const getStatistics = async () => {
            const data = await fetchStatistics(month);
            setStats(data);
        };

        getStatistics();
    }, [month]);

    return (
        <div className="flex flex-col p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Statistics</h2>
            <div className="flex justify-between mt-2">
                <div>Total Sales: ${stats.totalSales.toFixed(2)}</div>
                <div>Sold Items: {stats.soldItems}</div>
                <div>Unsold Items: {stats.unsoldItems}</div>
            </div>
        </div>
    );
};

export default TransactionsStats;
