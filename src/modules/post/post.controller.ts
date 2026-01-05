import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        // console.log('Search Value: ', search);

        const searchString = typeof search === 'string' ? search : undefined;

        const tags = req.query.tags ? (req.query.tags as string).split(',') : [];

        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined;

        console.log(isFeatured)
        const status = req.query.status as PostStatus | undefined;

        const authorId = req.query.authorId as string | undefined;

        // const page = Number(req.query.page ?? 1);
        // const limit = Number(req.query.limit ?? 10);

        // const skip = (page - 1) * limit;

        // const sortBy = req.query.sortBy as string | undefined;
        // const sortOrder = req.query.sortOrder as string | undefined;

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        // console.log('Pagination and Sorting Options: ', options);

        const result = await PostService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch posts",
            details: error
        })
    }
}


const getPostById = async(req: Request, res: Response)=>{
    try {
        const { postId } = req.params;
        console.log(postId)

        if(!postId){
            throw new Error('Post Id is required!');
        };

        const result = await PostService.getPostById(postId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch post by ID",
            details: error,
        })
    }
};


export const PostController = {
    createPost,
    getAllPost,
    getPostById,
}