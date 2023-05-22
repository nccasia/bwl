import {maxPosts} from '../util/maxPosts';

const initState={
  posts:[],
  hotPosts: [],
  author:[],
  background: false,
  notification:[],
  page: 1,
  runPosts: [],
}

function reducer(state, action){ 
  switch(action.type){
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
        hotPosts: state.runPosts?.length > 0 ?  maxPosts(state.runPosts) : maxPosts([...state.posts,...action.payload]),
        runPosts: [],
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
    case 'CHANGE_NOTIFICATION':
      return {
        ...state,
        notification: action.payload,
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
      })
      return {
        ...state,
        posts: listLike,
      };
    case 'CHANGE_PAGE':
      return {
        ...state,
        page: state.page + 1,
      };
    case 'SET_COMMENTS':
      const listComment = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          return {
            ...main, 
            comments: action.payload.comments,
          }
        } else {
          return main;
        }
      })
      return {
        ...state,
        posts: listComment,
      };
    case 'ADD_COMMENTS':
      const addComment = state.posts.map(main =>{
        if(main.messageId === action.payload?.messageId) {
          return {
            ...main, 
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
    default:
      throw new Error("Error");
  }
}
export {initState}
export default reducer;