import { Router } from 'express';
import authRouter from './auth/index';
import userRouter from './user/index';
import propertiesRouter from './properties/index';
import propertyRouter from './property/index';

const router = Router({
  mergeParams: true,
});

router.use('/auth', authRouter);
router.use('/user/:id', userRouter);
router.use('/properties', propertiesRouter);
router.use('/property', propertyRouter);

export default router;
