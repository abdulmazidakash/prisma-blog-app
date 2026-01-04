import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    // res.send('create a new post');
    // console.log({req, res})

    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized",
            })
        }
        console.log(req.user)
        const result = await PostService.createPost(req.body, user?.id as string);
        res.status(201).json(result);

    } catch (error) {
        res.status(400).json({
            error: "Post creation failed",
            details: error
        })

    }
};

const getAllPost = async(req: Request, res: Response)=>{
    try {
        const result = await PostService.getAllPost();
        res.status(200).json(result);
        
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch posts",
            details: error
        })
    }
}

export const PostController = {
    createPost,
    getAllPost,
}