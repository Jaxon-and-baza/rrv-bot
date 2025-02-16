const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const Vehicle = require('../../models/vehicle');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Displays your or another user's profile.")
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a user to view their profile. If not selected, shows your profile.')
    ),

  async execute(interaction) {
    const selectedUser = interaction.options.getUser('user') || interaction.user;
    const userId = selectedUser.id;
    const member = interaction.guild.members.cache.get(userId);
    const displayName = member ? member.displayName : selectedUser.username;
    const apiKey = '74ac5afb-338a-4cbe-bb17-9f597b0f7872';
    const bloxlinkUrl = `https://api.blox.link/v4/public/guilds/${interaction.guild.id}/discord-to-roblox/${userId}`;

    try {
      const [vehicleCount, bloxlinkResponse] = await Promise.all([
        Vehicle.countDocuments({ userId }),
        axios.get(bloxlinkUrl, { headers: { 'Authorization': apiKey } }).catch(() => null),
      ]);

      let robloxUsername = 'Not Linked';
      let robloxProfileLink = 'N/A';
      let robloxThumbnail = selectedUser.displayAvatarURL({ dynamic: true });

      if (bloxlinkResponse?.status === 200 && bloxlinkResponse.data.robloxID) {
        const robloxID = bloxlinkResponse.data.robloxID;
        robloxProfileLink = `https://www.roblox.com/users/${robloxID}/profile`;

        const [robloxResponse, headshotResponse] = await Promise.all([ 
          axios.get(`https://users.roblox.com/v1/users/${robloxID}`).catch(() => null),
          axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxID}&size=150x150&format=Png`).catch(() => null),
        ]);

        if (robloxResponse?.status === 200) robloxUsername = robloxResponse.data.name;
        if (headshotResponse?.status === 200 && headshotResponse.data.data.length > 0) {
          robloxThumbnail = headshotResponse.data.data[0].imageUrl;
        }
      }

      const profileEmbed = new EmbedBuilder()
        .setTitle(`${robloxUsername} | Roleplay Profile`)
        .setDescription(`**User**: <@${userId}>\n**Roblox Profile**: [${robloxUsername}](${robloxProfileLink})\n**Vehicle Count**: ${vehicleCount}\n**License Status:** Active`)
        .setThumbnail(robloxThumbnail)
        .setColor("#ff3b3b");

      const buttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`view_vehicles_${userId}`).setLabel('Vehicles').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId(`view_tickets_${userId}`).setLabel('Tickets').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId(`view_balance_${userId}`).setLabel('Balance').setStyle(ButtonStyle.Danger)
        );

      await interaction.reply({ embeds: [profileEmbed], components: [buttons] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
    }
  },
};
