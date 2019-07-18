import { Router } from 'express';
import { enforceLogged } from '../../../middlewares/auth/index';
import { ensureUserHasPermission, processProperty } from '../../../middlewares/property/index';

import { setPropertySold } from '../../../controllers/properties/index';

const router = Router({
  mergeParams: true,
});

router.patch('/', [processProperty, enforceLogged, ensureUserHasPermission], setPropertySold);
export default router;
