const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsupport')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription('Open a ticket support dropdown.'),
  async execute(interaction) {
    const channelid = `${interaction.channel.id}`

 
    await interaction.deferReply(); 


    const embed = new EmbedBuilder()
      .setTitle('Server Support')
      .setDescription('> Please select the appropriate option for the ticket you wish to open. Opening a ticket for the wrong reason or for trolling purposes will lead to necessary consequences. We appreciate your patience, as our staff may be attending to multiple inquiries at once.')
      .setColor("#ff3b3b")
      .setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340551238525386752/server_startup-RRV_1.png?ex=67b2c521&is=67b173a1&hm=af0c63f530d05e076261a3dce757541a5d6eee8db1cf019c96c068df780dbe27&")
      .setFooter({ text: `${interaction.guild.name}`,
       iconURL:  `${interaction.guild.iconURL()}` });


    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('supportOptions')
          .setPlaceholder('Select an option')
          .addOptions([
            {
              label: 'Support Ticket',
              description: `Open a support ticket`,
              value: 'st',
            },
            {
              label: 'Member Report',
              description: 'Report a member',
              value: 'mr',
            },
          ])
      );

    // Send the embed with the dropdown to the specified channel
    const supportChannel = interaction.guild.channels.cache.get(`${channelid}`);
    if (supportChannel) {
      await supportChannel.send({ embeds: [embed], components: [row] });
      await interaction.followUp({ content: 'The support ticket options have been sent.', ephemeral: true });
    } else {
      await interaction.followUp({ content: 'Unable to find the support channel.', ephemeral: true });
    }
  },
};
