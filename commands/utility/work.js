const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Client } = require('unb-api');

const cooldowns = new Map(); // Track user cooldowns
const COOLDOWN_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Earn some money by working.'),

  async execute(interaction) {
    const userID = interaction.user.id;
    const guildID = interaction.guild.id;

    // Check if the user is on cooldown
    if (cooldowns.has(userID)) {
      const timeLeft = cooldowns.get(userID) - Date.now();
      if (timeLeft > 0) {
        const timeLeftMinutes = Math.ceil(timeLeft / 60000);
        const cooldownEmbed = new EmbedBuilder()
          .setTitle('Cooldown Active')
          .setDescription(`⏳ You need to wait **${timeLeftMinutes} minutes** before working again.`)
          .setColor('#ffcc00');
        return await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
      }
    }

    const unbClient = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzQwMzk2NjczMDg3NzAzNjMyIiwiaWF0IjoxNzM5NjQ1ODgxfQ.60GMNvMlwbeOmddJj0Rtd2PdbjL1ZSwJBOkOrYnUoyQ');
    const earnings = Math.floor(Math.random() * (700 - 100 + 1)) + 100;

    const workMethods = [
        `🛠️ You fixed a broken car and earned **$${earnings}**!`,
        `💻 You coded a website and got paid **$${earnings}**!`,
        `🎤 You performed as a street musician and received **$${earnings}** in tips!`,
        `🏦 You robbed a bank (not recommended) and made **$${earnings}**!`,
        `📦 You delivered packages and earned **$${earnings}**!`,
        `🍔 You worked at a fast-food restaurant and got **$${earnings}**!`,
        `🎨 You sold your artwork for **$${earnings}**!`,
        `📰 You wrote an article and earned **$${earnings}**!`,
        `📱 You developed an app and made **$${earnings}**!`,
        `🚖 You drove a taxi and earned **$${earnings}**!`,
        `🛒 You worked as a cashier and earned **$${earnings}**!`,
        `🔧 You repaired a broken appliance and made **$${earnings}**!`,
        `🚜 You worked on a farm and harvested crops for **$${earnings}**!`,
        `🎭 You acted in a play and got paid **$${earnings}**!`,
        `🏗️ You worked on a construction site and earned **$${earnings}**!`,
        `🎮 You beta-tested a new video game and got **$${earnings}**!`,
        `🎥 You edited a YouTube video and earned **$${earnings}**!`,
        `✍️ You wrote a book and made **$${earnings}** in sales!`,
        `🍺 You worked as a bartender and earned **$${earnings}**!`,
        `🚚 You worked as a delivery driver and made **$${earnings}**!`,
        `🧹 You cleaned houses and got **$${earnings}**!`,
        `🎢 You operated a theme park ride and earned **$${earnings}**!`,
        `📖 You tutored students and made **$${earnings}**!`,
        `🖥️ You fixed a computer and earned **$${earnings}**!`,
        `🍕 You worked as a pizza delivery driver and made **$${earnings}**!`,
        `🕵️ You worked as a private investigator and earned **$${earnings}**!`,
        `🐕 You walked dogs and made **$${earnings}**!`,
        `🎩 You performed magic tricks on the street and earned **$${earnings}**!`,
        `🏋️ You trained people at a gym and earned **$${earnings}**!`,
        `🚲 You worked as a bike messenger and earned **$${earnings}**!`,
        `📷 You worked as a photographer and made **$${earnings}**!`,
        `🎸 You played guitar at a bar and earned **$${earnings}**!`,
        `🔬 You conducted research and got funded **$${earnings}**!`,
        `🎤 You hosted an event and got **$${earnings}**!`,
        `🎭 You performed in a street play and earned **$${earnings}**!`,
        `🍣 You worked as a sushi chef and made **$${earnings}**!`,
        `🚒 You helped put out a fire and earned **$${earnings}**!`,
        `🏫 You worked as a school teacher and earned **$${earnings}**!`,
        `🛎️ You worked as a hotel receptionist and made **$${earnings}**!`,
        `🎬 You acted in a short film and earned **$${earnings}**!`,
        `📺 You worked as a voice actor and got **$${earnings}**!`,
        `🦸 You dressed as a superhero for kids' parties and earned **$${earnings}**!`,
        `🛍️ You helped in a clothing store and made **$${earnings}**!`,
        `🧑‍🍳 You worked as a chef and earned **$${earnings}**!`,
        `📦 You packed boxes in a warehouse and earned **$${earnings}**!`,
        `💰 You found a lost wallet and received a reward of **$${earnings}**!`,
        `🐠 You worked as a fisherman and sold your catch for **$${earnings}**!`,
        `🛳️ You worked on a cruise ship and made **$${earnings}**!`
      ];

    const workMessage = workMethods[Math.floor(Math.random() * workMethods.length)];

    try {
      await unbClient.editUserBalance(guildID, userID, { cash: earnings });

      const embed = new EmbedBuilder()
        .setDescription(workMessage)
        .setColor("#ff3b3b");

      await interaction.reply({ embeds: [embed], ephemeral: true });

      cooldowns.set(userID, Date.now() + COOLDOWN_TIME);

      setTimeout(() => cooldowns.delete(userID), COOLDOWN_TIME);
    } catch (error) {
      console.error('Error updating balance:', error);
      const errorEmbed = new EmbedBuilder()
        .setDescription('Failed to process your work request. Please try again later.')
        .setColor('#ff0000');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
