import { Router } from 'express';
import { processProperty } from '../../../../../middlewares/property/index';
import { getPropertyFlags } from '../../../../../controllers/properties/index';

const router = Router({
  mergeParams: true,
});

router.get('/', [processProperty], getPropertyFlags);
export default router;
