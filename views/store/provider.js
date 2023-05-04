/* eslint-disable prettier/prettier */
import AppContext from './context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import dayjs from 'dayjs';

const AppProvider = (props) => {
  const [posts, setPosts] = useState([]);
  const nodes = document.querySelectorAll('.app');
  const formatDay = (time) => {
    const dayMoment = dayjs().format('DD');
    const monthMoment = dayjs().format('MM');
    const yearMoment = dayjs().format('YYYY');
    const day = dayjs(new Date(+time.toString())).format('DD');
    const month = dayjs(new Date(+time.toString())).format('MM');
    const year = dayjs(new Date(+time.toString())).format('YYYY');
    if (
      dayMoment - day == 0 &&
      monthMoment - month == 0 &&
      yearMoment - year == 0
    ) {
      return 'Today at ' + dayjs(new Date(+time.toString())).format('hh:mm A');
    } else if (
      dayMoment - day == 1 &&
      monthMoment - month == 0 &&
      yearMoment - year == 0
    ) {
      return (
        'Yesterday at ' + dayjs(new Date(+time.toString())).format('hh:mm A')
      );
    } else {
      return dayjs(+new Date(+time.toString())).format('DD/MM/YYYY hh:mm A');
    }
  };
  for (const node of nodes) {
    const messageId = node.getAttribute('messageId').toString();
    const user = JSON.parse(node.getAttribute('user'));
    const authorId = node.getAttribute('authorId').toString();
    const authorAvatar = node.getAttribute('authorAvatar').toString();
    const authorName = node.getAttribute('authorName').toString();
    const totalLike = JSON.parse(node.getAttribute('totalLike'));
    const timeItem = node.querySelector('.app-time');
    const createdTimestampFormat = timeItem.getAttribute(
      'createdTimestampFormat',
    );
    const createdTimestamp = node.getAttribute('createdTimestamp');
    const reactions = node.querySelectorAll('.app-react');
    const reactItem = node.querySelector('.app-reactSum');
    const totalReact = reactItem.getAttribute('totalReact');
    const nodeLink = node.querySelector('.app-link');
    const link = nodeLink.getAttribute('appLink');
    let reactList = [];
    for (const reaction of reactions) {
      const reactId = reaction.getAttribute('reactId').toString();
      const reactName = reaction.getAttribute('reactName');
      const react = {
        reactId,
        reactName,
      };
      reactList.push(react);
    }
    let commentPost = [];
    axios
      .get(`/comments?messageId=${messageId}`)
      .then((res) => {
        commentPost.push(...res.data.comments);
      })
      .catch((err) => console.log(err));
    const post = {
      messageId,
      user,
      authorId,
      authorAvatar,
      authorName,
      totalLike,
      createdTimestamp,
      reactList,
      totalReact,
      createdTimestampFormat,
      link,
      commentPost,
    };
    posts.push(post);
  }
  const maxPosts = (inputPosts) => {
    const max = inputPosts.filter((post) => {
      const postDate = new Date(+post.createdTimestamp);
      const currentDate = new Date();
      const daysAgo =
        (currentDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    });
    return max.length > 3
      ? max
          .sort((a, b) => b.totalReact - a.totalReact)
          .filter((value, index) => index < 9)
      : max;
  };
  const userIdNode = document.querySelector('.userId');
  const userAvatarNode = document.querySelector('.userAvatar');
  const userNameNode = document.querySelector('.userName');
  const userName = userNameNode.getAttribute('userName');
  const userId = userIdNode.getAttribute('userId');
  const userAvatar = userAvatarNode.getAttribute('userAvatar');
  const userProfile = {
    userId,
    userAvatar,
    userName,
  };
  const hotPost = maxPosts(posts);
  const url = document.querySelector('.url');
  const discordLink = url.getAttribute('url');
  const handleComment = (data) => {
    if (userProfile.userId === null) {
      toast.error('Vui lòng đăng nhập để comment');
    } else if (data.content === '') {
      toast.error('Vui lòng nhập nội dung bình luận');
      console.log(data);
    } else {
      axios
        .post('/comment', { ...data })
        .then((res) => {
          const newList = [...posts];
          const currentPostIndex = newList.findIndex(
            (post) => post.messageId === res.data.comment.messageId,
          );
          const newComment = {
            author: [
              {
                ...res.data.userDB,
              },
            ],
            ...res.data.comment,
          };
          newList[currentPostIndex].commentPost.push(newComment);
          toast.success('comment thành công');
          setPosts([...newList]);
        })
        .catch((err) => console.log(err));
    }
  };
  const value = {
    posts,
    hotPost,
    discordLink,
    userProfile,
    formatDay,
    handleComment,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppProvider;
