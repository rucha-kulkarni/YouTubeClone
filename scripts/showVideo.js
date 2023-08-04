
const API_KEY = `AIzaSyAk-DFpd_s3aNgm9GRkmY0UTlTjKSMoI_4`;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const video_container = document.getElementById("yt-video");
const videoId = localStorage.getItem("videoId");
const commentsContainer = document.getElementById("comments");
video_container.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
let numberOfComments;
async function getComments() {
  const url = `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=80&order=time&part=snippet`;
  const response = await fetch(url, {
    method: "get",
  });
  const data = await response.json();

  const comments = data.items;
  numberOfComments = comments.length;
  const commentCount = document.getElementById("commentCount");
  commentCount.innerText = `${numberOfComments} comments`;
  renderComments(comments);
}

async function getVideoDetails() {
  const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
  const response = await fetch(url, { method: "get" });
  const data = await response.json();
  const items = data.items[0];
  renderData(items);
}
function renderData(items) {
  const vedioName = document.getElementById("vedio-name");
  let like = items.statistics.likeCount;
  if (like > 1000) {
    like = like % 100;
  }
  const logo = items.snippet.thumbnails.high.url;
  vedioName.innerText = `${items.snippet.localized.title}`;
  const details = document.getElementById("details");
  details.innerHTML = `<div class="avatar"><span class="material-symbols-outlined">
account_circle
</span></div>
  <div class="chanel-details">
    <h3 class="chanel-name">${items.snippet.channelTitle}</h3>
    <p class="subscribers-count">129k subscribers</p>
  </div>
  <button class="join">join</button>
  <button style="color: black; background: white">subscribe</button>
  <div class="icons">
    <div>
      <span class="material-symbols-outlined"> thumb_up </span>${like}k
      |
      <span class="material-symbols-outlined"> thumb_down </span>
    </div>
    <div>
      <span class="material-symbols-outlined"> send </span>share
    </div>
    <div>
      <span class="material-symbols-outlined">
        vertical_align_bottom </span
      >download
    </div>
    <div>
      <span class="material-symbols-outlined"> more_horiz </span>
    </div>
  </div>`;
}

function renderComments(comments) {
  console.log(comments);
  commentsContainer.innerHTML = "";
  comments.forEach((comment) => {
    let likecount = comment.snippet.topLevelComment.snippet.likeCount;

    commentsContainer.innerHTML += `
    <div class="comment-flex">
    <img src="${
      comment.snippet.topLevelComment.snippet.authorProfileImageUrl
    }" alt="userProfile" />
    <div class="comment-details">
      <p>@${comment.snippet.topLevelComment.snippet.authorDisplayName}</p>
      <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
      <div class="clasLike">
      <span class="material-symbols-outlined"> thumb_up </span>
      <span class="like" >${likecount > 0 ? likecount : ""}</span>
      <span class="material-symbols-outlined"> thumb_down </span>
      </div>
    </div>
  </div>
      `;
  });
}
getVideoDetails();
getComments();