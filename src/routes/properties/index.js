import { Router } from 'express';
import { getProperties } from '../../controllers/properties/index';

const router = Router({
  mergeParams: true,
});

router
  .route('/')
  .get(getProperties);

export default router;
