/* eslint-disable prettier/prettier */

export const addTagText = (text) => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    return text.replace(urlRegex, (url) => (
        `<a href="${url}" target="_blank" 
            rel="noopener noreferrer" 
            style="text-decoration: underline; color: rgb(25, 118, 210);"
        >
            ${url}
        </a>`
    ));
};

