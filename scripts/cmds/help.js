const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "👑 𝐐𝐮𝐞𝐞𝐧 𝐍𝐚𝐲𝐢𝐫𝐚 💫 - 𝓢𝓪𝓶𝔂𝓬𝓱𝓪𝓻𝓵𝓮𝓼\n";

function formatFont(text) {
  const fontMapping = {
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
    N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗", 0: "𝟎"
  };
  return text.split('').map(char => fontMapping[char.toUpperCase()] || char).join('');
}

function formatFonts(text) {
  const fontList = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    1: "𝟷", 2: "𝟸", 3: "𝟹", 4: "𝟺", 5: "𝟻", 6: "𝟼", 7: "𝟽", 8: "𝟾", 9: "𝟿", 0: "𝟶"
  };
  return text.split('').map(char => fontList[char.toLowerCase()] || char).join('');
}

module.exports = {
  config: {
    name: "help",
    version: "1.20",
    author: "👑 Samycharles-sama 🌸",
    countDown: 9,
    role: 0,
    shortDescription: {
      fr: "📚 Voir la liste et l'utilisation des commandes"
    },
    longDescription: {
      fr: "🌟 Accède à la liste royale des commandes de 𝐐𝐮𝐞𝐞𝐧 𝐍𝐚𝐲𝐢𝐫𝐚 💫"
    },
    category: "📖 Informations",
    guide: {
      fr: "{pn} [nom_commande]"
    },
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = await getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = `🌸 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒖𝒆 𝒅𝒂𝒏𝒔 𝒍𝒂 𝑺𝒂𝒍𝒍𝒆 𝒅𝒆𝒔 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒆𝒔 𝑹𝒐𝒚𝒂𝒍𝒆𝒔 👑\n`;

      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "🔮 Aucune catégorie";
        if (!categories[category]) {
          categories[category] = { commands: [] };
        }
        categories[category].commands.push(name);
      }

      Object.keys(categories).sort().forEach(category => {
        const formattedCategory = formatFont(category.toUpperCase());
        msg += `\n👑 〘 ${formattedCategory} 〙\n`;

        const names = categories[category].commands.sort();
        for (let i = 0; i < names.length; i++) {
          const formattedCmd = formatFonts(names[i]);
          msg += `🌺 ➤ ${formattedCmd}\n`;
        }

        msg += `🌸━━━━━━━━━━━━━━━\n`;
      });

      const totalCommands = commands.size;
      msg += `\n✨ 𝓒𝓸𝓶𝓶𝓪𝓷𝓭𝓮𝓼 𝓽𝓸𝓽𝓪𝓵𝓮𝓼 : ${totalCommands}\n`;
      msg += `📖 Tape ( ${prefix}help nom_commande ) pour plus d'infos\n`;
      msg += `🫧 Groupe support : ${prefix}supportgc\n`;
      msg += `\n🩵 Merci d'utiliser 𝐒𝐚𝐦𝐲 💫, version royale !\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `👑 ${doNotDelete}`;
      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Commande "${commandName}" introuvable, Senpai...`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "❓ Inconnu";

        const longDescription = configCommand.longDescription?.fr || "🌙 Aucune description disponible";
        const guideBody = configCommand.guide?.fr || "📖 Aucune guide pour cette commande.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `🌸── 🌟 𝐈𝐧𝐟𝐨 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐞 🌟 ──🌸
📌 𝐍𝐨𝐦 : ${configCommand.name}
💬 𝐃𝐞𝐬𝐜 : ${longDescription}
✨ 𝐀𝐥𝐢𝐚𝐬 : ${configCommand.aliases ? configCommand.aliases.join(", ") : "Aucun"}
⚙️ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : ${configCommand.version || "1.0"}
🎀 𝐑𝐨̂𝐥𝐞 : ${roleText}
⏳ 𝐓𝐞𝐦𝐩𝐬 𝐝'𝐚𝐭𝐭𝐞𝐧𝐭𝐞 : ${configCommand.countDown || 2}s
👑 𝐀𝐮𝐭𝐞𝐮𝐫𝐞 : ${author}

📚 𝐔𝐭𝐢𝐥𝐢𝐬𝐚𝐭𝐢𝐨𝐧 :
${usage}

📝 Notes kawaii :
- 🌼 <...> signifie "à personnaliser"
- 🌸 [a|b|c] = choisir une option

━━━━━━━━━━━━━━━💖`;

        await message.reply(response);
      }
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "🌟 Tous les utilisateurs";
    case 1: return "🛡️ Admins du groupe";
    case 2: return "👑 Admins du bot";
    default: return "❓ Rôle inconnu";
  }
    }
