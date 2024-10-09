
import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../api/api';

interface Transaction {
    id: number;
    title: string;
    description: string;
    price: number;
    sold: boolean;
}

const TransactionsTable: React.FC<{ month: string; search: string; page: number; setPage: (page: number) => void; perPage: number }> = ({ month, search, page, setPage, perPage }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const getTransactions = async () => {
            const data = await fetchTransactions(month, search, page, perPage);
            setTransactions(data.transactions);
            setTotalPages(data.totalPages);
        };

        getTransactions();
    }, [month, search, page, perPage]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{transaction.sold ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
                <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;
