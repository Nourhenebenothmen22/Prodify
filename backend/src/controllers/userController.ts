import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import * as queries from '../db/queries'
export async function syncUser(req:Request,res:Response) {
    try {
        const {userId} = getAuth(req);
        if(!userId) {
            return res.status(401).json({error: 'Unauthorized'});
        }
        const {name,email, imageUrl} = req.body
        if(!name || !email || !imageUrl) {
            return res.status(400).json({error: 'Missing required fields'});
        }
        const user = await queries.getUserById(userId);
        if(user) {
            // Update existing user
            const updatedUser = await queries.updateUser(userId, { name, email, imageUrl });
            return  res.status(200).json(updatedUser);
        } else {
            // Create new user
            const newUser = await queries.createUser({ id: userId, name, email, imageUrl });
            return res.status(201).json(newUser);
        }

       
    } catch (error) {
        console.error('Error syncing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
}