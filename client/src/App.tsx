import React, { useEffect, useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStats from './components/TransactionsStats';
import TransactionsBarChart from './components/TransactionsBarChart';

const App: React.FC = () => {
    const [month, setMonth] = useState('March');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Transactions Dashboard</h1>
            <div className="mb-4">
                <select onChange={(e) => setMonth(e.target.value)} value={month} className="border p-2">
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={new Date(0, i).toLocaleString('default', { month: 'long' })}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 ml-2"
                />
            </div>
            <TransactionsTable month={month} search={search} page={page} setPage={setPage} perPage={perPage} />
            <TransactionsStats month={month} />
            <TransactionsBarChart month={month} />
        </div>
    );
};

export default App;

