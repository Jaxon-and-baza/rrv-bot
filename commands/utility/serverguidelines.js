const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-guidelines')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Server guidelines'),
    async execute(interaction) {
        const image = "https://cdn.discordapp.com/attachments/1267950415069188199/1340393342940479570/server_guidelines-RRV_2.png?ex=67b23214&is=67b0e094&hm=a57f1725753cbf67b07f2bdf855c27ac86bf2ff202a62a66c621e3272e5411da&";

        const embed1 = new EmbedBuilder()
            .setTitle('Server Information')
            .setDescription(`> Welcome to ${interaction.guild.name}! Read the provided rules below to know the server well.`)
            .setColor("#ff3b3b");

        const embed2 = new EmbedBuilder()
            .setTitle('Rule 1: No NSFW')
            .setDescription('> Sending any NSFW (Not Safe For Work) links or images around any channels in this server will lead to big consequences')
            .setColor("#ff3b3b");
            
        const embed3 = new EmbedBuilder()
            .setTitle('Rule 2: Bad Source Of Language')
            .setDescription('> Any source of offensive language is prohibited from this server. If you see anyone saying racial slurs, bad words, etc., please report it to the staff team.')
            .setColor("#ff3b3b");
            
        const embed4 = new EmbedBuilder()
            .setTitle('Rule 3: No Spamming')
            .setDescription('> Spamming in this server will result in a 1-hour mute. If the spamming continues, it will lead to a 24-hour mute.')
            .setColor("#ff3b3b");

        const embed5 = new EmbedBuilder()
            .setTitle('Rule 4: Respect Privacy')
            .setDescription(`> Do not distribute private messages, personal information, or any other private content without permission. Always respect people's privacy.`)
            .setColor("#ff3b3b");
        
        const embed6 = new EmbedBuilder()
            .setTitle('Rule 5: No Impersonation')
            .setDescription('> Impersonation of other members or the staff — deliberately using their names or avatars is strictly prohibited. Substitution is deceit, and it will be punished.')
            .setColor("#ff3b3b");
        
        const embed7 = new EmbedBuilder()
            .setTitle('Rule 6: Follow Discord Terms of Service')
            .setDescription(`> All users are to keep within the boundaries of Discord's Terms of Service and Community Guidelines. None of the activities or behaviors that violate said terms are allowed to be practiced here in this server.`)
            .setColor("#ff3b3b");
            
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('information_select')
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Session Guidelines')
                    .setDescription('Guidelines for the session.')
                    .setValue('sg'),
               new StringSelectMenuOptionBuilder()
                    .setLabel('Affiliated Links')
                    .setDescription('Affiliated Links.')
                    .setValue('al'),      
                new StringSelectMenuOptionBuilder()
                    .setLabel('Session Ping')
                    .setDescription('Get pinged when a session starts/occurs.')
                    .setValue('sping'),
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed1, embed2, embed3, embed4, embed5, embed6, embed7], components: [row], files: [image] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};
