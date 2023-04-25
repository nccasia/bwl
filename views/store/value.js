/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-loss-of-precision */
/* eslint-disable prettier/prettier */
import axios from 'axios';
// handle data
const nodes = document.querySelectorAll('.app');
let posts = [];
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
var commentLists = [];
const getComment = (messageId) => {
  axios
    .get(`/comments?messageId=${messageId}`)
    .then((res) => {
      commentLists.push(...res.data.comments);
      console.log('commentList', commentLists);
      console.log('comment', res);
    })
    .catch((err) => console.log(err));
};
const handleComment = (data) => {
  axios
    .post('/comment', { ...data })
    .then((res) => console.log('res', res))
    .catch((err) => console.log(err));
};
const contextValue = {
  posts,
  hotPost,
  discordLink,
  userProfile,
  handleComment,
  getComment,
  commentLists,
};
export default contextValue;
