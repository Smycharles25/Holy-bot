module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    author: "samycharles",
    countDown: 5,
    role: 0,
    description: "Affiche depuis combien de temps le bot est actif",
    category: "système",
    guide: {
      fr: "{pn} : Affiche l'uptime du bot"
    }
  },

  onStart: async function ({ message }) {
    const time = process.uptime();
    const days = Math.floor(time / (60 * 60 * 24));
    const hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((time % (60 * 60)) / 60);
    const seconds = Math.floor(time % 60);

    const format = (n) => n.toString().padStart(2, '0');

    const msg = 
`╭─⌾🍥🍨 𝙐𝙋𝙏𝙄𝙈𝙀 𝘿𝙀 𝐒𝐚𝐦𝐲 💫 🍣🥡
│☀️ Jours   : ${format(days)}
│🌙 Heures : ${format(hours)}
│🌸 Minutes : ${format(minutes)}
│🎀 Secondes: ${format(seconds)}
╰───────⌾`;

    message.reply(msg);
  }
};
