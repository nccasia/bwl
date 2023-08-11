/* eslint-disable prettier/prettier */
export const truncatedContent = (content) => {
  if (content && content.length > 15) {
    return `${content.substring(0, 15)}...`;
  } else{
    return content;
  }
};
  