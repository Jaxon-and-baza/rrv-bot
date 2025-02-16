const { Client, CommandInteraction, Message } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a member from the server",
  async execute(message, args) {
    // Check if the user has permission to ban members
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have permission to ban members.");
    }

    // Get the member to be banned
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Please mention a member to ban.");
    }

    // Check if the member is bannable
    if (!member.bannable) {
      return message.reply("I cannot ban this member.");
    }

    // Ban the member
    try {
      await member.ban({ reason: args.slice(1).join(" ") || "No reason provided" });
      message.channel.send(`${member.user.tag} has been banned.`);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while trying to ban this member.");
    }
  },
};
