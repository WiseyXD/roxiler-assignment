import express from 'express';
import {
    seedDatabase,
    getTransactions,
    getStatistics,
    getPriceRange,
    getCategoryDistribution,
    getCombinedData
} from '../controllers/index';

const router = express.Router();

router.post('/seed-database', seedDatabase);

router.get('/transactions', getTransactions);

router.get('/transactions/statistics', getStatistics);

router.get('/transactions/bar-chart', getPriceRange);

router.get('/transactions/pie-chart', getCategoryDistribution);

router.get('/transactions/combined', getCombinedData);

export default router;

