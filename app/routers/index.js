// Router principal
import { Router } from 'express';

import listRouter from './list.router.js';
import cardRouter from './card.router.js';
import tagRouter from './tag.router.js';
import userRouter from './user.router.js';
import projectRouter from './project.router.js';
import messageRouter from './message.router.js';
import errorMiddleware from '../middlewares/error.middleware.js';
import authMiddleware from '../middlewares/authentification.middleware.js';
import ApiError from '../errors/api.error.js';


const router = Router();
router.use('/api/users', userRouter);
router.use(authMiddleware);
router.use('/api/lists', listRouter);
router.use('/api/cards', cardRouter);
router.use('/api/tags', tagRouter);
router.use('/api/projects', projectRouter);
router.use('/api/messages', messageRouter);
// Middleware 404 (API)
router.use((req, res, next) => {
  next(new ApiError(404, 'Ressource not found'));
});
router.use(errorMiddleware);

export default router;
