//  eslint-disable @typescript-eslint/no-this-alias
$(document).ready(function () {
  // $('.show-comments').click(function () {
  //   var $toggle = $(this);
  //   var id = '#comments-' + $toggle.data('id');
  //   $(id).toggle();
  // });

  $('body').on('click', '.comment', function () {
    console.log('coment scuces');
    const id = '#comments-' + $(this).data('message-id');
    $(id).toggle();
  });
  // bây giờ là khi ấn vào button chứa các icon là các emoji thì chúng ta sẽ tạo ra sự kiến click truyền messesag id là emoji bao gồm mảng chứa thông tin các iscon , tính toán và
  // lại banwgfg hàm reducer cho mảng icon .
  $('.count-comment').click(function () {
    const id = '#comments-' + $(this).data('message-id');
    $(id).toggle();
  });

  $('.img-people-avatar').click(function () {
    $('.navbar-content').toggle();
  });
  $('.person-icon').click(function () {
    $('.navbar-content').toggle();
  });

  // $('.notification').click(function () {
  //   $('.navbar-content-notification').toggle();
  // });

  $(document).mouseup((e) => {
    $user = $('#user');
    if (!$user.is(e.target) && $user.has(e.target).length === 0) {
      $user.css('display', 'none');
    }

    $notification = $('#notification');
    if (
      !$notification.is(e.target) &&
      $notification.has(e.target).length === 0
    ) {
      $notification.css('display', 'none');
    }
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

  $('.input-emojis').emojioneArea({
    pickerPosition: 'bottom',
    tonesStyle: 'bullet',
    events: {
      keyup: function (editor, e) {
        if (e.which == 13) {
          console.log('this : ', this);
          const messageId = this.source[0].dataset.messageId;

          const authorId = $('.navbar-user').data('user-id');
          const authorUser = $('.navbar-user').data('user-name');
          const authorAvatar = $('.navbar-user').data('user-avatar');
          const textComment = this.getText();

          if (textComment.trim().length == 0) {
            // $.toast({
            //   heading: 'Warning',
            //   text: `Hãy nhập gì đó trước khi gửi!`,
            //   showHideTransition: 'slide',
            //   icon: 'warning',
            // });
          } else {
            this.setText('');
            $.ajax({
              url: '/comment',
              type: 'POST',
              data: {
                messageId,
                authorId,
                content: textComment,
                count,
              },
              success: function (data) {
                let contentComment =
                  `<div class='content-comments'>
                <img src="https://cdn.discordapp.com/avatars/${authorId}/${authorAvatar}" width="30"
                  class="img-comment" alt="avatar">` +
                  `<div class='column'>
                  <div class='space-between'> 
                  <span class='author-comment'>
                  ${authorUser}</span>
                  <span class='timeStamp'>${dayjs(
                    new Date(+data.comment.createdTimestamp.toString()),
                  ).format('DD/MM/YYYY hh:mm A')}</span> </div> 
                  
                <span class='comment-text'>${
                  data.comment.content
                }</span></div></div>`;

                $('.comment-text' + data.comment.messageId).append(
                  contentComment,
                );
              },
              error: function () {
                // $('.comment-text' + messageId).html('<p>No Create comment</p>');
                $.toast({
                  heading: 'Warning',
                  text: `Bạn cần đăng nhập để bình luận`,
                  showHideTransition: 'slide',
                  icon: 'warning',
                });
              },
            });
          }
        }
      },
    },
  });


  $('body').on('show', '.comment', function () {
    const messageId = $(this).data('message-id');

    $.ajax({
      url: '/comments?messageId=' + messageId,
      type: 'GET',
      success: function (data) {
        $.each(data, function (key, item) {
          //console.log(item);

          for (let i = 0; i < item.length; i++) {
            let author = item[i].author;
            for (let j = 0; j < author.length; j++) {
              let content =
                `<div class='content-comments'>
                <img src="https://cdn.discordapp.com/avatars/${author[j].id}/${author[j].avatar}" height:"30" width="30"
                class="img-comment" alt="avatar">` +
                `<div class='column'>
                <div class='space-between'> 
                <span class='author-comment'>
                ${author[j].username}</span>
                <span class='timeStamp'>${dayjs(
                  new Date(+item[i].createdTimestamp.toString()),
                ).format('DD/MM/YYYY hh:mm A')}</span> </div> 
              <span class='comment-text'>${
                item[i].content + '<br>'
              }</span></div></div>`;
              $('.comment-text' + messageId).append(content);
            }
          }
        });
      },
    });
  });
  $('body').on('click', '.like', function () {
    console.log('click event success');
    const messageId = $(this).data('message-id');
    const authorId = $('.navbar-user').data('user-id');
    var qn = $(this);
    qn.toggleClass('likes');
    $.ajax({
      url: '/like',
      type: 'POST',
      data: {
        messageId: messageId,
        authorId: authorId,
      },
      success: function (data) {
        // console.log(data);
        // if (data.messageId && !data.authorId) {
        //   $('#likes-' + data.messageId).addClass('likes');
        // } else if (data.authorId) {
        //   $('#likes-' + data.messageId).removeClass('likes');
        // }
        location.reload();
      },
      error: function () {
        // $('.comment-text' + messageId).html('<p>No Create comment</p>');
        $.toast({
          heading: 'Warning',
          text: `Bạn cần đăng nhập để thích`,
          showHideTransition: 'slide',
          icon: 'warning',
        });
      },
    });
  });
 
  $('.notifications').show(function () {
    
    const messageId = $(this).data('message-id');
    var count = 0;

    $.ajax({
      url: '/notifications?messageId=' + messageId,
      type: 'GET', 
      success: function (data) {
      
        count = data.notifications.length;
       console.log('data : ', data)
        const userId = $('.navbar-user').attr('data-user-id');
        $.each(data, function (key, item) {
          for (let i = 0; i < item.length; i++) {
            let author = item[i].author;
            let message = item[i].message;
            let notificationComment = '';
            let timeNotifi =  new Date((new Date().getTime()- new Date(+message[0].createdTimestamp.$numberDecimal).getTime())).getDate();
            if(timeNotifi < 1) {
              timeNotifi *= 24;
              if(timeNotifi < 1) {
                timeNotifi *= 60;
              }
            }
            if (userId === message[0].authorId) {
              if (item[i].content) {
                notificationComment +=
                  `<div class='content-comment'>
                        <div class='content-comment-infor'>
                            <img src="https://cdn.discordapp.com/avatars/${author[0].id}/${author[0].avatar}"
                            class="img-people-comment" alt="avatar" width="30">` +
                              `<span >
                              <b> ${author[0].username}</b>
                              đã bình luận bài viết của bạn có nội dung: ${item[i].content} </span>
                        </div>
                        <p class='time-notifi'>
                          ${timeNotifi} ngày trước
                        </p>
                   </div>`;
              } else {
                console.log(item[i])
                notificationComment +=
                  `<div class='content-comment'>
                        <div class='content-comment-infor'>
                            <img src="https://cdn.discordapp.com/avatars/${author[0].id}/${author[0].avatar}"
                            class="img-people-comment" alt="avatar" width="30">` +
                              `<span><b> ${author[0].username} </b>
                              đã thích bài viết của bạn. </span>
                        </div>
                        <p class='time-notifi'>
                        ${timeNotifi} ngày trước
                      </p>
                  </div>`;
              }
            }
            $('#notification' + item[i].messageId).append(notificationComment);
          }
         
        });
        showNotifiCounter(count)
      },
      error: function () {
        console.log('Error in Operation');
      },
    });
  });

  $('.btnNotification').click(function () {

    $('.navbar-content-notification').fadeToggle('fast', 'linear', function () {
      if ($('.navbar-content-notification').is(':hidden')) {
        console.log('notifa');
        $('.btnNotification').css('background-color', '#2E467C');
      } else {
        $('.notification').css('background-color', 'rgb(178 200 229)'); 
        $('.notification-bell').css('color', 'hsl(214, 89%, 52%)')};
    });
    $('#noti_Counter').fadeOut('slow');
    return false;
  });
  $(document).click(function () {
    $('.navbar-content-notification').hide();
    if ($('.navbar-content-notification').is(':hidden')) {
      $('.notification').css('background-color', '#e4e6eb'); 
      $('.notification-bell').css('color', '#333');
    }
  });
  $('body').on('click', '.content-comment', function () {
    console.log('content comment', this)
   $(this).children().css('color', '#65676b')
  })
 
});

function getHtmlContent(data) {
  var htmlContent = '';
  console.log('data : ', data);
  for (let index = 0; index < data.length; index++) {
    let author = data[index].author;
    let emojis = data[index].reactions;
    let message = data[index];
    let comment = data[index].comments;

    htmlContent += `<div class="post">`;
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

    htmlContent += `<div><div class="text-avatar">${author.username}</div>`;

    htmlContent += `<div ><small>${dayjs(
      new Date(Number.parseInt(message.createdTimestamp.$numberDecimal)),
    ).format('DD/MM/YYYY hh:mm A')}</small></div>`;

    htmlContent += `</div>`;

    htmlContent += `</div>`;

    htmlContent += `</div>`;

    htmlContent += `<div class="image">`;
    if (message.links) {
      message.links.forEach((link) => {
        htmlContent += `<img src="https://bwl.vn/images/${link}" class="img-fluid" alt="${link}">`;
      });
    }
    htmlContent += `</div>`;

    htmlContent += `<div id="reaction" class="reaction-user"><div class="box-reaction"><ul class="box-reaction-list">`;
    if (message.totalLike) {
      htmlContent += `<li class='form-like'>`;
      htmlContent += `<button class="btn-reaction" data-bs-toggle="modal" data-bs-target="#emojiModal">
                    <img class='j1lvzwm4' height='18' role='presentation' src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" width='18'/>
                    </button>`;
      htmlContent += `</li>`;
    }
    const emojisFilter =
      emojis.length > 3
        ? emojis
            .sort((a, b) => b.count > a.count)
            .filter((value, index) => index === 0 || index === 1 || index === 2)
        : emojis;
    for (let emojiIndex = 0; emojiIndex < emojisFilter.length; emojiIndex++) {
      let emojiContent = emojisFilter[emojiIndex].name;
      // emojis[emojiIndex].name + ' ' + emojis[emojiIndex].count;
      if (emojisFilter[emojiIndex].id) {
        emojiContent = `<img class="emoji" src="https://cdn.discordapp.com/emojis/${emojisFilter[emojiIndex].id}.png" alt="${emojisFilter[emojiIndex].name}"/> `;
      }

      htmlContent += `<li class="list-inline-item list-reaction"><button class="btn-reaction">${emojiContent}</button></li>`;
    }
    htmlContent += `</ul></div></div>`;

    // htmlContent += `<div class="comment-box">`;
    // htmlContent += `<div data-id="${message.messageId}" class="show-comments d-flex flex-row muted-color">`;
    // htmlContent += `<span>${message.comments.length} comments</span></div>`;

    // htmlContent += `<div id="comments-${message.messageId}" class="comments"><hr>`;
    // for (
    //   let commentIndex = 0;
    //   commentIndex < message.comments.length;
    //   commentIndex++
    // ) {
    //   let comment = message.comments[commentIndex];
    //   htmlContent += `<div class="d-flex flex-row mb-2">`;
    //   if (comment.user.avatar) {
    //     htmlContent += `<img src="${comment.user.avatar}" width="40" class="rounded-image" alt="avatar"/>`;
    //   } else {
    //     htmlContent += `<img src="data:image/png;base64,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" width="40" class="rounded-image" alt="avatar"/>`;
    //   }
    //   htmlContent += `<div class="d-flex flex-column ml-2"><span class="name">${comment.user.username}</span>`;
    //   htmlContent += `<small class="comment-text pb-1">${comment.comment}</small>`;
    //   for (let linkIndex = 0; linkIndex < comment.links.length; linkIndex++) {
    //     htmlContent += `<img src="${comment.links[linkIndex]}" class="pb-1" style="max-width: 300px;" alt=""/>`;
    //   }
    //   htmlContent += ` </div></div>`;
    // }

    // htmlContent += `</div>`;
    // htmlContent += `<div class='count-comment'>`;
    // if (message.totalComment) {
    //   htmlContent += `${message.totalComment} bình luận`;
    // } else {
    //   htmlContent += ``;
    // }
    // htmlContent += `</div>`;
    // htmlContent += `</div>`;

    htmlContent += `<div class="interaction"><button class="like" id="like-${message.messageId}" data-message-id="${message.messageId}" data-total-like="${message.totalLike}">`;
    if (message.totalLike) {
      htmlContent += `<span class="likes" id="likes-1008856661638791250">
      <i data-visualcompletion="css-img" style="background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/Z7CRdrrbx1y.png&quot;); background-position: 0px -253px; background-size: auto; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;filter: invert(39%) sepia(57%) saturate(200%) saturate(200%) saturate(200%) saturate(200%) saturate(200%) saturate(147.75%) hue-rotate(202deg) brightness(97%) contrast(96%);"></i>
      <span style="padding-left: 8px;">Thích</span>
    </span>`;
    } else {
      htmlContent += `<span id="likes-1008675966119325696">
      <i data-visualcompletion="css-img" style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/Z7CRdrrbx1y.png');background-position:0 -272px;background-size:auto;width:18px;height:18px;background-repeat:no-repeat;display:inline-block;"></i>
      <span style="padding-left: 8px;">Thích</span>
    </span>`;
    }
    htmlContent += `</button>`;
    htmlContent += `<button class="comment" data-message-id="${
      message.messageId
    }"><i data-visualcompletion='css-img' class='hu5pjgll m6k467ps' style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/Z7CRdrrbx1y.png');background-position:0 -234px;background-size:auto;width:18px;height:18px;background-repeat:no-repeat;display:inline-block"></i> Bình luận ${
      message.totalComment ? `(${message.totalComment})` : ''
    }</button>`;
    htmlContent += `</div>`;
    htmlContent += `<div id="comments-${message.messageId}" class="comments" data-message-id="${message.messageId}" style="display : none">
                          <div class="show-author-comments">
                                 <div class="comment-text${message.messageId}" id="comment-text"></div>
                          </div>
                          <div class='inputWithIcon'>
                                        <input
                                            class="input-emojis"
                                            name='comment_id'
                                            placeholder='Add a comment...'
                                            data-message-id='${message.messageId}'
                                          />
                          </div>
    </div>`;

    htmlContent += `</div></div></div>`;
  }
  return htmlContent;
}
var count = 0;
$("[name='comment_id']").attr('required', true);

const evtSource = new EventSource('/sse');

evtSource.onmessage = ({ data }) => {
  let dataJson = JSON.parse(data);
  console.log('New message', JSON.parse(data));

  let messageAuthor = dataJson.messageAuthor;
  let commentAuthor = dataJson.commentAuthor;
  let likeAuthor = dataJson.likeAuthor;
  let comment = dataJson.comment;
  let message = dataJson.message;
  const userId = $('.navbar-user').attr('data-user-id');
  console.log(userId);
  let notificationComment = ``;

  if (userId === messageAuthor.id) {
    if (commentAuthor) {
      $.toast({
        heading: 'Comment',
        text: `${commentAuthor.username} đã bình luận về bài viết của bạn`,
        showHideTransition: 'slide',
        icon: 'info',
      });
      notificationComment +=
        `<div class='content-comment'>
        <img src="https://cdn.discordapp.com/avatars/${commentAuthor.id}/${commentAuthor.avatar}"
        class="img-people-comment" alt="avatar" width="30">` +
        `<span><b> ${commentAuthor.username} </b>
         đã bình luận bài viết của bạn có nội dung:
         ${comment.content}</span></div>`;
    } else if (likeAuthor) {
      notificationComment +=
        `<div class='content-comment'>
        <img src="https://cdn.discordapp.com/avatars/${likeAuthor.id}/${likeAuthor.avatar}"
        class="img-people-comment" alt="avatar" width="30">` +
        `<span><b> ${likeAuthor.username} </b>
         đã thích bài viết của bạn. </span></div>`;
      $.toast({
        heading: 'Like',
        text: `${likeAuthor.username} đã thích bài viết của bạn`,
        showHideTransition: 'slide',
        icon: 'info',
      });
    }
    count = count + 1;
    let count1 = $('.show-comment-like').val();
    $('.show-comment-like').show();

    var count2 = count + +count1;
    $('.show-comment-like').text(count2);
    // console.log(count + +count1);

    $('#notification' + message[0].messageId).append(notificationComment);
  }

  $('.notification').click(function () {
    // $('.show-comment-like').show();
    count = 0;
    $('.show-comment-like').text('');
  });
};

$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });

  $('.scrollup').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
    return false;
  });
});

