import express from 'express';
import controller from '../controller/auth';

const router = express.Router();

router.post('/user-login', controller.login);

export default router;
