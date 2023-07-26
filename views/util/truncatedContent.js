export const truncatedContent = (content) => {
    if (content && content.length > 20) {
      return `${content.substring(0, 20)}...`;
    } else{
      return content;
    }
  };
  