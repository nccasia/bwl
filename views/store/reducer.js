/* eslint-disable prettier/prettier */

const initState = {
  posts: [],
  hotPosts: [],
  author: [],
  background: false,
  notification: [],
  page: 1,
  pageNotification: 1,
  lengthNotication:0,
  sizeNotifi: 0,
  size: 5,
  loadingNotifi: false,
  loadingPost: false,
  loadingHotPost: false,
  lengthPosts: 0,
  changePage: false,
  onEdit: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SSE':
        const ssePosts = state.posts.map(main =>{
          if(action.payload?.like){
            if(main.messageId === action.payload?.messageId) {
              return {
                ...main, 
                totalLike: action.payload?.like === "true" ? main.totalLike + 1 : main.totalLike -1,
              }
            } else {
              return main;
            }
          } else{
            if(action.payload?.comment){
              if(main.messageId === action.payload?.messageId) {
                return {
                  ...main, 
                  totalComment: action.payload?.comment === "add" 
                                ? 
                                  main.totalComment + 1 
                                : 
                                  action.payload?.comment === "delete" 
                                ?  
                                  main.totalComment - 1
                                :
                                  main.totalComment,
                  comments: action.payload?.comment === "add" 
                            ? 
                              [...[action.payload], ...main?.comments] 
                            : 
                              action.payload?.comment === "delete" 
                            ?                              
                              main?.comments?.filter(item => item?._id !==action.payload?.id)
                            : 
                              action.payload?.comment === "edit" 
                            ? 
                              main?.comments.map(item => {
                                if(item._id === action.payload?.id) {
                                  return {...item, content:action.payload?.input, onEdit: true}
                                } else {
                                  return item;
                                }
                              })
                            :
                              main?.comments,
                }
              } else {
                return main;
              }
            } else{
              return main;
            }
          }
        });
      return {
        ...state,
        posts: ssePosts,
        sizeNotifi: action.payload?.authorNotifi === state.author?.id  ? state.sizeNotifi + 1 : state.sizeNotifi,
      };
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
        page: 1,
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
    case 'SET_SIZE_NOTIFICATION':
      return {
        ...state,
        sizeNotifi: action.payload,
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
        sizeNotifi: 0,
      };
    case 'CHANGE_LIKE':
      const listLike = state.posts.map(main =>{
        if(main.messageId === action.payload) {
          return {
            ...main, 
            likes: !main?.likes,
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
        loadingPost: numberPosts > action.payload && action.payload >0 ? true : false,
        page: numberPosts > action.payload && action.payload >0 ? action.payload + 1 : -1,
      };
    case 'CHANGE_PAGE_NOTIFICATION':
      const numberNotifi = Math.ceil(state.lengthNotication / state.size);
      return {
        ...state,
        loadingNotifi: numberNotifi > action.payload && action.payload >0 ? true : false,
        pageNotification: numberNotifi > action.payload && action.payload >0 ? action.payload + 1 : -1,
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
    default:
      throw new Error('Error');
  }
}
export { initState };
export default reducer;
