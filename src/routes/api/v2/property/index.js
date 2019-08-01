import { Router } from 'express';
import { enforceLogged } from '../../../../middlewares/auth/index';
import { ensureUserHasPermission, processProperty } from '../../../../middlewares/property/index';
import {
  getPropertyData,
  addProperty,
  updateProperty,
  deleteProperty,
  deleteUploadedFile,
  deletePropertyImage,
  generateCloudinaryHash,
} from '../../../../controllers/properties/index';
import soldRouter from './sold/index';
import flagRouter from './flag/index';
import flagsRouter from './flags/index';

const router = Router({
  mergeParams: true,
});

router.post('/', enforceLogged, addProperty);
router.post('/generate_cloudinary_hash', enforceLogged, generateCloudinaryHash);
router.route('/:propertyId(\\d{1,})')
  .get([processProperty], getPropertyData)
  .patch([processProperty, enforceLogged, ensureUserHasPermission], updateProperty)
  .delete([processProperty, enforceLogged, ensureUserHasPermission], deleteProperty);

router.delete('/file', enforceLogged, deleteUploadedFile);
router.delete('/:propertyId(\\d{1,})/image', [processProperty, enforceLogged, ensureUserHasPermission], deletePropertyImage);

router.use('/:propertyId(\\d{1,})/sold', soldRouter);
router.use('/:propertyId(\\d{1,})/flag', flagRouter);
router.use('/:propertyId(\\d{1,})/flags', flagsRouter);
export default router;
