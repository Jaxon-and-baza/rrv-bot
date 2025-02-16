const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit a specified amount of cash into your bank account.')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount you wish to deposit')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');

    try {
      const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
      const guildID = interaction.guild.id;

      const userBalance = await unbClient.getUserBalance(guildID, userId);

      if (userBalance.cash < amount) {
        return interaction.reply({
          content: 'You do not have enough cash to deposit this amount.',
          ephemeral: true,
        });
      }

      await unbClient.editUserBalance(guildID, userId, { cash: -amount, bank: amount });

      const successEmbed = new EmbedBuilder()
        .setDescription(
          `**Deposit of ${amount} into your bank account was successful!**\n` +
          `**New Cash Balance**: ${userBalance.cash - amount}\n` +
          `**New Bank Balance**: ${userBalance.bank + amount}`
        )
        .setColor("#ff3b3b");

      return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error('Error depositing money:', error);
      return interaction.reply({
        content: 'Failed to deposit money. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
