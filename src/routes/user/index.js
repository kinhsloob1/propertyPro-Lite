import { Router } from 'express';
import { enforceLogged } from '../../middlewares/auth/index';
import { processUser } from '../../middlewares/user/index';
import { getUserData } from '../../controllers/users/index';

const router = Router({
  mergeParams: true,
});

router.use(enforceLogged);
router.use(processUser);
router
  .route('/')
  .get(getUserData);

export default router;
