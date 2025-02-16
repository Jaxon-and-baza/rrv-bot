const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Shows the server leaderboard with total balance (cash + bank).'),

  async execute(interaction) {
    try {
      const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
      const guildID = interaction.guild.id;

      const members = await interaction.guild.members.fetch();
      const leaderboardData = [];

      for (let member of members.values()) {
        try {
          const userBalance = await unbClient.getUserBalance(guildID, member.id);
          const totalBalance = userBalance.cash + userBalance.bank;
          leaderboardData.push({
            userId: member.id,
            totalBalance,
            username: member.user.username,
          });
        } catch (error) {
          console.error(`Error fetching balance for ${member.user.username}:`, error);
        }
      }

      leaderboardData.sort((a, b) => b.totalBalance - a.totalBalance);

      const itemsPerPage = 10;
      const pages = Math.ceil(leaderboardData.length / itemsPerPage);
      let currentPage = 0;

      const generateLeaderboardEmbed = (page) => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const leaderboardPage = leaderboardData.slice(start, end);

        const embed = new EmbedBuilder()
          .setTitle('Leaderboard - Top 10 Users')
          .setColor("#ff3b3b")
          .setDescription(
            leaderboardPage
              .map(
                (entry, index) =>
                  `**${start + index + 1}.** ${entry.username} - **${entry.totalBalance}**`
              )
              .join('\n')
          )
          .setFooter({ text: `Page ${page + 1} of ${pages}` });

        return embed;
      };

      await interaction.reply({
        embeds: [generateLeaderboardEmbed(currentPage)],
      });

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      await interaction.reply({
        content: 'Failed to fetch leaderboard. Please try again later.',
        ephemeral: true,
      });
    }
  },
};
