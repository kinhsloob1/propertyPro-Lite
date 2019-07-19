import { Router } from 'express';
import v2Router from './v2/index';

const router = Router({
  mergeParams: true,
});

router.use('/v2', v2Router);
export default router;
