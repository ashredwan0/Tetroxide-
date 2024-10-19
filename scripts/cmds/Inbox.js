module.exports = {
  config: {
    name: "inbox",
    aliases: ["inboxme", "in"],
    version: "1.0",
    author: "anchestor",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: ""
    },
    category: "fun",
    guide: {
      en: ""
    }
  },
  langs: {
    en: {
      gg: ""
    },
    id: {
      gg: ""
    }
  },
  onStart: async function({ api, event, args, message }) {
    try {
      const query = encodeURIComponent(args.join(' '));
      message.reply("☑ |✦ 𝗱𝗲𝗸𝗵 𝗶𝗻𝗯𝗼𝘅 𝗲 𝗴𝘂𝘁𝗮 𝗱𝗶𝘀𝗶\n𝗜𝗻𝗯𝗼𝘅 𝗰𝗵𝗲𝗰𝗸 𝗱𝗲", event.threadID);
      api.sendMessage("👀 |✦ 𝗸𝗶𝗿𝗲 𝗯𝗼𝗸𝗮𝗰𝗵𝗼𝗱𝗮", event.senderID);
    } catch (error) {
      console.error("Error bro: " + error);
    }
  }
};
