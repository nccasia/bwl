//  eslint-disable @typescript-eslint/no-this-alias
$(document).ready(function () {
  // $('.show-comments').click(function () {
  //   var $toggle = $(this);
  //   var id = '#comments-' + $toggle.data('id');
  //   $(id).toggle();
  // });

  $('.comment').click(function () {
    const id = '#comments-' + $(this).data('message-id');
    $(id).toggle();
  });

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

  $('.notification').click(function () {
    $('.navbar-content-notification').toggle();
  });

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

  $('input').keyup(function (e) {
    if (e.keyCode == 13) {
      const messageId = $(this).data('message-id');
      const authorId = $('.navbar-user').data('user-id');
      const authorUser = $('.navbar-user').data('user-name');
      const authorAvatar = $('.navbar-user').data('user-avatar');
      const textComment = $(this).val();
      const $this = this;
      let count = 0;
      if (textComment.trim().length == 0) {
        // $.toast({
        //   heading: 'Warning',
        //   text: `Hãy nhập gì đó trước khi gửi!`,
        //   showHideTransition: 'slide',
        //   icon: 'warning',
        // });
      } else {
        $($this).val('');
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

            $('.comment-text' + data.comment.messageId).append(contentComment);
            $($this).val('');
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
  });

  $('.comment').show(function () {
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

  $('.like').click(function () {
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
        // location.reload();
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
        //console.log(data)
        const userId = $('.navbar-user').attr('data-user-id');
        $.each(data, function (key, item) {
          for (let i = 0; i < item.length; i++) {
            let author = item[i].author;
            let message = item[i].message;
            let notificationComment = '';

            if (userId === message[0].authorId) {
              if (item[i].content) {
                notificationComment +=
                  `<div class='content-comment'>
                <img src="https://cdn.discordapp.com/avatars/${author[0].id}/${author[0].avatar}"
                class="img-people-comment" alt="avatar" width="30">` +
                  `<span >
                  <b> ${author[0].username}</b>
                   đã bình luận bài viết của bạn có nội dung: ${item[i].content} <span></div>`;
              } else {
                notificationComment +=
                  `<div class='content-comment'>
                <img src="https://cdn.discordapp.com/avatars/${author[0].id}/${author[0].avatar}"
                class="img-people-comment" alt="avatar" width="30">` +
                  `<span><b> ${author[0].username} </b>
                  đã thích bài viết của bạn. </span></div>`;
              }
            }
            $('#notification' + item[i].messageId).append(notificationComment);
          }
        });
      },
      error: function () {
        console.log('Error in Operation');
      },
    });
  });
});

function getHtmlContent(data) {
  var htmlContent = '';
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
    //     htmlContent += `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAilBMVEVYZfL///9WY/JQXvJSYPJMW/FPXfJKWfFHVvH29v78/P+AifXm6P3b3fzz9P7d3/yDjPVjb/Obovanrfe1uvnv8P69wvlpdPPEyPrU1/vi5P16g/Tp6/3Q0/tdavJ2gPSmrPeNlfazuPhsePPHy/qTmva7v/mYn/aus/iJkfVxfPRCUvGSmfaip/dhNChnAAAIfklEQVR4nO2dC3PiOAyAifwKoQRS3q8ABVpol///9y6hLeWRGCV2cOZG38zN3OyuiRXbkizJTqNBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEBUDnAkBxZoowXixJo4AYEpF695i0ijSX4jai956pBSDWouZDt2st2h6KUdZoKV8P7UJJ/uZEJJX1kMTgMm41e94Z4IYPxoQ/bXzOv1uLFnNhpJLsexNmt4VfYFur4bXTZvt/VLWZiiBC781nHv3oFcixBmtB8ODEu6VD4BkrXEzo4NFBlGNs38g2B64dCokMDYbDrJ7l3YwOncOEjjn7ETyPzz9g/NfjnJ/wmsOW1y6kpGraJU1Of/Yy8QySqF8GY8+Z4f17vXEx27dbW2ihlJKJCoF5FD7K/P9SLlYksxvLQJtz5KlpOLusb/tDJrB3T8NgqA5n4z7r62Y5czyv387OXw9WbmCjFf5s7MKwmP8zMkK8fDRa7dP0C/kJZkJKCZPly9lq54lITs6EdDz1uw5AsLokYapirCAI2iC72aOpjxnnrK1MwE9r/sMwwiu5mjK4AlmUegdkKp5x29YSsJbTgX0vM+qB1F0HneiUtoVDyJ7dSyg531UahQBnu+t3dKsVNmovmv5Et4qnKewcS1dSjCqbhDF1rV0JxaVDaJzS/HLrCrPRrVdi/bDpCL3lM9cS3amIvfUd23s/3ipZBBrswpT1lUMYm1WYcq0AnXKu66luqKCQZR1GkLP6xTJ3aGA+ijSb5a2HRtVD3fmD9s28SqFWQ8iu4Mo3l0LdMfQqjoFp+GnbAKrNQ1s5VqeDHoW1SmwF9fiZPBiMTtcI5/7Eov+d012vrdsLU7T+umZE9YSNc6yaY842gos1mhjeM2Lb0dAXTGIYzZ2pqncuxYklzc7ukbV0Rh+M7fifsPStRwarOyh5JtrMTS82dCmbOpaDA02PLcaa9IUC9q0BhlDHRaMfsH6p2Cy6m5Gm25vUszTC9r7tF1rtSiWoTRPCQMr0tNwHymW1o5ypqIevq/BfqTkT7v4WKgm0HghFop0Dy/rB0HGOaW/dyyiy9MZslEkD2u8hZIFnrZT1+8T1Aeq3fGuXRc/cd5N3RofbSuC1v2SEJgZ8HrvmMgleoabJmmggX2S9y/rZcrHo3jM6iLDRxViMwn5Afugt+x3qR6FIXNS1gK9JzXMYKBdtrnK1mnA9MXuYV7hr8JuSvtmCxGdUstVaeyftl3u6Sh09KtjtBChEeIeM81/kb7OvDXzuyeRroZZWS165/Sa7zyxnqadRtfzNfLZMxMJ+Q73kECTJtG67pr9HbrCTPN2HyORCZmpZi0Az48RDHS5B4WcpkMTVSOQikb7EE08ua3TElg9bpIOhgbSCdbuYTSRLK3LhV0iA4OTJui8qNbqanaYK92bQTv9BrlS9DO0Dj7P99y0Y49W5K3yXg06nO9WQgNlilWl3od2luanV/fadYj1iQ2UqVogn7HXapr89zTWxSDQM8igLAMd7dae1tGYHK2if3C09A+DLaKP3WqHOouv8W21Z/Z9/a7k4ldKp6BAIB+h9Q21BXEaM1OgqLx09X6BYLCmuEVbTaVZQgyf8ipd2g74OFuY/yNM2zDXHwGODyqWNohYtykl93aB2wshbljkDWKR1HrpYzTand0tOTOFPzLbh+zeQVwgEt0rLWGRyOxLZqAG4JHBGWSr00IHVUuHatAG6cQ2Q0RA+AzTjHP24BeqFByXlbBgodD47uIkkJhfaMOtogBRLCu7LZuewW6yz11tXK8HFuE20NPNdQ8ZL1iDVdptQ4csfwlf/bPxBea/YkPzQc8/3w+VtDsUvZBCGyrQSlg8vz1YxUwwmfwXFbo4I1yNuJBSCt74KF76UdoxVVjH8Irpor9/XxR/OfPF+/5tW6poYF7WMdXGcuvEoLSE7o/E4miShCRh7SEJ8yVEptacU16XlrKHDihtD8tZfAeU92nqXJV4iS65p5ewXocq8ym/t8CGvF2TG+x5RE2PytyjTQ7oKBbFcEjp2jZW5wrvS7QpLK2E6GhiJc7P/X2ZeZQuFEZHhCciGts+/NVcQYzdn5YubcMmuXuqAQKONq3n5F8auUGF6jyTmqGsC4zvaX+lkwSYnI3tOLLzt09xGhXJUT9ocCKYj1Dj8rL+OnUIRONgbEKDcYufAnbAvz5QArZNzq2Dj0txvbS+L98GruR6W34kw3HL/77hOpkS/3DL8Oib1bKrJS641+7+XEudCMm6b53i2rXZ6c3Uzy3lwPgOt6ynn8bHETggreJ0LX7CwcCliA79Nl7KZnvfjdRvNBkk/0Bua/bcwmlnkJ/Ix4UrEL8PTK+5hs1u+FDMcDLcjUCcLyYHLuI+8t20R5ZuT+aih7V229bFIyEZTOXDcrcfTqZh2Ax+bHh60XU4mC6G+92y4Z+Okvy1idfYbEn4YbgCLwAxQuvIO+ubHoSRSimIR5vPWcrnZhTz5E8k43d6Hp+zHMdWL1AEscZptnzbBNfk/StkBUZnmVM6Xx6uUFPV+CzZg7z/N+GhknvoWWP4UMa58cWUiAR+s1fZpy/E6JGjuDNfG/LBjiboRxXePw9iqdV0Ni6IBdAap37V9+uD/6mR0coNAJqqy6APBb+yVIZExrzNYN/O7VR+jmka9KMnyJeSmMdMryO0dP9t5mdnvJcjPPH7D8mzjverxaDe+hp5X/E1aT37A0nA/O7NN0rerd2gBjdFt8n0dPIdlvQ7MxdbHJNjD7fA5u/lBYu1u2/pJNu45fvvirQ2R1POZ087r5Hj7yEBU9/fe9rbveXvpE+nvVjV4fNkXIjDeGG5J9DY9jZ+HcT7JtnU2+4L1O7jcgRBEARBEARBEARBEARBEARBEARBEARBEARBEARBEMT/gv8ASv+POl2PrTkAAAAASUVORK5CYII=" width="40" class="rounded-image" alt="avatar"/>`;
    //   }
    //   htmlContent += `<div class="d-flex flex-column ml-2"><span class="name">${comment.user.username}</span>`;
    //   htmlContent += `<small class="comment-text pb-1">${comment.comment}</small>`;
    //   for (let linkIndex = 0; linkIndex < comment.links.length; linkIndex++) {
    //     htmlContent += `<img src="${comment.links[linkIndex]}" class="pb-1" style="max-width: 300px;" alt=""/>`;
    //   }
    //   htmlContent += ` </div></div>`;
    // }

    htmlContent += `<div class='like-comment'>`;
    htmlContent += `<div>`;
    if (message.totalLike) {
      htmlContent += `<div class='form-like'>`;

      htmlContent += `<img class='j1lvzwm4' height='18' role='presentation' src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" width='18'/>`;
      htmlContent += `<span> ${message.totalLike} </span>`;
      htmlContent += `</div>`;
    } else {
      htmlContent += `<div class='form-like'>`;
      htmlContent += ``;

      htmlContent += `</div>`;
    }
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
      htmlContent += `<span class='likes'>`;
      htmlContent += `<i data-visualcompletion='css-img' class='hu5pjgll op6gxeva colorLike' style='background-image: url(&quot;https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/xiGk4dAS60k.png&quot;); background-position: 0px -253px; background-size: auto; width: 18px; height: 18px; background-repeat: no-repeat; display: inline-block;'></i> Thích`;
      htmlContent += `</span>`;
    } else {
      htmlContent += `<span>`;
      htmlContent += `<i data-visualcompletion='css-img' class='hu5pjgll m6k467ps colorLike' style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/xiGk4dAS60k.png');background-position:0 -272px;background-size:auto;width:18px;height:18px;background-repeat:no-repeat;display:inline-block"></i> Thích`;
      htmlContent += `</span>`;
    }
    htmlContent += `</button>`;
    htmlContent += `<button class="comment" data-message-id="${message.messageId}"><i data-visualcompletion='css-img' class='hu5pjgll m6k467ps' style="background-image:url('https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/Z7CRdrrbx1y.png');background-position:0 -234px;background-size:auto;width:18px;height:18px;background-repeat:no-repeat;display:inline-block"></i> Bình luận (${message.totalComment})</button>`;
    htmlContent += `</div>`;

    htmlContent += `<div id="comments-${message.messageId}" class="comments" data-message-id="${message.messageId}" >`;
    htmlContent += `<div class="d-flex flex-row mb-2" >`;
    htmlContent += `<div class="show-author-comments">`;
    htmlContent += `<div class="comment-text${message.messageId}" id="comment-text"></div>`;
    htmlContent += `</div></div></div>`;

    htmlContent += `<div class="inputWithIcon">`;
    htmlContent += `<input placeholder="Add a comment..." data-message-id="${message.messageId}" required/>`;
    htmlContent += `<svg aria-label="Emoji" class="_8-yf5" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>`;
    htmlContent += `</div></div>`;

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
