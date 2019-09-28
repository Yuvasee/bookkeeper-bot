import mongoose = require('mongoose');

export default function withDb(fn: () => void) {
    mongoose.connect(process.env.MONGO_STRING, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', () => {
        console.log('Connected to MongoDB');
        fn();
    });
}
