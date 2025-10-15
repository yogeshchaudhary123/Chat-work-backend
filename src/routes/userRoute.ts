import express from 'express';
import controller from '../controller/user';

const router = express.Router();

router.get('/', controller.getUser);

export default router;
