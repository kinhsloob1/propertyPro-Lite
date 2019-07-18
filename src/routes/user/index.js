import { Router } from 'express';
import { enforceLogged } from '../../middlewares/auth/index';
import { ensureUserHasPermission } from '../../middlewares/user/index';
import { getUserData, updateUser, deleteUser } from '../../controllers/users/index';

const router = Router({
  mergeParams: true,
});

router
  .route('/')
  .get([enforceLogged, ensureUserHasPermission], getUserData)
  .patch([enforceLogged, ensureUserHasPermission], updateUser)
  .delete([enforceLogged, ensureUserHasPermission], deleteUser);

export default router;
