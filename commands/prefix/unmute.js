const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute a member',
  async execute(message, args) {
    // Check if the user has administrator permissions
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.channel.send('You do not have permission to unmute members.');
    }

    // Check if there are enough arguments (user mention)
    if (args.length < 1) {
      return message.channel.send('Please specify a user to unmute (e.g., "unmute @user").');
    }

    // Extract the target user from the arguments
    const target = message.mentions.members.first();

    // Validate the target user
    if (!target) {
      return message.channel.send('Please mention a valid user.');
    }

    // Remove the timeout (unmute the user)
    try {
      await target.timeout(null); // Remove the timeout
      message.channel.send(`${target.user.tag} has been unmuted.`);
      
      // Optionally, send a DM to the user informing them they are unmuted
      try {
        await target.send(`You have been unmuted in ${message.guild.name}.`);
      } catch (err) {
        console.error(`Could not send DM to ${target.user.tag}.`);
      }
    } catch (err) {
      console.error(`Error unmuting ${target.user.tag}:`, err);
      message.channel.send('There was an error unmuting the user.');
    }
  },
};