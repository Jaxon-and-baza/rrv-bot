const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play a game of blackjack')
    .addIntegerOption(option =>
      option.setName('bet')
        .setDescription('Amount to bet in cash')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const betAmount = interaction.options.getInteger('bet');

    try {
      // Initialize the unb API client with your token
      const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
      const guildID = interaction.guild.id;

      // Get user balance (focus on cash withdrawn)
      const userBalance = await unbClient.getUserBalance(guildID, userId);

      // Check if the user has enough withdrawn cash to play
      if (userBalance.cash < betAmount) {
        return await interaction.reply({
          content: 'You do not have enough withdrawn cash to make this bet.',
          ephemeral: true,
        });
      }

      // Simulate blackjack game
      const playerHand = [drawCard(), drawCard()];
      const dealerHand = [drawCard(), drawCard()];

      const playerScore = calculateHandValue(playerHand);
      const dealerScore = calculateHandValue(dealerHand);

      const result = determineWinner(playerScore, dealerScore);

      // Adjust balance based on the result
      let message = `**Player's Hand**: ${playerHand.join(', ')} (Score: ${playerScore})\n**Dealer's Hand**: ${dealerHand.join(', ')} (Score: ${dealerScore})\n\n`;

      if (result === 'win') {
        message += 'You win! 🎉';
        await unbClient.updateUserBalance(guildID, userId, { cash: userBalance.cash + betAmount });
      } else if (result === 'lose') {
        message += 'You lose. Better luck next time. 😞';
        await unbClient.updateUserBalance(guildID, userId, { cash: userBalance.cash - betAmount });
      } else {
        message += 'It\'s a tie! 🤝';
      }

      // Send result embed
      const blackjackEmbed = new EmbedBuilder()
        .setTitle('Blackjack Game Result')
        .setDescription(message)
        .setColor(result === 'win' ? '#00FF00' : result === 'lose' ? '#FF0000' : '#FFA500');

      await interaction.reply({ embeds: [blackjackEmbed] });

    } catch (error) {
      console.error('Error during blackjack game:', error);
      await interaction.reply({
        content: 'An error occurred while playing the game. Please try again later.',
        ephemeral: true,
      });
    }

    // Helper function to draw a random card
    function drawCard() {
      const deck = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      return deck[Math.floor(Math.random() * deck.length)];
    }

    // Helper function to calculate the value of a hand
    function calculateHandValue(hand) {
      let value = 0;
      let aces = 0;
      hand.forEach(card => {
        if (card === 'A') {
          value += 11;
          aces++;
        } else if (['K', 'Q', 'J'].includes(card)) {
          value += 10;
        } else {
          value += parseInt(card);
        }
      });

      // Adjust for aces if value exceeds 21
      while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
      }
      return value;
    }

    // Helper function to determine the winner
    function determineWinner(playerScore, dealerScore) {
      if (playerScore > 21) return 'lose';
      if (dealerScore > 21) return 'win';
      if (playerScore > dealerScore) return 'win';
      if (playerScore < dealerScore) return 'lose';
      return 'tie';
    }
  },
};
