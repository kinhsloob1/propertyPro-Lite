import { Router } from 'express';
import { enforceLogged } from '../../../middlewares/auth/index';
import { processProperty } from '../../../middlewares/property/index';

import { flagProperty } from '../../../controllers/properties/index';

const router = Router({
  mergeParams: true,
});

router.post('/', [processProperty, enforceLogged], flagProperty);
export default router;
