import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async(req: Request, res: Response)=>{
    // res.send('create a new post');
    // console.log({req, res})

    try {
        const result = await PostService.createPost(req.body);
        res.status(201).json(result);
        
    } catch (error) {
        res.status(400).json({
            error: "Post creation failed",
            details: error
        })
        
    }
};

export const PostController = {
    createPost
}