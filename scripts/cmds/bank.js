const fs = require('fs'); const path = __dirname + "/bankData.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

function getBankAll() { return JSON.parse(fs.readFileSync(path)); }

function saveBankAll(data) { fs.writeFileSync(path, JSON.stringify(data, null, 2)); }

module.exports = { config: { name: "bank", version: "2.0", author: "Samy Charles", countDown: 3, role: 0, shortDescription: { en: "Bank system complete" }, longDescription: { en: "Deposit, withdraw, credit, transfer and more." }, category: "economy", guide: { en: ".bank [solde | déposer | retirer | transfert | top | info | stats | auto | crédit | rembourser | transactions | riches]" } },

onStart: async function ({ args, message, event, usersData, api }) { const senderID = event.senderID; const mention = Object.keys(event.mentions)[0]; const data = getBankAll(); if (!data[senderID]) data[senderID] = { money: 0, credit: 0, creditTime: 0, history: [] }; const userBank = data[senderID]; const userMoney = await usersData.get(senderID, "money"); const cmd = (args[0] || '').toLowerCase(); const amount = parseInt(args[1]);

function stylizedTitle(text) {
  return `⛧━━━━━━ ⟡ ${text.toUpperCase()} ⟡ ━━━━━━⛧`;
}

function formatMoney(m) {
  return m.toLocaleString() + "$";
}

function save() {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function logTransaction(uid, content) {
  if (!data[uid].history) data[uid].history = [];
  data[uid].history.unshift(`📅 ${new Date().toLocaleString()} → ${content}`);
  if (data[uid].history.length > 10) data[uid].history = data[uid].history.slice(0, 10);
}

if (!cmd || cmd === "solde") {
  const reply = `

${stylizedTitle("𝕊𝔸𝕄𝕐 𝔹𝔸ℕ𝕂")} 👤 Utilisateur : @${event.senderID} 👜 Argent sur toi : ${formatMoney(userMoney)} 🏦 En banque : ${formatMoney(userBank.money)} 🔗 Total : ${formatMoney(userMoney + userBank.money)}

📥 .bank déposer [montant] 📤 .bank retirer [montant] 🔁 .bank transfert [uid] [montant] 🏆 .bank top 💳 .bank crédit [montant] 💸 .bank rembourser 📈 .bank transactions 💎 .bank riches `; return message.reply(reply); }

if (cmd === "déposer") {
  if (!amount || isNaN(amount) || amount <= 0) return message.reply("Montant invalide.");
  if (userMoney < amount) return message.reply("Tu n'as pas assez d'argent.");
  userBank.money += amount;
  await usersData.set(senderID, { money: userMoney - amount });
  logTransaction(senderID, `Dépôt de ${formatMoney(amount)}`);
  save();
  return message.reply(`✅ Tu as déposé ${formatMoney(amount)}. Nouveau solde en banque : ${formatMoney(userBank.money)}`);
}

if (cmd === "retirer") {
  if (!amount || isNaN(amount) || amount <= 0) return message.reply("Montant invalide.");
  if (userBank.money < amount) return message.reply("Pas assez d'argent en banque.");
  userBank.money -= amount;
  await usersData.set(senderID, { money: userMoney + amount });
  logTransaction(senderID, `Retrait de ${formatMoney(amount)}`);
  save();
  return message.reply(`✅ Tu as retiré ${formatMoney(amount)}. Solde en banque restant : ${formatMoney(userBank.money)}`);
}

if (cmd === "transfert") {
  const uid = args[1];
  const transferAmount = parseInt(args[2]);
  if (!uid || !transferAmount || isNaN(transferAmount) || transferAmount <= 0) return message.reply("Utilisation : .bank transfert [uid] [montant]");
  if (!data[uid]) data[uid] = { money: 0, credit: 0, creditTime: 0, history: [] };
  if (data[senderID].money < transferAmount) return message.reply("Fonds insuffisants dans ta banque.");
  data[senderID].money -= transferAmount;
  data[uid].money += transferAmount;
  logTransaction(senderID, `Transfert de ${formatMoney(transferAmount)} à ${uid}`);
  logTransaction(uid, `Reçu ${formatMoney(transferAmount)} de ${senderID}`);
  save();
  return message.reply(`✅ Transfert de ${formatMoney(transferAmount)} réussi à ${uid}.`);
}

if (cmd === "top" || cmd === "riches") {
  const top = Object.entries(data)
    .sort((a, b) => b[1].money - a[1].money)
    .slice(0, 5);
  let msg = `${stylizedTitle("𝕋𝕆ℙ 𝔹𝔸ℕℚ𝕌𝔼")}

; for (let i = 0; i < top.length; i++) { const [uid, info] = top[i]; const name = await usersData.getName(uid); msg += 🥇 ${i + 1}. ${name} → ${formatMoney(info.money)}\n`; } return message.reply(msg); } } };

