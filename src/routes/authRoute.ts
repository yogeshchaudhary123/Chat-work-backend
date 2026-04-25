import express from 'express';
import controller from '../controller/auth';

const router = express.Router();

router.post('/user-login', controller.login);
router.post('/signup', controller.signup);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

export default router;
