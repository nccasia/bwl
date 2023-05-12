export const maxPosts = (inputPosts) => {
    const max = inputPosts.filter((post) => {
      const postDate = new Date(+post?.createdTimestamp?.$numberDecimal);
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