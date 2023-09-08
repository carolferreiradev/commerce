import { Router } from 'express';
import multer from 'multer';
import { productsController } from '../products/controllers/Products';

const router = Router();
const upload = multer();

router.get('/products', productsController.listProducts);

router.post('/products/file/upload-validation', upload.single('updatePrice'), productsController.validationFileUploadPrice);

router.post('/products/prices/update-many', productsController.pricesUpdateMany);

export const routerFiles = router;
