const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('Add money to a user\'s balance (Admin only).')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to receive the money')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Amount of money to add')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const guildID = interaction.guild.id;

    if (amount <= 0) {
      return interaction.reply({
        content: 'The amount must be greater than zero.',
        ephemeral: true,
      });
    }

    try {
      await unbClient.editUserBalance(guildID, targetUser.id, { cash: amount });

      const embed = new EmbedBuilder()
        .setDescription(
          `✅ Successfully added **${amount}** to <@${targetUser.id}>'s balance.`
        )
        .setColor("#ff3b3b");

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error adding money:', error);
      return interaction.reply({
        content: '❌ Failed to add money. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
