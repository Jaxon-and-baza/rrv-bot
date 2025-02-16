const { Client, CommandInteraction, Message } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a member from the server",
  async execute(message, args) {
    // Check if the user has permission to kick members
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.reply("You don't have permission to kick members.");
    }

    // Get the member to be kicked
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Please mention a member to kick.");
    }

    // Check if the member is kickable
    if (!member.kickable) {
      return message.reply("I cannot kick this member.");
    }

    // Kick the member
    try {
      await member.kick(args.slice(1).join(" ") || "No reason provided");
      message.channel.send(`${member.user.tag} has been kicked.`);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred while trying to kick this member.");
    }
  },
};
