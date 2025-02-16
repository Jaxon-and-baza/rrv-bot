const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    
    async execute(interaction) {
        const requiredRoleId = '1340119045579477072';
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        try {
            await interaction.deferReply({ ephemeral: true });
            const reactions = interaction.options.getInteger('reactions');
            const userid = interaction.user.id;

            const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name} | Session Startup`)
            .setDescription(
              `<@${userid}> has started a new session. Before joining, ensure you have read and understood all regulations and information. Failure to comply may result in a server ban.
            
              **Reacting**: Only react if you intend to join the roleplay session.
            
              **Vehicle Registration**: To register your vehicle, go to <#1340119176685289578> and use \`/register\`, then fill in the required information.
            
              The session will begin once ${reactions} reactions have been met.`
            )
            .setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340564144750858291/sessionstartup-rrv.png?ex=67b2d126&is=67b17fa6&hm=2db2c9bbee6b27156485d55b2b1f17621fc07308bde383af5abf56e0e20912fe&")
            .setColor("#ff3b3b")
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            });
            
        
            const sentMessage = await interaction.channel.send({ content: '@everyone', embeds: [embed] });
            await sentMessage.react('✅');

            const targetChannelId = '1340552727968743456';
            const targetChannel = await interaction.client.channels.fetch(targetChannelId);
            if (!targetChannel) throw new Error("Target channel not found.");

            const newEmbed = new EmbedBuilder()
                .setTitle("Command Executed")
                .setDescription(`A roleplay session has been initiated. Information will be placed below.`)
                .setFields([
                    { name: 'Host', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Reactions', value: `${reactions}`, inline: true },
                    { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true }
                ])
                .setColor("#ff3b3b")
            .setFooter({
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
            });

            await targetChannel.send({ embeds: [newEmbed] });
            
            await interaction.editReply({ content: 'Command completed successfully', ephemeral: true });

        } catch (error) {
            console.error("An error occurred: ", error);
            await interaction.followUp({
                content: "An error occurred while processing your request.",
                ephemeral: true
            });
        }
    },
};