$(document).ready(function () {
  $('.emoji_act').emojioneArea({
    emojiPlaceholder: ':smile_cat:',
    searchPlaceholder: 'Search',
    buttonTitle: 'Use your TAB key to insert emoji faster',
    searchPosition: 'bottom',
    pickerPosition: 'bottom',
  });
});

$(document).ready(function () {
  $('.logoNcc').click(function () {
    location.reload(true);
  });
});

function showNotifiCounter(numberCounter){
  $('#noti_Counter')
  .css({ opacity: 0 })
  .text(numberCounter)   
  .css({ top: '-10px' })
  .animate({ top: '-2px', opacity: 1 }, 500);
}
function darkMode() {
  var element = document.body;
  element.classList.toggle('dark-mode');

  const darkHeader = document.querySelector('.nav-header');
  darkHeader.classList.toggle('dark-header');

  const darkFlex = document.querySelector('.flex-2');
  darkFlex.classList.toggle('dark-flex');

  const dateTime = document.querySelectorAll('.date');
  for (let i = 0; i < dateTime.length; ++i) {
    dateTime[i].classList.toggle('dateTime');
  }

  const darklListView = document.querySelectorAll('.dark-post');
  for (let i = 0; i < darklListView.length; ++i) {
    darklListView[i].classList.toggle('dark-list');
  }

  const darklTotalike = document.querySelector('.container-fluid');
  darklTotalike.classList.toggle('dark-fluid');

  const darkDropDown = document.querySelectorAll('.dark-dropdown');
  for (let i = 0; i < darkDropDown.length; ++i) {
    darkDropDown[i].classList.toggle('dark-dropdowns');
  }

  const darkPostData = document.querySelectorAll('.post-data-container');
  for (let i = 0; i < darkPostData.length; ++i) {
    darkPostData[i].classList.toggle('dark-post-data-container');
  }

  const darkCmt = document.querySelectorAll('.cmt');
  for (let i = 0; i < darkCmt.length; ++i) {
    darkCmt[i].classList.toggle('cmt-2');
  }

  const darkLike = document.querySelectorAll('.like-like');
  for (let i = 0; i < darkLike.length; ++i) {
    darkLike[i].classList.toggle('like-3');
  }

  const emojiInput = document.querySelectorAll('.emojionearea-inline');
  for (let i = 0; i < emojiInput.length; ++i) {
    emojiInput[i].classList.toggle('emojionearea-inline-active');
  }

  const emojiEditor = document.querySelectorAll('.emojionearea-editor');
  for (let i = 0; i < emojiEditor.length; ++i) {
    emojiEditor[i].classList.toggle('emojionearea-editor-active');
  }

  // const emojiWrapper = document.querySelectorAll('.emojionearea-wrapper');
  // for (let i = 0; i < emojiWrapper.length; ++i) {
  //   emojiWrapper[i].classList.toggle('emojionearea-wrapper-active');
  // }

  const emojiWrapper = document.querySelector('.emojionearea-wrapper');
  emojiWrapper.classList.toggle('emojionearea-wrapper-active');
}
