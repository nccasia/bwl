import { maxPosts } from '../util/maxPosts';

const initState = {
  posts: [],
  hotPosts: [],
  author: [],
  background: false,
  notification: [],
  page: 1,
  runPosts: [],
  pageNotification: 1,
  lengthNotication:0,
  size: 5,
  loadingNotifi: false,
  loadingPost: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_POSTS':
      const commentList = action.payload?.map(main => {
        return {
          ...main, 
          ...{
            comments: [], 
            onLike: false,
          }}
      })
      return {
        ...state,
        posts: state.runPosts?.length > 0 ?  state.runPosts : [...state.posts,...commentList],
        hotPosts: state.runPosts?.length > 0 ?  maxPosts(state.runPosts) : maxPosts([...state.posts,...commentList]),
        runPosts: [],
        loadingPost: false,
      };
    case 'CHANGE_LOADING_POST':
      return {
        ...state,
        loadingPost: true,
      };
    case 'SET_POST_ONE':
      const commentListOne = action.payload?.map(main => {
        return {
          ...main, 
          ...{
            comments: [], 
            onLike: false,
          }}
      })
      return {
        ...state,
        posts: commentListOne,
        runPosts: state.posts,
      };
    case 'SET_AUTHOR':
      const authorList = state.posts?.map(main => {
        const authorTest = main?.likes?.filter(item => item?.authorId === action.payload?.id)
        if(authorTest?.length >0) {
          return {
            ...main, 
            ...{
                onLike: true,
              }
            }
        } else {
          return {
            ...main, 
            ...{
              onLike: false,
            }}
        }
      })
      return {
        ...state,
        author: action.payload,
        posts: authorList,
      };
    case 'CHANGE_BACKGROUND':
      return {
        ...state,
        background: !state.background,
      };
    case 'CHANGE_LOADING_NOTIFICATION':
      return {
        ...state,
        loadingNotifi: true,
      };
    case 'SET_LENGTH_NOTIFICATION':
      return {
        ...state,
        lengthNotication: action.payload,
      };
    case 'CHANGE_NOTIFICATION_ALL':
      return {
        ...state,
        notification: [...state.notification, ...action.payload],
        loadingNotifi: false,
      };
    case 'CHANGE_LIKE':
      const listLike = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            onLike: !main?.onLike,
            totalLike: action.payload?.like ? Number(main.totalLike) + 1 : Number(main.totalLike) - 1
          }
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listLike,
      };
    case 'CHANGE_PAGE':
      return {
        ...state,
        page: state.page + 1,
      };
    case 'CHANGE_PAGE_NOTIFICATION':
      const numberNotifi = Math.ceil(state.lengthNotication / state.size);
      return {
        ...state,
        pageNotification: numberNotifi > state.pageNotification && state.pageNotification >0 ? state.pageNotification + 1 : -1,
      };
    case 'SET_COMMENTS':
      const listComment = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            comments: action.payload.comments,
          }
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listComment,
      };
    case 'ADD_COMMENTS':
      const addComment = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            totalComment: main?.totalComment +1, 
            comments: [...main.comments, ...([action.payload.comments])],
          }
        } else {
          return main;
        }
      })
      return {
        ...state,
        posts: addComment,
      };
    case 'DELETE_COMMENT':
      const deleteComment = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          return {
            ...main,
            totalComment: main?.totalComment -1, 
            comments: main?.comments?.filter(item => item?._id !==action.payload?.id),
          }
        } else {
          return main;
        }
      })
      return {
        ...state,
        posts: deleteComment,
      };
    case 'EDIT_COMMENT':
      const editComment = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          const editcomment1 =main?.comments?.map(item => {
            if(item._id === action.payload?.id) {
              return {...item, content:action.payload?.input}
            } else {
              return item;
            }
          });
          return {
            ...main,
            comments: editcomment1,
          }
        } else {
          return main;
        }
      })
      return {
        ...state,
        posts: editComment,
      };
    default:
      throw new Error('Error');
  }
}
export { initState };
export default reducer;
