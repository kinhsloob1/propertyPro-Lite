import { Router } from 'express';
import authRouter from './auth/index';

const router = Router({
  mergeParams: true,
});

router.use('/auth', authRouter);

export default router;
