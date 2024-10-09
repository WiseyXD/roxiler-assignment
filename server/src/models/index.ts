

import mongoose, { Document, Schema } from 'mongoose';

interface ITransaction extends Document {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    sold: boolean;
    dateOfSale: Date;
}

const TransactionSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    sold: { type: Boolean, required: true },
    dateOfSale: { type: Date, required: true },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
