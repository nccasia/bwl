import { maxPosts } from '../util/maxPosts';

const initState = {
  posts: [],
  hotPosts: [],
  author: [],
  background: false,
  notification: [],
  page: 1,
  pageNotification: 1,
  lengthNotication:0,
  size: 5,
  loadingNotifi: false,
  loadingPost: false,
  loadingHotPost: false,
  lengthPosts: 0,
  changePage: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_POSTS':
      const commentList = action.payload?.posts.map(main => {
        return {
          ...main, 
          ...{
            comments: [], 
          }}
      })
      return {
        ...state,
        posts: state.changePage ? commentList : [...state.posts,...commentList],
        loadingPost: false,
        lengthPosts: action.payload?.size,
      };
      case 'SET_POSTS_NULL':
        return {
          ...state,
          posts: [],
          changePage: true,
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
          ...{ comments: []}
        }
      })
      return {
        ...state,
        posts: commentListOne,
        page: 1,
      };
    case 'SET_HOTPOSTS':
      return {
        ...state,
        hotPosts: action.payload,
        loadingHotPost: false,
      };
    case 'CHANGE_LOADING_HOTPOST':
      return {
        ...state,
        loadingHotPost: true,
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
    case 'SET_NOTIFICATION':
      return {
        ...state,
        notification: [],
        pageNotification: 1,
      };
    case 'CHANGE_LIKE':
      const listLike = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            likes: !main?.likes,
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
      const numberPosts = Math.ceil(state.lengthPosts / state.size);
      return {
        ...state,
        page: numberPosts > state.page && state.page >0 ? state.page + 1 : -1,
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
