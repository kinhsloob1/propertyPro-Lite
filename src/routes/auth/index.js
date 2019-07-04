import { Router } from 'express';
import { logUser, addUser } from '../../controllers/users/index';

const router = Router({
  mergeParams: true,
});

router.post('/signup', addUser);
router.post('/signin', logUser);

export default router;
