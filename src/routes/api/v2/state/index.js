import { Router } from 'express';
import { processState } from '../../../../middlewares/states/index';
import {
  getCities,
  getState,
  getStates,
} from '../../../../controllers/states/index';

const router = Router({
  mergeParams: true,
});

router.get('/', getStates);
router.get('/:stateName([a-zA-Z]{1,})', processState, getState);
router.get('/:stateName([a-zA-Z]{1,})/cities', processState, getCities);
export default router;
