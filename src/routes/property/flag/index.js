import { Router } from 'express';
import { enforceLogged } from '../../../middlewares/auth/index';
import { processProperty } from '../../../middlewares/property/index';
import { ensureUserHasPermission, processPropertyFlag } from '../../../middlewares/property/flag/index';
import { flagProperty, updatePropertyFlag, deletePropertyFlag } from '../../../controllers/properties/index';

const router = Router({
  mergeParams: true,
});

router.post('/', [processProperty, enforceLogged], flagProperty);
router.route('/:propertyFlagId')
  .patch(
    [
      processProperty,
      processPropertyFlag,
      enforceLogged,
      ensureUserHasPermission,
    ],
    updatePropertyFlag,
  )
  .delete(
    [
      processProperty,
      processPropertyFlag,
      enforceLogged,
      ensureUserHasPermission,
    ],
    deletePropertyFlag,
  );

export default router;
