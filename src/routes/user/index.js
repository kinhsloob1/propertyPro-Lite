import { Router } from 'express';
import { enforceLogged } from '../../middlewares/auth/index';
import { processUser } from '../../middlewares/user/index';
import { getUserData, updateUser, deleteUser } from '../../controllers/users/index';

const router = Router({
  mergeParams: true,
});

router.use(enforceLogged);
router.use(processUser);
router
  .route('/')
  .get(getUserData)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
