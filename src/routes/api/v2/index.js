import { Router } from 'express';
import authRouter from './auth/index';
import userRouter from './user/index';
import propertiesRouter from './properties/index';
import propertyRouter from './property/index';
import statesRouter from './state/index';

const router = Router({
  mergeParams: true,
});

router.use('/auth', authRouter);
router.use('/user/:userId(\\d{1,})', userRouter);
router.use('/properties', propertiesRouter);
router.use('/property', propertyRouter);
router.use('/states', statesRouter);

export default router;
