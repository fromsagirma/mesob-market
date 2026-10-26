import express from "express";
import { 
    createPost, 
    getPosts, 
    likePost, 
    repostPost, 
    commentPost, 
    reportPost 
} from "../controllers/communityPost.controller.js";
import { authenticate } from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
    createPostSchema,
    commentPostSchema,
    postIdParamSchema
} from "../validation/community.schema.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", authenticate, validate(createPostSchema), createPost);
router.post("/:id/like", authenticate, validate(postIdParamSchema), likePost);
router.post("/:id/repost", authenticate, validate(postIdParamSchema), repostPost);
router.post("/:id/comment", authenticate, validate(commentPostSchema), commentPost);
router.post("/:id/report", authenticate, validate(postIdParamSchema), reportPost);

export default router;
