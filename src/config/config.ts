import dotenv from 'dotenv';

dotenv.config();



const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatwork';

const config = {
    mongo: {
        uri: MONGODB_URI
    }
};

export default config;

