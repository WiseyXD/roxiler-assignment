
import { Request, Response } from 'express';
import axios from 'axios';
import Transaction from '../models/index';

const DATA_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// Fetch seed data from the third-party API and initialize the database
export const seedDatabase = async (req: Request, res: Response) => {
    try {
        const { data } = await axios.get(DATA_URL);
        await Transaction.deleteMany(); // Clear previous data
        await Transaction.insertMany(data); // Insert new data

        res.status(201).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    const { page = 1, perPage = 10, search = '' } = req.query;

    const searchCriteria: any = {};
    //@ts-ignore
    const regex = new RegExp(search, 'i'); // Case-insensitive regex

    // Search by title and description
    if (search) {
        searchCriteria.$or = [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
        ];

        //@ts-ignore
        const price = parseFloat(search);
        if (!isNaN(price)) {
            searchCriteria.$or.push({ price: price });
        }
    }

    try {
        const transactions = await Transaction.find(searchCriteria)
            .skip((Number(page) - 1) * Number(perPage))
            .limit(Number(perPage));

        const total = await Transaction.countDocuments(searchCriteria);

        return res.status(200).json({
            transactions,
            total,
            page: Number(page),
            perPage: Number(perPage),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching transactions", error });
    }
};

export const getStatistics = async (req: Request, res: Response) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required.' });
    }

    const monthMapping: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    const monthIndex = monthMapping[month as string];

    if (monthIndex === undefined) {
        return res.status(400).json({ error: 'Invalid month provided.' });
    }

    const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 1);

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate }
        });

        const totalSales = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const soldItems = transactions.filter(t => t.sold).length; // Count sold items

        const unsoldItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate },
            sold: false,
        });

        return res.status(200).json({
            totalSales,
            soldItems,
            unsoldItems,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching statistics", error });
    }
};

export const getPriceRange = async (req: Request, res: Response) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required.' });
    }

    const monthMapping: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    const monthIndex = monthMapping[month as string];

    if (monthIndex === undefined) {
        return res.status(400).json({ error: 'Invalid month provided.' });
    }

    const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 1);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate }
        });

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };

        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) {
                priceRanges['0-100']++;
            } else if (price <= 200) {
                priceRanges['101-200']++;
            } else if (price <= 300) {
                priceRanges['201-300']++;
            } else if (price <= 400) {
                priceRanges['301-400']++;
            } else if (price <= 500) {
                priceRanges['401-500']++;
            } else if (price <= 600) {
                priceRanges['501-600']++;
            } else if (price <= 700) {
                priceRanges['601-700']++;
            } else if (price <= 800) {
                priceRanges['701-800']++;
            } else if (price <= 900) {
                priceRanges['801-900']++;
            } else {
                priceRanges['901-above']++;
            }
        });

        return res.status(200).json(priceRanges);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        return res.status(500).json({ message: "Error fetching bar chart data", error });
    }
};

export const getCategoryDistribution = async (req: Request, res: Response) => {
    const { month } = req.query;

    const monthMapping: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    const monthIndex = monthMapping[month as string];

    if (monthIndex === undefined) {
        return res.status(400).json({ error: 'Invalid month provided.' });
    }

    const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 1);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate }
        });

        const categoryCounts = transactions.reduce((acc: any, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json(categoryCounts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching category distribution', error });
    }
};


export const getCombinedData = async (req: Request, res: Response) => {
    const { month } = req.query;

    const monthMapping: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    const monthIndex = monthMapping[month as string];

    if (monthIndex === undefined) {
        return res.status(400).json({ error: 'Invalid month provided.' });
    }

    const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
    const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 1);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate }
        });

        const totalSales = transactions.reduce((acc, t) => acc + t.price, 0);
        const soldItems = transactions.filter(t => t.sold).length;
        const unsoldItems = transactions.filter(t => !t.sold).length;

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0
        };

        transactions.forEach(t => {
            if (t.price <= 100) priceRanges['0-100']++;
            else if (t.price <= 200) priceRanges['101-200']++;
            else if (t.price <= 300) priceRanges['201-300']++;
            else if (t.price <= 400) priceRanges['301-400']++;
            else if (t.price <= 500) priceRanges['401-500']++;
            else if (t.price <= 600) priceRanges['501-600']++;
            else if (t.price <= 700) priceRanges['601-700']++;
            else if (t.price <= 800) priceRanges['701-800']++;
            else if (t.price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        const categoryCounts = transactions.reduce((acc: any, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            statistics: { totalSales, soldItems, unsoldItems },
            priceRanges,
            categoryCounts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error });
    }
};
