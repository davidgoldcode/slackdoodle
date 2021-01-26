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
  // To add into slackbot
  let imgUrl = "";
  let arr = [];

  await cloudinary.v2.api.resources(function (error, result) {
    arr = result.resources;
  });

  for (let i = 0; i < arr.length; i++) {
    console.log(cache);
    console.log(cache[arr[i].asset_id] !== 1);
    if (cache[arr[i].asset_id] !== 1) {
      imgUrl = arr[i].url;
      cache[arr[i].asset_id] = 1;
      console.log("why are you here");
      break;
    } else {
      continue;
    }
  }

  console.log("cache", cache);

  try {
    await client.chat.postMessage({
      channel: event.channel,
      text: "Doodle",
      attachments: [{ image_url: imgUrl, text: imgUrl }],
    });
  } catch (e) {
    console.log(`error responding ${e}`);
  }
});
