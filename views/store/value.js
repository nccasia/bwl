/* eslint-disable prettier/prettier */
// handle data
const nodes = document.querySelectorAll('.app');
const nodesLinks = document.querySelectorAll('.app-link');
let posts = [];
for (const node of nodes) {
  const messageId = JSON.parse(node.getAttribute('messageId'));
  const user = JSON.parse(node.getAttribute('user'));
  const authorId = node.getAttribute('authorId').toString();
  const authorAvatar = node.getAttribute('authorAvatar').toString();
  const authorName = node.getAttribute('authorName').toString();
  const totalLike = JSON.parse(node.getAttribute('totalLike'));
  const createdTimestamp = JSON.parse(node.getAttribute('createdTimestamp'));
  const reactions = node.querySelectorAll('.app-react');
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
  };
  posts.push(post);
}
for (const [index, node] of nodesLinks.entries()) {
  const link = node.getAttribute('link');
  posts[index].link = link;
}
const contextValue = {
  posts,
};
export default contextValue;
