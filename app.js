const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//create express server
const app = express();

//port of server
const PORT = process.env.PORT || 3000;

//url parser
function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/", async (req, res) => {
  var whole_youtube_url = req.body.videoID;
  // console.log(whole_youtube_url);
  var videoId = await youtube_parser(whole_youtube_url);
  console.log(videoId);
  if (videoId === undefined || videoId === null || videoId === "") {
    return res.render("index", {
      success: false,
      message:
        "Yohohoho! Oops, wrong YouTube ID, matey. Find the real one for music to flow, aye?",
    });
  } else {
    const fetchAPI = await fetch(
      `https://youtube-mp3-download1.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.API_KEY,
          "X-RapidAPI-Host": process.env.API_HOST,
        },
      }
    );
    const fetchResponse = await fetchAPI.json();
    if (fetchResponse.status === "ok") {
      return res.render("index", {
        success: true,
        song_title: fetchResponse.title,
        song_link: fetchResponse.link,
        message:
          "Song retrieved, matey! Enjoy and collect the melody. Yohohoho, cheerio!",
      });
    } else {
      return res.render("index", {
        success: false,
        message:
          "Navigational error, matey! Invalid API request, lost in digital currents. Yohohoho!",
      });
    }
  }
});

//start the server
app.listen(PORT, () => {
  console.log(`Server started On PORT: ${PORT}`);
});
