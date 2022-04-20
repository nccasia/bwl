$(document).ready(function () {
  $('.show-comments').click(function () {
    var $toggle = $(this);
    var id = '#comments-' + $toggle.data('id');
    $(id).toggle();
  });

  const container = $('#infinite-scroll');

  container.infiniteScroll({
    path: '/getAllPaging?page={{#}}',
    append: false,
    responseBody: 'json',
    history: false,
    scrollThreshold: 1000,
  });

  container.on('load.infiniteScroll', function (event, response) {
    container.append(getHtmlContent(response));
  });

  container.on('scrollThreshold.infiniteScroll', function (event, response) {
    console.log('Scroll at bottom', event, response);
  });

  $('input').keyup(function (e) {
    if (e.keyCode == 13) {
      const messageId = $(this).data('message-id');
      const authorId = $(this).data('author-id');
      const textComment = $(this).val();
      const $this = this;
      // console.log(textComment);
      if (textComment !== '') {
        $.ajax({
          url: '/comment',
          type: 'POST',
          data: {
            messageId,
            authorId,
            content: textComment,
          },
          success: function (data) {
            var saveComment = '';
            saveComment += `${data.comment.content} </br>`;
            // saveAuthor += `${data.comment.author}`;
            console.log(data);
            // $('.author' + data.comment.messageId).append(saveAuthor);
            $('.comment-text' + data.comment.messageId).append(saveComment);
            $('.comment-date' + data.comment.messageId).append(
              dayjs(
                new Date(Number.parseInt(data.comment.createdTimestamp)),
              ).format('DD/MM/YYYY hh:mm A') + '<br>',
            );
            $($this).val('');
          },
          error: function () {
            console.log('Error in Operation');
          },
        });
      }
    }
  });

  $('.comment').show(function () {
    const messageId = $(this).data('message-id');
    // console.log(messageId);
    $.ajax({
      url: '/comments?messageId=' + messageId,
      type: 'GET',
      success: function (data) {
        $.each(data, function (key, item) {
          // console.log(item);
          for (let i = 0; i < item.length; i++) {
            // console.log(item[i].content);
            $('.comment-text' + messageId).append(item[i].content + '<br>');
            let author = item[i].author;
            for (let j = 0; j < author.length; j++) {
              // console.log(author[j].username);
              $('.author' + messageId).append(author[j].username + '<br>');
            }
            $('.comment-date' + messageId).append(
              dayjs(new Date(Number.parseInt(item[i].createdTimestamp))).format(
                'DD/MM/YYYY hh:mm A',
              ) + '<br>',
            );
          }
        });
      },
      error: function () {
        console.log('Error in Operation');
      },
    });
  });

  $('.comment').click(function () {
    var id = '.show-author-comments' + $(this).data('message-id');
    $(id).toggle();
  });

  $('.img-people').click(function () {
    $('.navbar-content').toggle();
  });

  $('.notification').click(function () {
    $('.navbar-content-notification').toggle();
  });
});

function getHtmlContent(data) {
  var htmlContent = '';
  // console.log(data);
  for (let index = 0; index < data.length; index++) {
    let author = data[index].author;
    let emojis = data[index].reactions;
    let message = data[index];
    let comment = data[index].comments;

    // console.log(data[index].comments);
    htmlContent += `<div style="position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125);margin-bottom: 30px;border-radius: 0.25rem;">`;
    htmlContent += `<div id="header" class="content-head">`;
    htmlContent += `<div class="list-avatar">`;

    if (
      author.avatar !== null &&
      author.avatar !== undefined &&
      author.avatar !== ''
    ) {
      htmlContent += `<img src="https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}" width="50" class="img-people" alt="avatar"></img>`;
    } else {
      htmlContent += `<img src="data:image/png;base64,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" width="50" class="img-people" alt="avatar"/>`;
    }
    htmlContent += `<div><span class="text-avatar">${author.username}</span></div>`;
    htmlContent += `</div>`;

    htmlContent += `<div class="d-flex flex-row align-items-center ellipsis"><small>${dayjs(
      new Date(Number.parseInt(message.createdTimestamp.$numberDecimal)),
    ).format('DD/MM/YYYY hh:mm A')}</small></div>`;
    htmlContent += `</div>`;

    htmlContent += `<div class="image">`;
    if (message.links) {
      message.links.forEach((link) => {
        htmlContent += `<img src="http://bwl.vn/images/${link}" class="img-fluid" alt="${link}">`;
      });
    }
    htmlContent += `</div>`;

    htmlContent += `<div id="reaction" class="reaction-user"><div class="box-reaction"><ul class="box-reaction-list">`;
    for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
      let emojiContent =
        emojis[emojiIndex].name + ' ' + emojis[emojiIndex].count;
      if (emojis[emojiIndex].id) {
        emojiContent = `<img class="emoji" src="https://cdn.discordapp.com/emojis/${emojis[emojiIndex].id}.png" alt="${emojis[emojiIndex].name}"> ${emojis[emojiIndex].count}`;
      }
      htmlContent += `<li class="list-inline-item list-reaction"><button class="btn-reaction">${emojiContent}</button></li>`;
    }
    htmlContent += `</ul></div></div>`;

    htmlContent += `<div class="interaction">`;
    htmlContent += `<button class="like">Like</button>`;
    htmlContent += `<button class="comment" data-message-id="${message.messageId}">Comment (${message.totalComment})</button>`;
    htmlContent += `</div>`;

    htmlContent += `<div id="comments-${message.messageId}" class="comments" data-id="${message.messageId}">`;
    htmlContent += `<div class="list-avatar-comment">`;
    if (
      author.avatar !== null &&
      author.avatar !== undefined &&
      author.avatar !== ''
    ) {
      htmlContent += `<img src="https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}" width="50"
      class="img-people" alt="avatar">`;
    } else {
      htmlContent += `<img src="data:image/png;base64,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" width="50" class="img-people" alt="avatar">`;
    }
    htmlContent += `<span class="author${author.username}" id="author"></span>`;
    htmlContent += `</div>`;
    htmlContent += `<div class="d-flex flex-row mb-2" style="display: flex;">`;
    htmlContent += `<div class="show-author-comments${message.messageId}" id="show-author-comments" style="display: none;">`;
    for (let commentIndex = 0; commentIndex < comment.length; commentIndex++) {
      // console.log(comment[commentIndex]);
      let author = comment[commentIndex].author;
      for (let authorIndex = 0; authorIndex < author.length; authorIndex++) {
        htmlContent += `<span class="author${message.messageId}" id="author">${author[authorIndex].username}</span>`;
      }
      htmlContent += `<small class="comment-text${message.messageId}" id="comment-text">${comment[commentIndex].content}</small>`;
      htmlContent += `<small class="comment-date${
        message.messageId
      }" id="comment-date">${dayjs(
        new Date(
          Number.parseInt(
            comment[commentIndex].createdTimestamp.$numberDecimal,
          ),
        ),
      ).format('DD/MM/YYYY hh:mm A')}</small>`;
    }
    htmlContent += `</div>`;
    htmlContent += `</div>`;
    htmlContent += `</div>`;

    // htmlContent += `<div>${message.messageId}hhh</div>`;

    htmlContent += `<div class="add-comment">`;
    htmlContent += `<svg aria-label="Biểu tượng cảm xúc" class="_8-yf5 " color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>`;
    htmlContent += `<input type="text" placeholder="Add new comment..." data-message-id="${message.messageId}$" data-author-id="${message.authorId}"/>`;
    htmlContent += `</div>`;

    htmlContent += `</div>`;
  }
  return htmlContent;
}
