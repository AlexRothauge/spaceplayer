import { Router, Request, Response } from 'express';
import { userRouter } from './user.router';
export const globalRouter = Router({ mergeParams: true });

globalRouter.get('/', async (_: Request, res: Response) => {
  res.send({ message: 'Hello Spaceplayer api' });
});

globalRouter.use('/user', userRouter);
