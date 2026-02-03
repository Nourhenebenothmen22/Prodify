import { Router } from "express";
const router= Router();
import { getAllProducts, getMyProducts, getProductById,deleteProduct,updateProduct,createProduct} from "../controllers/productController";
import { requireAuth } from "@clerk/express";

router.get('/', getAllProducts);
router.get('/my-products',requireAuth(), getMyProducts);
router.get('/:id', getProductById);
router.post('/',requireAuth(),createProduct);
router.put('/:id',requireAuth(),updateProduct);
router.delete('/:id',requireAuth(), deleteProduct);
export default router;