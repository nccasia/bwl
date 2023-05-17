import { maxPosts } from '../util/maxPosts';

const initState = {
  posts: [],
  hotPosts: [],
  author: [],
  background: false,
  notification: [],
  page: 1,
  comments: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_POSTS':
      const commentList = action.payload?.map((main) => {
        return { ...main, ...{ onComment: false } };
      });
      return {
        ...state,
        posts: [...state.posts, ...commentList],
        hotPosts: maxPosts([...state.posts, ...action.payload]),
      };
    case 'SET_AUTHOR':
      return {
        ...state,
        author: action.payload,
      };
    case 'CHANGE_BACKGROUND':
      return {
        ...state,
        background: !state.background,
      };
    case 'CHANGE_NOTIFICATION':
      return {
        ...state,
        notification: action.payload,
      };
    case 'CHANGE_LIKE':
      const list = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          return {
            ...main,
            totalLike: action.payload?.like
              ? Number(main.totalLike) + 1
              : Number(main.totalLike) - 1,
          };
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: list,
      };
    case 'CHANGE_PAGE':
      return {
        ...state,
        page: state.page + 1,
      };
    case 'SET_COMMENTS':
      const listComment = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          return {
            ...main,
            onComment: true,
          };
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listComment,
        comments: action.payload.comments,
      };
    case 'DELETE_COMMENT':
      const { messageId, index } = action.payload;
      const newPosts = state.posts.map((post) => {
        if (post.messageId === messageId) {
          const newComments = post.comments.filter(
            (comment) => comment.index !== index,
          );
          return { ...post, comments: newComments };
        } else {
          return post;
        }
      });
      return { ...state, posts: newPosts };
    default:
      throw new Error('Error');
  }
}
export { initState };
export default reducer;
