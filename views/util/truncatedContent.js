

export const truncatedContent = (content) => {
    if (content.length > 20) {
      return `${content.substring(0, 20)}...`;
    }
    return content;
  };
  