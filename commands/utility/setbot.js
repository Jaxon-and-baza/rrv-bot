const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbotappearance')
    .setDescription('Set the bot\'s avatar and banner (Admin only).')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      await interaction.client.user.setAvatar('https://bit.ly/3EPxnm6');
      await interaction.client.user.setBanner('http://bit.ly/42UO7T1');

      const embed = new EmbedBuilder()
        .setDescription('Successfully updated the bot’s avatar and banner.')
        .setColor("#ff3b3b")
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error updating bot appearance:', error);
      return interaction.editReply({
        content: 'Failed to update the bot\'s avatar or banner. Make sure the bot has the correct permissions.',
      });
    }
  },
};
