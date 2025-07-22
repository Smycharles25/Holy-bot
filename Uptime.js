module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    author: "samycharles",
    countDown: 2,
    role: 0,
    shortDescription: {
      fr: "Affiche le temps d'activité du bot"
    },
    longDescription: {
      fr: "Affiche depuis combien de temps le bot tourne"
    },
    category: "📊 Statistiques",
    guide: {
      fr: "{pn}"
    },
    priority: 1
  },

  onStart: async function ({ message }) {
    const totalSeconds = process.uptime();
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    const format = (n) => (n < 10 ? "0" + n : n);

    const uptimeMsg = `
⌾
╭─⌾⏰𝗨𝗣𝗧𝗜𝗠𝗘⏰⌾
│🌸 𝙅𝙤𝙪𝙧𝙨  : ${format(days)} ☀️
│🌙 𝙃𝙚𝙪𝙧𝙚𝙨 : ${format(hours)} 🌼
│🌺 𝙈𝙞𝙣𝙪𝙩𝙚𝙨 : ${format(minutes)} 🐾
│🍡 𝙎𝙚𝙘𝙤𝙣𝙙𝙚𝙨 : ${format(seconds)} 🎀
╰───────⌾

👑 𝐐𝐮𝐞𝐞𝐧 𝐍𝐚𝐲𝐢𝐫𝐚 💫
✨ samycharles 
`;

    await message.reply(uptimeMsg);
  }
};
