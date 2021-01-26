const cloudinary = require("cloudinary");
require("dotenv").config();
const { App } = require("@slack/bolt");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const bot = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
  // Start the app
  await bot.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

const cache = {};
bot.event("app_mention", async ({ event, client }) => {
  let imgUrl = "";
  let arr = [];

  await cloudinary.v2.api.resources(
    { max_results: 50 },
    function (error, result) {
      arr = result.resources;
    }
  );

  while (imgUrl === "") {
    const idx = Math.floor(Math.random() * 20);
    if (cache[arr[idx].asset_id] !== 1) {
      imgUrl = arr[idx].url;
      cache[arr[idx].asset_id] = 1;
      break;
    } else {
      continue;
    }
  }

  try {
    await client.chat.postMessage({
      channel: event.channel,
      text: "New Yorker Cartoon",
      attachments: [{ image_url: imgUrl, text: "Cartoon 👇" }],
    });
  } catch (e) {
    console.log(`error responding ${e}`);
  }
});
