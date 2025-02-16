const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('concluded')
        .setDescription('Ends the session')
        .addStringOption(option =>
            option.setName('totalduration')
                .setDescription('The total duration of the session')
                .setRequired(true)),

    async execute(interaction) {
        
        const requiredRoleId = '1340119045579477072';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true }); // Only one deferReply here

        try {
            const totalduration = interaction.options.getString('totalduration');
            const date2 = new Date().toLocaleDateString();

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Session Concluded`)
                .setDescription(`
> The session has now been concluded. We appreciate everyone who joined us and attended the session! Feel free to give your feedback by clicking the button below.

__**Session Details:**__
**Hosted by:** <@${interaction.user.id}>
**Total Duration:** ${totalduration}
**Date:** ${date2}

**Note:** Keep in mind that, depending on the severity of the situation, asking for a session may result in an infraction, kick, or even a ban.`)
                .setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340614859435544678/SC-rrv.png?ex=67b30061&is=67b1aee1&hm=3c54b1cd9bd36a94c62e34f29e4d391aadd4a6163cc8c5ba936f5c64e286a96d&")
                .setColor("#ff3b3b")
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('feedback')
                        .setLabel('Give Feedback')
                        .setStyle(ButtonStyle.Danger)
                );

            const logEmbed = new EmbedBuilder()
                .setTitle('Command Executed')
                .setDescription('A roleplay session has ended. Information will be placed below.')
                .addFields(
                    { name: 'Host', value: `<@${interaction.user.id}>` },
                    { name: 'Date', value: date2 }
                )
                .setColor("#ff3b3b")
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

            await interaction.channel.send({
                embeds: [embed],
                components: [row]
            });

            const logChannel = await interaction.client.channels.fetch('1340552727968743456');
            await logChannel.send({ embeds: [logEmbed] });

            const successEmbed = new EmbedBuilder()
                .setDescription('Command executed successfully!')
                .setColor("#ff3b3b")
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

            await interaction.editReply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            console.error('Error sending messages:', error);

            const errorEmbed = new EmbedBuilder()
                .setDescription('Failed to send messages. Please try again later.')
                .setColor("#ff3b3b")
                .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

            await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
