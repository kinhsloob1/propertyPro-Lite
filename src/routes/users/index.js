import { Router } from 'express';
import { getUsers } from '../../controllers/users/index';
import { enforceLogged, enforceUserIsAdministrator } from '../../middlewares/auth/index';

const router = Router({
  mergeParams: true,
});

router
  .route('/')
  .get([enforceLogged, enforceUserIsAdministrator], getUsers);

export default router;
