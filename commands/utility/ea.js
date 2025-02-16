const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('earlyaccess')
    .setDescription('Grant early access to a user with a link')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('The link for early access')
        .setRequired(true)),
  
  async execute(interaction) {
    try {
      const staffRoleId = '1340119045579477072';
      const earlyAccessRoleIds = [
        '1340119070120476682',
        '1126700508606902345',
        '1340119045579477072',
        '1340119050201858068',
        '1340119049329184818',
        '1340119048150847590',
        '1340119046523191410',
      ];

      if (!interaction.member.roles.cache.has(staffRoleId)) {
        return await interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
      }

      await interaction.reply({ content: 'Early access released!', ephemeral: true });

      const link = interaction.options.getString('link');

      const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} | Early Access`)
.setDescription(`
> Early Access has now been released by the session host. Boosters, PS, and Early Access Members may join by clicking the button provided below.

> If you would like to access the Early Access session, please head over to <#1340572587817832498>.
`)
.setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340568920410816532/ea-rrv.png?ex=67b2d599&is=67b18419&hm=5573f84caa3be3e7b788e3e9e74f3ee0103b862c231bf3682e89ded3efe0027e&")
.setColor("#ff3b3b")
.setFooter({
  text: interaction.guild.name,
  iconURL: interaction.guild.iconURL({ dynamic: true }),
});


      const button = new ButtonBuilder()
        .setLabel('Early Access Link')
        .setStyle(ButtonStyle.Primary)
        .setCustomId('early_access_link');

      const row = new ActionRowBuilder().addComponents(button);

      const message = await interaction.channel.send({
        embeds: [embed],
        content: '<@&1340119070120476682>',
        components: [row]
      });

      const logChannelId = '1297118480213999657';
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setTitle('Command Executed')
          .setDescription(`Command was executed. Information provided below.`)
          .addFields(
            { name: 'User', value: `${interaction.user}`, inline: true },
            { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
            { name: 'Link Provided', value: `${link}`, inline: false }
          )
          .setColor("#2b2d31")
            .setFooter({ text: `${interaction.guild.name}`,
             iconURL:  `${interaction.guild.iconURL()}` });

        await logChannel.send({ embeds: [logEmbed] });
      }

      const filter = i => i.customId === 'early_access_link' && i.isButton();

      const collector = message.createMessageComponentCollector({ filter });

      collector.on('collect', async i => {
        const hasPermission = earlyAccessRoleIds.some(roleId => i.member.roles.cache.has(roleId));

        if (!hasPermission) {
          await i.reply({ content: 'You do not have permission to access this link!', ephemeral: true });
        } else {
          await i.reply({ content: `**Link:** ${link}`, ephemeral: true });
        }
      });

    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
};
