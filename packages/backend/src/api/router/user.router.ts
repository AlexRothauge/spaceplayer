import { Router } from 'express';
import { getAllUsers, getUser, loginUser, patchUser, registerUser } from '../controller/user.controller';
import { Authentication } from '../middleware/authentication';

export const userRouter = Router({ mergeParams: true });

userRouter.get('/', Authentication.verifyAccess, getUser);
userRouter.patch('/', Authentication.verifyAccess, patchUser);
userRouter.post('/', registerUser);
userRouter.post('/token', loginUser);
userRouter.get('/users', Authentication.verifyAccess, getAllUsers);
