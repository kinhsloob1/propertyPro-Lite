import { Router } from 'express';
import authRouter from './auth/index';
import userRouter from './user/index';

const router = Router({
  mergeParams: true,
});

router.use('/auth', authRouter);
router.use('/user/:id', userRouter);

export default router;
