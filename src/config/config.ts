import dotenv from 'dotenv';

dotenv.config();



const rawUri = process.env.MONGODB_URI || '';
console.log(`📡 Initializing DB Config. URI Length: ${rawUri.length}`);

if (rawUri.startsWith('123')) {
    console.error('🛑 ERROR: Your MONGODB_URI starts with "123". This is likely a typo in your Render environment variables!');
}

const config = {
    mongo: {
        uri: rawUri || 'mongodb://localhost:27017/chatwork'
    }
};

export default config;

