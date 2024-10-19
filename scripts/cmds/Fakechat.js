const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "fakechat",
    aliases: ["fake"],
    author: "Samir Œ /Pikachu Œ",

    countDown: 5,
    role: 0,
    category: "𝗙𝗨𝗡",
    shortDescription: {
      en: "mentioned your friend and write something to get output✍",
    },
  },
  wrapText: async function (ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (const word of words) {
      const currentLine = `${line}${word} `;
      const currentLineWidth = ctx.measureText(currentLine).width;
      if (currentLineWidth <= maxWidth) {
        line = currentLine;
      } else {
        lines.push(line.trim());
        line = `${word} `;
      }
    }

    lines.push(line.trim());
    return lines;
  },

  drawBubbleLayer: function (ctx, x, y, width, height, radius, color) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  },

  onStart: async function ({ args, usersData, threadsData, api, event }) {
    try {
      let pathImg = __dirname + "/cache/background.png";
      let pathAvt1 = __dirname + "/cache/Avtmot.png";
      var id = Object.keys(event.mentions)[0] || event.senderID;
      var name = await api.getUserInfo(id);
      name = name[id].name;
      var ThreadInfo = await api.getThreadInfo(event.threadID);
      
      // Louis Vuitton theme background
      var background = ["https://example.com/louis_vuitton_theme.jpg"];
      var rd = background[Math.floor(Math.random() * background.length)];

      let getAvtmot = (
        await axios.get(
          `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));
      let getbackground = (
        await axios.get(`${rd}`, {
          responseType: "arraybuffer",
        })
      ).data;
      fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));
      let baseImage = await loadImage(pathImg);
      let baseAvt1 = await loadImage(pathAvt1);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Set the font family and color for the text
      ctx.font = "600 23px Arial";
      ctx.fillStyle = "#ffffff"; // White color for the text

      const mentionUser = args[0];
      const commentText = args.slice(args.indexOf("|") + 1).join(" ");

      // Set the black round system for the lower text
      const bubbleX = 145;
      const bubbleY = 100;
      const bubbleWidth = canvas.width - 290;
      const bubbleHeight = canvas.height - 200;
      const bubbleRadius = 10;
      const bubbleColor = "#000000"; // Black color for the round system
      this.drawBubbleLayer(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, bubbleRadius, bubbleColor);

      // Draw the text
      ctx.fillText(commentText, bubbleX + 10, bubbleY + 28);

      // Draw the theme behind the round system
      // Example: Louis Vuitton theme
      // ctx.fillStyle = "#C0C0C0"; // Silver color for the theme
      // ctx.fillRect(bubbleX - 10, bubbleY - 10, bubbleWidth + 20, bubbleHeight + 20);

      // Draw the name text
      ctx.font = "600 18px Arial";
      ctx.fillStyle = "#ffffff"; // White color for the name text
      ctx.fillText(name, bubbleX + 10, bubbleY - 20);

      // Draw the avatar image
      const avatarX = 30;
      const avatarY = 60;
      const avatarWidth = 60;
      const avatarHeight = 60;

      ctx.beginPath();
      ctx.arc(
        avatarX + avatarWidth / 2,
        avatarY + avatarHeight / 2,
        avatarWidth / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(baseAvt1, avatarX, avatarY, avatarWidth, avatarHeight);

      // Adding background image behind the text
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
      fs.removeSync(pathAvt1);
      return api.sendMessage(
        {
          body: " ",
          attachment: fs.createReadStream(pathImg),
        },
        event.threadID,
        () => fs.unlinkSync(pathImg),
        event.messageID
      );
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
      
