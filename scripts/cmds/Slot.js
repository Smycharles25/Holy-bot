module.exports = {
  config: {
    name: "slot",
    aliases: ["slots", "🎰"],
    version: "1.0",
    author: "Samy Charles",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Quay slot kiếm tiền",
      en: "Play slot machine to win money"
    },
    longDescription: {
      vi: "Quay máy đánh bạc với các biểu tượng vui nhộn",
      en: "Spin the slot machine with funny icons"
    },
    category: "game",
    guide: {
      vi: "{pn} [montant]",
      en: "{pn} [amount]"
    }
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { getMoney, addMoney, deductMoney } = usersData;

    const userMoney = await getMoney(event.senderID);
    const bet = parseInt(args[0]) || 1000;

    if (isNaN(bet) || bet <= 0) {
      return message.reply("❌ Entre un montant valide pour parier !");
    }

    if (bet > userMoney) {
      return message.reply("💸 Tu n'as pas assez d'argent pour parier ce montant !");
    }

    // Table des symboles
    const symbols = ["🍒", "🍋", "🍇", "🍀", "💎", "💀"];
    const reels = [];

    for (let i = 0; i < 3; i++) {
      reels.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    const [s1, s2, s3] = reels;

    let resultText = `🎰 | ${s1} | ${s2} | ${s3} |\n\n`;
    let win = 0;

    if (s1 === s2 && s2 === s3) {
      // Jackpot
      switch (s1) {
        case "🍒": win = bet * 2; break;
        case "🍋": win = bet * 3; break;
        case "🍇": win = bet * 4; break;
        case "🍀": win = bet * 5; break;
        case "💎": win = bet * 10; break;
        case "💀": win = -bet; break;
      }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      win = bet; // Récupère la mise
    } else {
      win = -bet;
    }

    if (win > 0) {
      await addMoney(event.senderID, win);
      resultText += `🎉 Tu as gagné ${win}$ !`;
    } else if (win === 0) {
      resultText += `😐 Match partiel... Tu récupères ta mise (${bet}$).`;
    } else {
      await deductMoney(event.senderID, bet);
      resultText += `😢 Tu as perdu ${bet}$ !`;
    }

    return message.reply(resultText);
  }
};
