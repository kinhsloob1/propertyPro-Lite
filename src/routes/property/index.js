import { Router } from 'express';
import { enforceLogged } from '../../middlewares/auth/index';
import {
  addProperty,
} from '../../controllers/properties/index';

const router = Router({
  mergeParams: true,
});

router.post('/', enforceLogged, addProperty);
export default router;
