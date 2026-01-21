import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  users,
  products,
  comments,
  newUser,
  newProduct,
  newComment,
} from "./schema";

/* ---------------------- USERS CRUD ---------------------- */

// Create User
export const createUser = async (user: newUser) => {
  const [insertedUser] = await db.insert(users).values(user).returning();
  return insertedUser;
};

// Read User by ID
export const getUserById = async (id: string) => {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
};

// Update User
export const updateUser = async (id: string, data: Partial<newUser>) => {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

// Delete User
export const deleteUser = async (id: string) => {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();
  return deletedUser;
};

/* ---------------------- PRODUCTS CRUD ---------------------- */

// Create Product
export const createProduct = async (product: newProduct) => {
  const [insertedProduct] = await db.insert(products).values(product).returning();
  return insertedProduct;
};

// Read Product by ID
export const getProductById = async (id: string) => {
  return await db.query.products.findFirst({ where: eq(products.id, id) });
};

// Read All Products
export const getAllProducts = async () => {
  return await db.query.products.findMany();
};

// Update Product
export const updateProduct = async (id: string, data: Partial<newProduct>) => {
  const [updatedProduct] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return updatedProduct;
};

// Delete Product
export const deleteProduct = async (id: string) => {
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return deletedProduct;
};

/* ---------------------- COMMENTS CRUD ---------------------- */

// Create Comment
export const createComment = async (comment: newComment) => {
  const [insertedComment] = await db.insert(comments).values(comment).returning();
  return insertedComment;
};

// Read Comment by ID
export const getCommentById = async (id: string) => {
  return await db.query.comments.findFirst({ where: eq(comments.id, id) });
};

// Read All Comments for a Product
export const getCommentsByProductId = async (productId: string) => {
  return await db.query.comments.findMany({ where: eq(comments.productId, productId) });
};

// Update Comment
export const updateComment = async (id: string, data: Partial<newComment>) => {
  const [updatedComment] = await db
    .update(comments)
    .set(data)
    .where(eq(comments.id, id))
    .returning();
  return updatedComment;
};

// Delete Comment
export const deleteComment = async (id: string) => {
  const [deletedComment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return deletedComment;
};
