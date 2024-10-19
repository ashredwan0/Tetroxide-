const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "midjourney",
    aliases: ["open journey", "mj"],
    author: "Redwan", // Correct author name
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image based on a prompt.",
    longDescription: "Generates an image using the provided prompt.",
    category: "ai",
    guide: "{p} midjourney <type> <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const obfuscatedAuthor = String.fromCharCode(82, 101, 100, 119, 97, 110); // "Redwan"
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("❌ | You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("❌ | You need to provide a prompt.", event.threadID, event.messageID);
    }

    api.sendMessage("✨ | Please hold on, your mesmerizing image is being crafted...", event.threadID, event.messageID);

    try {
      const redwanapisApiUrl = `https://global-redwan-apis.onrender.com/midjourney?prompt=${encodeURIComponent(prompt)}`;

      const redwanapisResponse = await axios.get(redwanapisApiUrl, {
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(redwanapisResponse.data));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "✨| Your stunning MidJourney image is ready to behold!",
        attachment: stream
      });
    } catch (error) {
      console.error("🌌 | Oops! Something went awry while generating your masterpiece:", error.message || error);
      message.reply("❌ | An unexpected error occurred. Please try again later.");
    }
  }
};
