import { Router } from 'express';
import { enforceLogged } from '../../middlewares/auth/index';
import { ensureUserHasPermission, processProperty } from '../../middlewares/property/index';
import {
  addProperty,
  updateProperty,
} from '../../controllers/properties/index';
import soldRouter from './sold/index';

const router = Router({
  mergeParams: true,
});

router.post('/', enforceLogged, addProperty);
router.route('/:id')
  .patch([processProperty, enforceLogged, ensureUserHasPermission], updateProperty);

router.use('/:id/sold', soldRouter);
export default router;
