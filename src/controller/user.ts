import {Request, Response } from 'express';
import header from '../connection/apiHeader'
const NAMESPACE = 'Users';

const getUser = async (req: Request, res: Response) => {
    let sql = `SELECT * FROM users `;
    let users = await header.query(sql)
    res.json(users.rows);
}

export default { getUser }
