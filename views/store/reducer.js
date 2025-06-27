/* eslint-disable prettier/prettier */
import { updateSize } from '../util/updateSize';

const initState = {
  posts: [],
  typePosts: "New",
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
  lengthPosts: 5,
  changePage: false,
  onEdit: false,
  onMenu: false,
  users: [],
  sizeUsers: 0,
  search: '',
  searchPosts: [],
  searchMessage: '',
  pageUsers: 1,
  loadingUsers: false,
  lengthUsers: 0,
  searchTime: [],
  searchUsersPosts: '',
  channel: '',
  channelList: [],
  channelsFetched: false,
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
                  ? main.totalLike
                    ? main.totalLike + 1
                    : 1
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
                    ? main.totalComment
                      ? main.totalComment + 1
                      : 1
                    : action.payload?.comment === 'addItem'
                      ? main.totalComment + 1
                      : action.payload?.comment === 'deleteItem'
                        ? main.totalComment - 1
                        : action.payload?.comment === 'delete'
                          ? main.totalComment - 1 - action.payload?.lengthItem
                          : main.totalComment,
                total:
                  action.payload?.comment === 'add'
                    ? main.total + 1
                    : action.payload?.comment === 'delete'
                      ? main.total - 1
                      : main.total,
                comments:
                  action.payload?.comment === 'add'
                    ? [
                      ...[
                        {
                          ...action.payload,
                          ...{
                            likeComment: 0,
                            dislikeComment: 0,
                            authorLike: null,
                            itemList: [],
                            length: 0,
                          },
                        },
                      ],
                      ...main?.comments,
                    ].sort(function (a, b) {
                      if (a.onPin > b.onPin) {
                        return -1;
                      } else if (a.onPin < b.onPin) {
                        return 1;
                      } else {
                        if (a._id > b._id) {
                          return -1;
                        } else if (a._id < b._id) {
                          return 1;
                        } else {
                          return 0;
                        }
                      }
                    })
                    : action.payload?.comment === 'addItem' &&
                      main?.comments?.length > 0
                      ? main?.comments?.map((item) => {
                        if (item?._id === action.payload?.item) {
                          if (item?.itemList?.length > 0) {
                            return {
                              ...item,
                              length: item?.length + 1,
                              itemList: [
                                ...[
                                  {
                                    ...action.payload,
                                    ...{
                                      likeComment: 0,
                                      dislikeComment: 0,
                                      authorLike: null,
                                    },
                                  },
                                ],
                                ...item?.itemList,
                              ].sort(function (a, b) {
                                if (a.onPin > b.onPin) {
                                  return -1;
                                } else if (a.onPin < b.onPin) {
                                  return 1;
                                } else {
                                  if (a._id > b._id) {
                                    return -1;
                                  } else if (a._id < b._id) {
                                    return 1;
                                  } else {
                                    return 0;
                                  }
                                }
                              }),
                            };
                          } else {
                            return { ...item, length: item?.length + 1 };
                          }
                        } else {
                          return item;
                        }
                      })
                      : action.payload?.comment === 'delete'
                        ? main?.comments?.filter(
                          (item) => item?._id !== action.payload?.id,
                        )
                        : action.payload?.comment === 'deleteItem'
                          ? main?.comments?.map((item) => {
                            if (item?._id === action.payload?.item) {
                              return {
                                ...item,
                                length: item?.length - 1,
                                itemList: item?.itemList?.filter(
                                  (e) => e._id !== action.payload?.id,
                                ),
                              };
                            } else {
                              return item;
                            }
                          })
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
                            : action.payload?.comment === 'editItem'
                              ? main?.comments?.map((item) => {
                                if (item?._id === action.payload?.item) {
                                  return {
                                    ...item,
                                    itemList: item?.itemList?.map((e) => {
                                      if (e?._id === action.payload?.id) {
                                        return {
                                          ...e,
                                          content: action.payload?.input,
                                          onEdit: action.payload?.onEdit,
                                          createdTimestamp:
                                            action.payload?.createdTimestamp,
                                        };
                                      } else {
                                        return e;
                                      }
                                    }),
                                  };
                                } else {
                                  return item;
                                }
                              })
                              : action.payload?.comment === 'commentLike'
                                ? main?.comments?.map((item) => {
                                  if (item?._id === action.payload?.commentId) {
                                    return {
                                      ...item,
                                      likeComment:
                                        action.payload?.onLikeComment === true
                                          ? item?.likeComment + 1
                                          : action.payload?.onLikeComment === false &&
                                            action.payload?.test
                                            ? item?.likeComment - 1
                                            : action.payload?.onLikeComment === null &&
                                              item?.authorLike === true
                                              ? item?.likeComment - 1
                                              : item?.likeComment,
                                      dislikeComment:
                                        action.payload?.onLikeComment === false
                                          ? item?.dislikeComment + 1
                                          : action.payload?.onLikeComment === true &&
                                            action.payload?.test
                                            ? item?.dislikeComment - 1
                                            : action.payload?.onLikeComment === null &&
                                              item?.authorLike === false
                                              ? item?.dislikeComment - 1
                                              : item?.dislikeComment,
                                      authorLike: action.payload?.onLikeComment,
                                    };
                                  } else {
                                    return item;
                                  }
                                })
                                : action.payload?.comment === 'commentLikeItem'
                                  ? main?.comments?.map((item) => {
                                    if (item?._id === action.payload?.item) {
                                      return {
                                        ...item,
                                        itemList: item?.itemList?.map((e) => {
                                          if (e?._id === action.payload?.commentId) {
                                            return {
                                              ...e,
                                              likeComment:
                                                action.payload?.onLikeComment === true
                                                  ? e?.likeComment + 1
                                                  : action.payload?.onLikeComment ===
                                                    false && action.payload?.test
                                                    ? e?.likeComment - 1
                                                    : action.payload?.onLikeComment ===
                                                      null && e?.authorLike === true
                                                      ? e?.likeComment - 1
                                                      : e?.likeComment,
                                              dislikeComment:
                                                action.payload?.onLikeComment === false
                                                  ? e?.dislikeComment + 1
                                                  : action.payload?.onLikeComment ===
                                                    true && action.payload?.test
                                                    ? e?.dislikeComment - 1
                                                    : action.payload?.onLikeComment ===
                                                      null && e?.authorLike === false
                                                      ? e?.dislikeComment - 1
                                                      : e?.dislikeComment,
                                              authorLike: action.payload?.onLikeComment,
                                            };
                                          } else {
                                            return e;
                                          }
                                        }),
                                      };
                                    } else {
                                      return item;
                                    }
                                  })
                                  : action.payload?.comment === 'pinComment'
                                    ? main?.comments
                                      .map((item) => {
                                        if (item._id === action.payload?.id) {
                                          return { ...item, onPin: action.payload?.onPin };
                                        } else {
                                          return item;
                                        }
                                      })
                                      .sort(function (a, b) {
                                        if (a.onPin > b.onPin) {
                                          return -1;
                                        } else if (a.onPin < b.onPin) {
                                          return 1;
                                        } else {
                                          if (a._id > b._id) {
                                            return -1;
                                          } else if (a._id < b._id) {
                                            return 1;
                                          } else {
                                            return 0;
                                          }
                                        }
                                      })
                                    : action.payload?.comment === 'pinCommentItem'
                                      ? main?.comments.map((item) => {
                                        if (item._id === action.payload?.item) {
                                          return {
                                            ...item,
                                            itemList: item?.itemList
                                              .map((e) => {
                                                if (e._id === action.payload?.id) {
                                                  return { ...e, onPin: action.payload?.onPin };
                                                } else {
                                                  return e;
                                                }
                                              })
                                              .sort(function (a, b) {
                                                if (a.onPin > b.onPin) {
                                                  return -1;
                                                } else if (a.onPin < b.onPin) {
                                                  return 1;
                                                } else {
                                                  if (a._id > b._id) {
                                                    return -1;
                                                  } else if (a._id < b._id) {
                                                    return 1;
                                                  } else {
                                                    return 0;
                                                  }
                                                }
                                              }),
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
            if (action.payload?.posts === 'edit') {
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
      const sseChannelList = state.channelList?.map((item) => {
        if (action.payload?.posts) {
          if (action.payload?.posts === 'add') {
            return {
              ...item,
              total:
                item?.total +
                action.payload?.list?.filter(
                  (main) => main?.channelId === item?.id,
                )?.length,
            };
          }
          if (action.payload?.posts === 'delete') {
            return {
              ...item,
              total:
                item?.id === action.payload?.channelId
                  ? item?.total - 1
                  : item?.total,
            };
          }
        } else {
          return item;
        }
      });
      return {
        ...state,
        posts:
          action.payload?.posts === 'add' && !state.typePosts
            ? [
              ...action.payload?.list
                ?.filter((main) => main?.channelId === state.channel)
                .map((main) => {
                  return {
                    ...main,
                    ...{
                      comments: [],
                      pageComment: 1,
                      loading: false,
                    },
                  };
                }),
              ...state.posts,
            ]
            : action.payload?.posts === 'delete'
              ? state.posts.filter((item) => item?._id !== action.payload?.id)
              : ssePosts,
        sizeNotifi:
          action.payload?.authorNotifi === state.author?.id &&
            action.payload?.authorNotifi2 !== state.author?.id
            ? state.sizeNotifi + 1
            : state.sizeNotifi,
        notification:
          state.notification?.length > 0
            ? action.payload?.authorNotifi === state.author?.id &&
              action.payload?.authorNotifi2 !== state.author?.id
              ? [...[action.payload?.notification], ...state.notification]
              : state.notification
            : state.notification,
        channelList:
          state?.channelList?.length > 0 ? sseChannelList : state?.channelList,
      };
    case 'SET_POSTS':
      const commentList = action.payload?.posts.map((main) => {
        return {
          ...main,
          ...{
            comments: [],
            total: 0,
          },
        };
      });

      const shouldReplace = state.page === 1 || state.posts.length === 0;
      const newPosts = shouldReplace ? commentList : [...state.posts, ...commentList];

      return {
        ...state,
        posts: newPosts,
        loadingPost: false,
        lengthPosts: action.payload?.size,
      };
    case 'CHANGE_LOADING_POST':
      return {
        ...state,
        loadingPost: action.payload,
      };
    case 'CHANGE_TAB_POST':
      return {
        ...state,
        typePosts: action.payload,
        posts: [],
        page: 1,
        size: 5,
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
        loadingNotifi: action.payload,
      };
    case 'SET_LENGTH_NOTIFICATION':
      return {
        ...state,
        lengthNotication: action.payload?.length,
        sizeNotifi: action.payload?.size,
      };
    case 'CHANGE_NOTIFICATION_ALL':
      return {
        ...state,
        notification: [...state.notification, ...action.payload?.list],
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
      const count = updateSize(state.posts?.length);
      return {
        ...state,
        page:
          state.typePosts === "Search" ?
            -1
            : numberPosts >= count?.page && count?.page > 0 && state.page > 0
              ? count?.page
              : -1,
        size: count?.size,
      };
    case 'CHANGE_PAGE_NOTIFICATION':
      const numberNotifi = Math.ceil(state.lengthNotication / 5);
      return {
        ...state,
        loadingNotifi:
          numberNotifi > action.payload &&
            action.payload > 0 &&
            state.pageNotification > 0
            ? true
            : false,
        pageNotification:
          numberNotifi >= action.payload &&
            action.payload > 0 &&
            state.pageNotification > 0
            ? action.payload === state.pageNotification + 1
              ? action.payload
              : state.pageNotification
            : -1,
      };
    case 'SET_COMMENTS':
      const listComment = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          return {
            ...main,
            comments: action.payload?.type
              ? action.payload?.list
              : [...main.comments, ...action.payload?.list],
            ...{
              page: action.payload?.type ? 1 : action.payload?.page,
              size: action.payload?.type ? 5 : action.payload?.size,
              total: action.payload?.total,
            },
          };
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listComment,
      };
    case 'CHANGE_MENU':
      return {
        ...state,
        onMenu: action.payload,
      };
    case 'SET_COMMENTS_ITEM':
      const listCommentItem = state.posts.map((main) => {
        if (main.messageId === action.payload?.messageId) {
          const listItemComment = main?.comments.map((item) => {
            if (item?._id === action.payload?.id) {
              const itemList = action.payload?.list;
              const addItem = {
                page: action.payload?.type ? 1 : action.payload?.page,
                size: action.payload?.size,
              };
              return action.payload?.type
                ? { ...item, itemList, ...addItem }
                : {
                  ...item,
                  itemList: [...item?.itemList, ...itemList],
                  ...addItem,
                };
            } else {
              return item;
            }
          });
          return {
            ...main,
            comments: listItemComment,
          };
        } else {
          return main;
        }
      });
      return {
        ...state,
        posts: listCommentItem,
      };
    case 'SET_COMMENTS_LOADING':
      const loadingComment = state.posts?.map((item) => {
        if (item?.messageId === action.payload?.messageId) {
          if (action.payload?.item) {
            return {
              ...item,
              comments: item?.comments?.map((e) => {
                if (e?._id === action.payload?.item) {
                  if (e?.loading) {
                    return { ...e, ...{ loading: action.payload?.loading } };
                  } else {
                    return { ...e, loading: action.payload?.loading };
                  }
                } else {
                  return e;
                }
              }),
            };
          } else {
            return { ...item, loading: action.payload?.loading };
          }
        } else {
          return item;
        }
      });
      return {
        ...state,
        posts: loadingComment,
      };
    case 'SET_USERS':
      return {
        ...state,
        users:
          state.pageUsers === 1
            ? action.payload?.list?.users
            : [...state?.users, ...action.payload?.list?.users],
        lengthUsers: action.payload?.list?.size,
        sizeUsers: action.payload?.list?.online,
        loadingUsers: false,
      };
    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload,
        pageUsers: 1,
        users: [],
        searchTime: [],
        searchUsersPosts: '',
      };
    case 'RESET_SEARCH':
      return {
        ...state,
        search: action.payload,
        pageUsers: 1,
        searchTime: [],
      };
    case 'SET_SEARCH_POSTS':
      return {
        ...state,
        searchPosts:
          state.pageUsers === 1
            ? action.payload?.posts
            : [...state.searchPosts, ...action.payload?.posts],
        lengthUsers: action.payload?.total,
        loadingUsers: false,
      };
    case 'SET_SEARCH_MESSAGE':
      return {
        ...state,
        searchMessage: action.payload,
        users: [],
      };
    case 'CHANGE_LOADING_USERS':
      return {
        ...state,
        loadingUsers: action.payload,
      };
    case 'CHANGE_PAGE_USERS':
      const numberUsers = Math.ceil(action.payload?.length / 10);
      return {
        ...state,
        pageUsers:
          numberUsers >= action.payload?.page &&
            action.payload?.page > 0 &&
            state.pageUsers > 0
            ? action.payload?.page === state.pageUsers + 1
              ? action.payload?.page
              : state.pageUsers
            : -1,
      };
    case 'CHANGE_SEARCH_POSTS':
      return {
        ...state,
        searchPosts: [],
        lengthUsers: 0,
        pageUsers: 1,
      };
    case 'CHANGE_PAGE_USERS_POST':
      return {
        ...state,
        pageUsers: 1,
        searchUsersPosts: action.payload,
        searchPosts: [],
      };
    case 'SET_SEARCH_TIME':
      return {
        ...state,
        searchTime: action.payload,
        search: '',
        searchPosts: [],
        lengthUsers: 0,
        pageUsers: 1,
        searchUsersPosts: '',
      };
    case 'SET_CHANNEL':
      return {
        ...state,
        channel: action.payload,
        page: 1,
        posts: [],
      };
    case 'SET_CHANNEL_LIST':
      return {
        ...state,
        channelList: action.payload,
        channel: action.payload[0]?.id,
        channelsFetched: true,
      };
    default:
      throw new Error('Error');
  }
}
export { initState };
export default reducer;
