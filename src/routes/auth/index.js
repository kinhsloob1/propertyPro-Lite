import { Router } from 'express';
import { logUser, addUser, resetUserPassword } from '../../controllers/users/index';

const router = Router({
  mergeParams: true,
});

router.post('/signup', addUser);
router.post('/signin', logUser);
router.post('/:userEmail(\\S{1,}@\\S{1,}.\\S{1,})/reset_password', resetUserPassword);

export default router;
