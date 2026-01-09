import express, { Router } from 'express'
import { PostController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth';


const router = express.Router();

router.get('/', PostController.getAllPost);

router.get('/stats', auth(UserRole.ADMIN, UserRole.USER), PostController.getStats)

router.get('/:postId', PostController.getPostById);

router.get('/my-posts', auth(UserRole.ADMIN, UserRole.USER), PostController.getMyPosts);

router.post('/', auth(UserRole.USER, UserRole.ADMIN), PostController.createPost);

router.patch('/:postId', auth(UserRole.ADMIN, UserRole.USER), PostController.updatePost);

router.delete('/:postId', auth(UserRole.ADMIN, UserRole.USER), PostController.deletePost)

export const postRouter: Router = router;