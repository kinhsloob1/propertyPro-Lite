import { Router } from 'express';

const router = Router({
  mergeParams: true,
});

router.get('/', (req, res) => res.render('index'));
router.get('/auth/signup', (req, res) => res.render('register'));
router.get('/auth/signin', (req, res) => res.render('login'));
router.get('/auth/password-reset', (req, res) => res.render('forgotPassword'));
router.get('/property/:propertyId([0-9]{1,})/edit', (req, res) => res.render('editProperty'));
router.get('/property/:propertyId([0-9]{1,})/', (req, res) => res.render('property'));
router.get('/property/add', (req, res) => res.render('addProperty'));
router.get('/properties', (req, res) => res.render('properties'));
export default router;
