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
router.use('/users', userRouter);
router.use(authMiddleware);
router.use('/lists', listRouter);
router.use('/cards', cardRouter);
router.use('/tags', tagRouter);
router.use('/projects', projectRouter);
router.use('/messages', messageRouter);

// Middleware 404 (API)
router.use((req, res, next) => {
  next(new ApiError(404, 'Ressource not found'));
});
router.use(errorMiddleware);

export default router;
