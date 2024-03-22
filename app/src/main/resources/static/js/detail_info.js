// 이미지를 통한 개별 information을 modal창으로 가져오기
$('.test').on('click', '*', function (e) {
    let closestElement = e.target.closest('.col-lg-3');
    detailModalAniInfo(closestElement.id);
});

$(document).on('click', function (event) {
    if ($(event.target).closest('#modalstyle').length === 0 && !$(event.target).is('#modalstyle')) {
        $('#modalstyle').attr("hidden", true);

        $('#modal_left').empty();
        $('#modal_right').empty();
    }
});
/*********
$('#modal_right').on('click', 'button', function (e) {
    let aniPk;
    let score;
    let content;

    // anipk, score, content 구하기
    aniPk = '743927e1-1c03-40f9-a524-f3f51c2c31f6';
    score = '5';
    content = '후기!!';

    writeCompleteComment(aniPk, score, content);
});
 ***********/
function detailModalAniInfo(aniPk) {
    $.ajax({
        url: 'DetailInfo/ani_detail?aniPk=' + aniPk,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        dataSrc: '',
        error: function (error, status, msg) {
            alert("상태코드 " + status + " 에러메시지 " + msg);
        },
        success: function (data) { // {aniDetail: { // }, commentList: [{}, {}, {}]}
            console.log(aniPk);
            console.log(data);

            var grade = parseFloat(data.aniDetail.grade);

            var imgLink = data.aniDetail.imgUrl;
            var videoLink = data.aniDetail.videoUrl;

            var imgHtml = '<img src="' + imgLink + '">';
            var iframeHtml = videoLink ? '<iframe src="' + videoLink + '" frameborder="0" allowfullscreen></iframe>' : '';

            var commentHtml = '';
            for (var i=0; i< data.commentList.length; i++) {
                commentHtml +=               
                `<tr><td class="content_comment" id="comment_day">${data.commentList[i].commentDate}</td>
                <td class="content_comment" id="comment_id">${data.commentList[i].userPk}</td>
                <td class="content_comment" id="comment_text">${data.commentList[i].content}</td>
                <td class="content_comment" id="comment_rate">${data.commentList[i].initGrade}</td></tr>`
            }

            // 모달 열기
            $('#modalstyle').removeAttr("hidden");

            // 모달 내용 채우기
            $('.modal_body').css('display', 'flex').css('visibility', 'visible');
            if ($('.modal_thumbnail').length === 0) {
                $('#modal_left').append(
                    `<div class="modal_thumbnail">` +
                    (iframeHtml ? iframeHtml : imgHtml) +`</div>`+ // 유튜브 링크가 있을 경우 iframe, 없을 경우 이미지 표시
                    `<div class="infoShort"><div id="releaseDate">${data.aniDetail.startDate}</div>` +
                    `<div id="titleInfo" title="${data.aniDetail.title}">${data.aniDetail.title}</div>` +
                    `<div id="rate"><ul><li><i class="fa fa-star" id="gstar"></i>&nbsp;${grade}</li></ul></div></div>` +
                    `<article id="introduction"><p>${data.aniDetail.detail}</p></article>`
                );

                $('#modal_right').append(
                    `<fieldset id="comment"><br><legend><h3>평론</h3></legend>` + 
                    `<table id="comment_table">
                        <tr>
                            <th class="comment_head" id="comment_day">날짜</th>
                            <th class="comment_head" id="comment_id">닉네임</th>
                            <th class="comment_head" id="comment_text">내용</th>
                            <th class="comment_head" id="comment_rate">평점</th>
                        </tr>
                        ${commentHtml}
                    </table>
                    <button id="write_cmt" onclick="showWriteComment()">댓글 쓰기</button>
                    </fieldset>
                    <fieldset id="commentWrite">평가 작성하기
                        <div id="comment_info">
                            <div class="write1" id="userId">
                                <input placeholder="닉네임" />
                            </div>
                            <div class="write1" id="star-rating">
                                <input type="radio" placeholder="별점" />
                                <input id="score" placeholder="평점" />
                            </div>
                        </div>
                        <textarea id="comment_context" placeholder="평가를 남겨주세요"></textarea>
                        <button type="button" onclick="writeCompleteComment()">댓글 등록</button>
                    </fieldset>`
                    // `<td id="comment_day">${data.commentDate}</td>` +
                    // `<td id="comment_id">${data.commentId}</td>` +
                    // `<td id="comment_text">${data.commentText}</td>` +
                    // `<td id="comment_rate">${data.commentRate}</td>`
                );
            }
        }
    });
}

function showWriteComment() {
    const commentOpen = document.querySelector("#commentWrite");
    commentOpen.style.visibility = 'visible';
}

function writeCompleteComment(aniPk, score, comment) {
    // console.log(aniPk);
    // console.log(score);
    // console.log(comment);
    $.ajax({
        url: 'DetailInfo/insertComment',
        type: 'POST',
        data: {
            aniPk: aniPk,
            initGrade: score,
            content: comment            
        },
        error: function (error, status, msg) {
            alert("상태코드 " + status + " 에러메시지 " + msg);
        },
        success: function (data) { // {aniDetail: { // }, commentList: [{}, {}, {}]}
            console.log(aniPk);
            console.log(data);

            var grade = parseFloat(data.aniDetail.grade);

            var imgLink = data.aniDetail.imgUrl;
            var videoLink = data.aniDetail.videoUrl;

            var imgHtml = '<img src="' + imgLink + '">';
            var iframeHtml = videoLink ? '<iframe src="' + videoLink + '" frameborder="0" allowfullscreen></iframe>' : '';

            var commentHtml = '';
            for (var i=0; i< data.commentList.length; i++) {
                commentHtml +=               
                `<tr><td class="content_comment" id="comment_day">${data.commentList[i].commentDate}</td>
                <td class="content_comment" id="comment_id">${data.commentList[i].userPk}</td>
                <td class="content_comment" id="comment_text">${data.commentList[i].content}</td>
                <td class="content_comment" id="comment_rate">${data.commentList[i].initGrade}</td></tr>`
            }            
        }
    });
    
}