import { Router } from 'express';
import apiRouter from './api/index';

const router = Router({
  mergeParams: true,
});

router.use('/api', apiRouter);
export default router;
