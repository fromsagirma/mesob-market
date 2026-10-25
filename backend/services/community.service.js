import CommunityPost from '../models/communityPost.model.js';
import User from '../models/user.model.js';

/**
 * Community service managing post interactions, reactions,
 * threaded comments, and content moderation.
 */

export const BAN_REPORT_THRESHOLD = 5;

export const togglePostLike = async (postId, userId) => {
  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error('Post not found');

  const userIdStr = String(userId);
  const index = post.likes.findIndex((id) => String(id) === userIdStr);

  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  await post.save();
  return post;
};

export const recordPostRepost = async (postId, userId) => {
  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error('Post not found');

  const userIdStr = String(userId);
  const alreadyReposted = post.reposts.some((id) => String(id) === userIdStr);

  if (!alreadyReposted) {
    post.reposts.push(userId);
    await post.save();
  }

  return post;
};

export const addPostComment = async (postId, userId, content) => {
  if (!content || typeof content !== 'string' || !content.trim()) {
    throw new Error('Comment content cannot be empty');
  }

  const post = await CommunityPost.findById(postId);
  if (!post) throw new Error('Post not found');

  post.comments.push({
    user: userId,
    content: content.trim()
  });

  await post.save();

  return CommunityPost.findById(postId)
    .populate('user', 'name email profilePic')
    .populate('comments.user', 'name profilePic');
};

export const processPostReport = async (postId, reportingUserId) => {
  const post = await CommunityPost.findById(postId).populate('user');
  if (!post) throw new Error('Post not found');

  const reporterIdStr = String(reportingUserId);
  const alreadyReported = post.reports.some((id) => String(id) === reporterIdStr);

  if (alreadyReported) {
    const error = new Error('You have already reported this post');
    error.statusCode = 400;
    throw error;
  }

  post.reports.push(reportingUserId);
  await post.save();

  if (post.user?._id) {
    const targetUser = await User.findById(post.user._id);
    if (targetUser) {
      targetUser.reportCount = (targetUser.reportCount || 0) + 1;
      if (targetUser.reportCount >= BAN_REPORT_THRESHOLD) {
        targetUser.isBanned = true;
      }
      await targetUser.save();
    }
  }

  return { post, reported: true };
};

export default {
  BAN_REPORT_THRESHOLD,
  togglePostLike,
  recordPostRepost,
  addPostComment,
  processPostReport
};
