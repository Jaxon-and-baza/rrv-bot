const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Attempt to rob another user and steal a random amount of money.')
    .addUserOption(option =>
      option.setName('victim')
        .setDescription('The user you want to rob')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const victim = interaction.options.getUser('victim');
    
    if (victim.id === userId) {
      return interaction.reply({
        content: 'You cannot rob yourself!',
        ephemeral: true,
      });
    }

    try {
      const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
      const guildID = interaction.guild.id;

      const userBalance = await unbClient.getUserBalance(guildID, userId);
      const victimBalance = await unbClient.getUserBalance(guildID, victim.id);

      if (victimBalance.cash === 0) {
        return interaction.reply({
          content: `The user <@${victim.id}> doesn't have any cash to steal!`,
          ephemeral: true,
        });
      }

      const success = Math.random() < 0.2; 

      if (!success) {
        const failEmbed = new EmbedBuilder()
          .setDescription(
            `Your robbery attempt on <@${victim.id}> failed!\n` +
            `You got caught and had to run away empty-handed.`
          )
          .setColor("#ff3b3b");

        return interaction.reply({ embeds: [failEmbed], ephemeral: true });
      }

      // Successful robbery
      const stolenAmount = Math.floor(Math.random() * victimBalance.cash) + 1;
      await unbClient.editUserBalance(guildID, userId, { cash: stolenAmount, bank: userBalance.bank });
      await unbClient.editUserBalance(guildID, victim.id, { cash: -stolenAmount, bank: victimBalance.bank });

      const successEmbed = new EmbedBuilder()
        .setDescription(
          `✅ **You successfully robbed <@${victim.id}>!**\n` +
          `You stole **${stolenAmount}** from their cash balance.\n` +
          `**Your New Cash Balance**: ${userBalance.cash + stolenAmount}\n` +
          `**${victim.username}'s New Cash Balance**: ${victimBalance.cash - stolenAmount}`
        )
        .setColor("#ff3b3b");

      return interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error('Error during robbery:', error);
      return interaction.reply({
        content: 'Failed to rob the user. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
