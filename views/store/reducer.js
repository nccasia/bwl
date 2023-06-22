/* eslint-disable prettier/prettier */
import {updateSize} from "../util/updateSize";

const initState = {
  posts: [],
  hotPosts: [],
  author: [],
  background: false,
  notification: [],
  page: 1,
  pageNotification: 1,
  lengthNotication: 0,
  sizeNotifi: 0,
  size: 5,
  loadingNotifi: false,
  loadingPost: false,
  loadingHotPost: false,
  lengthPosts: 0,
  changePage: false,
  onEdit: false,
  onMenu: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SSE':
      const ssePosts = state.posts.map((main) => {
        if (action.payload?.like) {
          if (main.messageId === action.payload?.messageId) {
            return {
              ...main,
              totalLike:
                action.payload?.like === 'true'
                  ? main.totalLike + 1
                  : main.totalLike - 1,
              likes:
                action.payload?.authorNotifi2 === state.author?.id
                  ? action.payload?.like === 'true'
                    ? true
                    : false
                  : main.likes,
            };
          } else {
            return main;
          }
        } else {
          if (action.payload?.comment) {
            if (main.messageId === action.payload?.messageId) {
              return {
                ...main,
                totalComment:
                  action.payload?.comment === 'add'
                    ? main.totalComment + 1
                    : action.payload?.comment === 'delete'
                    ? main.totalComment - 1
                    : main.totalComment,
                comments:
                  action.payload?.comment === 'add'
                    ? [...[action.payload], ...main?.comments]
                    : action.payload?.comment === 'delete'
                    ? main?.comments?.filter(
                        (item) => item?._id !== action.payload?.id,
                      )
                    : action.payload?.comment === 'edit'
                    ? main?.comments.map((item) => {
                        if (item._id === action.payload?.id) {
                          return {
                            ...item,
                            content: action.payload?.input,
                            onEdit: action.payload?.onEdit,
                            createdTimestamp: action.payload?.createdTimestamp,
                          };
                        } else {
                          return item;
                        }
                      })
                    : main?.comments,
              };
            } else {
              return main;
            }
          } else {
            if (action.payload?.posts ==="edit") {
              if (main._id === action.payload?.id) {
                return {
                  ...main,
                  links: [action.payload?.link],
                };
              } else {
                return main;
              }
            } else {
              return main;
            }
          }
        }
      });
      return {
        ...state,
        posts: action.payload?.posts ==="add" ? 
                [...action.payload?.list.map((main) => {
                    return {
                      ...main,
                      ...{
                        comments: [],
                        pageComment: 1,
                      }
                    }
                  }),
                  ...state.posts
                ] 
              : 
                action.payload?.posts ==="delete" ? 
                state.posts.filter(item => item?._id !== action.payload?.id)
              :
                ssePosts,
        sizeNotifi: action.payload?.authorNotifi === state.author?.id && action.payload?.authorNotifi2 !== state.author?.id  ? state.sizeNotifi + 1 : state.sizeNotifi,
        notification: action.payload?.authorNotifi === state.author?.id && action.payload?.authorNotifi2 !== state.author?.id  ? [...[action.payload?.notification], ...state.notification] : state.notification,
        hotPosts: action.payload?.posts ==="delete" ? 
                    state.hotPosts.filter(item => item?._id !== action.payload?.id) 
                  : 
                    state.hotPosts?.length <10 && action.payload?.posts ==="add" ?
                    [...state.hotPosts, ...action.payload?.list] 
                  :
                    state.hotPosts,
      };
    case 'SET_POSTS':
      const commentList = action.payload?.posts.map((main) => {
        return {
          ...main,
          ...{
            comments: [],
            pageComment: 1,
          }
        }
      })
      return {
        ...state,
        posts: state.changePage
          ? commentList
          : [...state.posts, ...commentList],
        loadingPost: false,
        lengthPosts: action.payload?.size,
      };
    case 'SET_POSTS_PAGE':
      return {
        ...state,
        changePage: action.payload,
        posts: [],
        page: action.payload? -1 : 1,
      };
    case 'CHANGE_LOADING_POST':
      return {
        ...state,
        loadingPost: action.payload,
      };
    case 'SET_POST_ONE':
      const commentListOne = action.payload?.map((main) => {
        return {
          ...main,
          ...{ comments: [] },
        };
      });
      return {
        ...state,
        posts: commentListOne,
        page: 1,
        loadingPost: false,
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
        loadingHotPost: action.payload,
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
    case 'SET_SIZE_NOTIFICATION':
      return {
        ...state,
        sizeNotifi: action.payload,
      };
    case 'CHANGE_LOADING_NOTIFICATION':
      return {
        ...state,
        loadingNotifi: action.payload,
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
        sizeNotifi: 0,
      };
    case 'CHANGE_PAGE':
      const numberPosts = Math.ceil(state.lengthPosts / 5);
      const count = updateSize(action.payload, state.posts?.length);
      return {
        ...state,
        loadingPost:
          numberPosts > action.payload && action.payload > 0 && state.page > 0 ? true : false,
        page: numberPosts > count?.page && count?.page > 0 && state.page > 0 ? count?.page : -1,
        size: count?.size,
      };
    case 'CHANGE_PAGE_NOTIFICATION':
      const numberNotifi = Math.ceil(state.lengthNotication / state.size);
      return {
        ...state,
        loadingNotifi:
          numberNotifi > action.payload && action.payload > 0 && state.pageNotification > 0 ? true : false,
        pageNotification:
          numberNotifi > action.payload && action.payload > 0 && state.pageNotification > 0
            ? 
              action.payload === state.pageNotification+ 1 ? 
              action.payload
              : state.pageNotification
            : -1,
      };
    case 'SET_COMMENTS':
      const listComment = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            comments: action.payload?.comments,
            pageComment: 1,
          }
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listComment,
      };
    case 'SET_COMMENTS_PAGE':
      const listCommentPage = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            comments: [...main.comments,...action.payload.comments],
            pageComment: main.pageComment + 1,
          }
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listCommentPage,
      };
    case 'CHANGE_MENU':
      return {
        ...state,
        onMenu: action.payload,
      };
    default:
      throw new Error('Error');
  }
}
export { initState };
export default reducer;
