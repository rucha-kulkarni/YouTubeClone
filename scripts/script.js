
const API_KEY = `AIzaSyAk-DFpd_s3aNgm9GRkmY0UTlTjKSMoI_4`;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const container = document.getElementById("videos-container");
// get api from the google
async function getApi(q) {
  const url = `${BASE_URL}/search?key=${API_KEY}&q=${q}&type=videos&maxResults=20`;
  const response = await fetch(url, { method: "get" });
  const result = await response.json();
  const videos = result.items;
  getVideoId(videos);
}
// video Id from the api
let videoIds = [];
async function getVideoId(videos) {
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const videoId = video.id.videoId;
    videoIds.push(await getVideoDetails(videoId));
  }
  // console.log(videoIds);
  renderVideos(videoIds);
}
async function getVideoDetails(videoId) {
  const url = `${BASE_URL}/videos?key=${API_KEY}&part=snippet,contentDetails,statistics&id=${videoId}`;
  const response = await fetch(url, { method: "get" });
  const data = await response.json();
  return data.items[0];
}
// render the video
function renderVideos(videos) {
  container.innerHTML = ``;
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const thumbnailUrl = video.snippet.thumbnails.high.url;
    let count = video.statistics.viewCount;
    if (count > 1000) {
      count = count % 1000;
    }
    container.innerHTML += `
        <div class="video-info" onclick="openVideoDetails('${video.id}')" >
            <div class="video-image">
              <img src="${thumbnailUrl}" alt="video title" />
            </div>
            <div class="video-description">
              <div class="channel-avatar">
                <img src="${thumbnailUrl}" alt="channel avatar" width="35px"/>
              </div>
              <div class="channel-description">
              <h5 class="video-title">${video.snippet.localized.title}</h5>
                <p class="channel-name">${video.snippet.channelTitle}</p>
                <p class="video-views">${count}k Views</p>
                <p class="video-time">1 week ago</p>
              </div>
            </div>
          </div>
          `;
  }
}

const search = document.getElementById("search");
search.addEventListener("keyup", (e) => {
  let tags = [];
  for (let i = 0; i < videoIds.length; i++) {
    const video = videoIds[i];
    const tagsId = video.snippet.tags;
    if (tagsId) {
      for (let j = 0; j < tagsId.length; j++) {
        tags.push(tagsId[j]);
      }
    }
  }
  let tagsValue = e.target.value;
  let searchLow = tagsValue.toLowerCase();
  let filterTag = tags.filter(function (tag) {
    return tag.toLowerCase().includes(searchLow);
  });
  displayTags(filterTag);
});

// display tags
function displayTags(tags) {
  const tagdiv = document.getElementById("searchElement");
  tagdiv.textContent = "";
  console.log(tags);
  let tagCount = tags.length;
  if (tagCount > 10) {
    tagCount = 10;
  } else {
    tagCount;
  }

  for (let i = 0; i < tagCount; i++) {
    const tagEle = document.createElement("span");
    tagEle.innerText = `${tags[i]}`;
    tagdiv.appendChild(tagEle);
  }
}

function openVideoDetails(videoId) {
  localStorage.setItem("videoId", videoId);
  window.open("showVideo.html","_self");
}
getApi("");