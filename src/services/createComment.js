export const createComment = (cid, commentID, commentContent) => ({
  cid: cid ? cid : 0,
  id: commentID ? commentID : 0,
  description: commentContent,
});
export const createCommentByItem = (item) => ({
  NoteID: item.id,
  Description: item.description,
});
