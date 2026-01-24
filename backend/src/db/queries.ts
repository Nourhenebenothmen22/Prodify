import { eq } from "drizzle-orm"; // 'eq' is used to build equality conditions for queries
import { db } from "./index"; // Import the database instance
import {
  users,
  products,
  comments,
  newUser,
  newProduct,
  newComment,
} from "./schema"; // Import tables and TypeScript types

/* ---------------------- USERS CRUD ---------------------- */

// Create a new user
export const createUser = async (user: newUser) => {
  const [insertedUser] = await db.insert(users).values(user).returning();
  return insertedUser;
};

// Get a user by their ID
export const getUserById = async (id: string) => {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
};

// Update a user
export const updateUser = async (id: string, data: Partial<newUser>) => {
  const existingUser = await getUserById(id);
  if (!existingUser) throw new Error(`User with id ${id} not found`);
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

// Delete a user
export const deleteUser = async (id: string) => {
  const existingUser = await getUserById(id);
  if (!existingUser) throw new Error(`User with id ${id} not found`);
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();
  return deletedUser;
};

/* ---------------------- PRODUCTS CRUD ---------------------- */

// Create a new product
export const createProduct = async (product: newProduct) => {
  const [insertedProduct] = await db.insert(products).values(product).returning();
  return insertedProduct;
};

// Get a product by its ID
export const getProductById = async (id: string) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { 
      user: true, 
      comments: { with: { user: true } } 
    },
  });
};

// Get all products of a specific user
export const getProductByUserId = async (userId: string) => {
  return await db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (product, { desc }) => [desc(product.createdAt)],
  });
};

// Get all products
export const getAllProducts = async () => {
  return await db.query.products.findMany({
    with: { user: true },
    orderBy: (product, { desc }) => [desc(product.createdAt)],
  });
};

// Update a product
export const updateProduct = async (id: string, data: Partial<newProduct>) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) throw new Error(`Product with id ${id} not found`);
  const [updatedProduct] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return updatedProduct;
};

// Delete a product
export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);
  if (!existingProduct) throw new Error(`Product with id ${id} not found`);
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return deletedProduct;
};

/* ---------------------- COMMENTS CRUD ---------------------- */

// Create a new comment
export const createComment = async (comment: newComment) => {
  const [insertedComment] = await db.insert(comments).values(comment).returning();
  return insertedComment;
};

// Get a comment by its ID
export const getCommentById = async (id: string) => {
  return await db.query.comments.findFirst({ where: eq(comments.id, id) });
};

// Get all comments for a specific product
export const getCommentsByProductId = async (productId: string) => {
  return await db.query.comments.findMany({ where: eq(comments.productId, productId) });
};

// Update a comment
export const updateComment = async (id: string, data: Partial<newComment>) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) throw new Error(`Comment with id ${id} not found`);
  const [updatedComment] = await db
    .update(comments)
    .set(data)
    .where(eq(comments.id, id))
    .returning();
  return updatedComment;
};

// Delete a comment
export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);
  if (!existingComment) throw new Error(`Comment with id ${id} not found`);
  const [deletedComment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return deletedComment;
};
