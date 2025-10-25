import config from '../config/config';
import { Pool } from 'pg';


const NAMESPACE = 'API Header';

let connection = new Pool({
    host: config.pg.host,
    user: config.pg.user,
    password: config.pg.password,
    database: config.pg.database,
    port: config.pg.port as any ,
});

const query = (text: string, params?: any[]) => {
    return connection.query(text, params);
};



export default {  query };