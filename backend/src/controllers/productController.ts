import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import * as queries from '../db/queries';

/**
 * Controller: Get all products
 * Description: Fetches all products from the database
 */
export async function getAllProducts(req: Request, res: Response) {
  try {
    // Fetch all products from database
    const products = await queries.getAllProducts();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error while fetching products:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving products',
    });
  }
}
export async function getProductById(req:Request,res:Response) {
    try {
        const id = req.params.id as string;
        const product=await queries.getProductById(id)
        if(!product) {
            return res.status(404).json({
                success:false,
                message:'Product not found'
            })
        }
        res.status(200).json({
            success:true,
            message:'Product retrieved successfully',
            data:product
        })
        
    } catch (error) {
        console.error('Error while fetching product:', error);
        res.status(500).json({
            success:false,
            message:'An error occurred while retrieving product'
        })
        
    }
    
}
export  async function getMyProducts(req:Request,res:Response) {
    try {
        const {userId} = getAuth(req)
        if(!userId) {
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            })
        }
        const products=await queries.getProductByUserId(userId)
        if(!products){
            return res.status(404).json({
                success:false,
                message:'Product not found'
            })
        }
        res.status(200).json({
            success:true,
            message:'Product retrieved successfully',
            data:products
        })
        
    } catch (error) {
        console.error('Error while fetching product:', error);
        res.status(500).json({
            success:false,
            message:'An error occurred while retrieving product'
        })
        
    }
    
}
export async function createProduct(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newProduct = await queries.createProduct({
      userId,
      title,
      description,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
export async function updateProduct(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const id = req.params.id as string;
    const { title, description, imageUrl } = req.body;

    const existingProduct = await queries.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to update this product',
      });
    }

    const updatedProduct = await queries.updateProduct(id, { title, description, imageUrl });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating product',
      error: error.message,
    });
  }
}
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const id = req.params.id as string;

    const existingProduct = await queries.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this product',
      });
    }

    const deletedProduct = await queries.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the product',
      error: error.message,
    });
  }
}
