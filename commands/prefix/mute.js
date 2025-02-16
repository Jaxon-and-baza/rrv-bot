const { PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'mute',
  description: 'Mute a member with a reason for a specified time',
  async execute(message, args) {
    // Check if the user has administrator permissions
    if (!message.member.role)

    // Check if there are enough arguments (user mention and time)
    if (args.length < 2) {
      return message.channel.send('Please specify a user to mute and a time (e.g., "mute @user 10m").');
    }

    // Extract the target user and time from arguments
    const target = message.mentions.members.first();
    const time = args[1]; // The second argument should be time (e.g., 10m, 1h, etc.)
    const reason = args.slice(2).join(' ') || 'No reason provided';

    // Validate the target user
    if (!target) {
      return message.channel.send('Please mention a valid user.');
    }

    // Convert the time into milliseconds
    const muteDuration = ms(time);
    if (!muteDuration) {
      return message.channel.send('Please provide a valid time format (e.g., 10m, 1h, etc.).');
    }

    // Timeout the user (mute them temporarily)
    try {
      await target.timeout(muteDuration, reason); // Timeout user for the specified duration with a reason

      // Send a DM to the user informing them of the mute
      try {
        await target.send(`You have been muted in ${message.guild.name} for the following reason: ${reason}. You will be unmuted in ${time}.`);
      } catch (err) {
        console.error(`Could not send DM to ${target.user.tag}.`);
      }

      // Notify the channel about the mute
      message.channel.send(`${target.user.tag} has been muted for ${time} for: ${reason}.`);

    } catch (err) {
      console.error(`Error muting ${target.user.tag}:`, err);
      message.channel.send('There was an error muting the user.');
    }
  },
};