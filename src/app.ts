import express, { Application } from 'express';
import { postRouter } from './modules/post/post.routes';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import cors from 'cors'
import { CommentRouter } from './modules/comment/comment.routes';
import globalErrorHandler from './middleware/globalErrorHandler';
import { notFound } from './middleware/notFound';
const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use('/posts', postRouter);

app.use('/comments', CommentRouter);

app.get('/', (req, res)=>{
    res.send('Hello World!');
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;