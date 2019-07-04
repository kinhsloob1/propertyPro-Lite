import { Router } from 'express';
import { addUser } from '../../controllers/users/index';

const router = Router({
  mergeParams: true,
});

router.post('/signup', addUser);

export default router;
