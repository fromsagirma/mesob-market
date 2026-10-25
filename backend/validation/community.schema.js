import mongoose from 'mongoose';

/**
 * Request validation schemas for community forum interactions.
 */

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value) || 'Invalid post ID format';

export const createPostSchema = {
  body: {
    title: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 150
    },
    content: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 4000
    },
    type: {
      type: 'string',
      enum: ['general', 'question', 'review', 'announcement']
    }
  }
};

export const commentPostSchema = {
  body: {
    content: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 1500
    }
  },
  params: {
    id: {
      type: 'string',
      required: true,
      custom: isValidObjectId
    }
  }
};

export const postIdParamSchema = {
  params: {
    id: {
      type: 'string',
      required: true,
      custom: isValidObjectId
    }
  }
};

export default {
  createPostSchema,
  commentPostSchema,
  postIdParamSchema
};
