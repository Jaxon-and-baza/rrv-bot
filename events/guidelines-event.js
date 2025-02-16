const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'information_select') {
            // Handling select menu choices
            if (interaction.values[0] === 'rules') {
                const rulesEmbed = new EmbedBuilder()
                    .setDescription(`**1. Be respectful**
> This means no mean, rude, or harassing comments. Treat others the way you want to be treated.

**2.No inappropriate language**
> Keep use of profanity to a reasonable minimum. Any derogatory language towards any user is prohibited. You can swear in casual channels only, while the other channels should be kept free of any profane language.

**3.No spamming**
> Do not send a lot of small messages right after each other. These disrupt the chat and make it hard to scroll through the server. Please keep your messages at least 5 words long while chatting.

**4.No pornographic/adult/other NSFW material**
> This server is meant to provide a safe place for us to share art, videos, advice, and other kinds of helpful material.

**5.No advertisements**
> Don’t send invasive advertising, whether it be for other communities or streams. You can post your content in the media channel if it’s relevant and provides actual value for the community.

**6.No offensive names and profile pictures**
> Keep your names and profile picture appropriate.

**7.Server raiding**
> Server raiding is against Discord’s ToS. Any attempt to circumvent or bypass them can result in a permanent ban.

**8.Threats are forbidden**
> Threats are prohibited and disallowed.

**9.Follow the Discord Community Guidelines**
> Respect the general Discord Community Guidelines at all times.

**10.Do not join voice chat channels without permission of the people already in there**
> If you see that they have a free spot it is alright to join and ask whether they have an open spot, but leave if your presence is not wanted by whoever was there first.

**11.Don’t share your personal information**
> Do not share your personal information or the personal information of other users without their consent. This includes phone numbers, addresses, and any other sensitive information.

**12.Don’t share illegal or pirated content**
> Do not share links to illegal or pirated content, such as copyrighted material or stolen software. This is against Discord ToS and can result in a ban from the server.

**13.Avoid false or misleading information**
> Make sure to fact-check any information you share and only share reliable sources. Spreading false or misleading information can be harmful and undermines the trust and integrity of the community.

**14.Follow the channel-specific guidelines**
> Each channel in the server have specific guidelines for the type of content that is allowed. Make sure to follow these guidelines and respect the purpose of each channel.

**15.No sharing or distributing hacks, cheats, or other unauthorized tools or services**
> Sharing or distributing hacks, cheats, or other unauthorized tools or services is strictly prohibited on the server.

**16.No sharing or distributing viruses or malicious software**
> Sharing or distributing viruses or malicious software can harm the server and its members, and is therefore strictly prohibited.

**17.No sharing or distributing illegal drugs or controlled substances**
> Distributing illegal drugs or controlled substances is strictly prohibited on this server.

**18.No sharing or distributing counterfeit or fraudulent items**
> You can’t share or distribute counterfeit or fraudulent items, such as fake IDs or fraudulent financial documents in this server.

**19.No sharing or distributing stolen financial or banking information**
> You can’t distribute stolen financial or banking information, such as credit card numbers or bank account information.

**20.No sharing or distributing unauthorized keys or serial numbers for software or games**
> Don’t share or distribute keys or serial numbers for software or games that have been obtained illegally.

**21.Respect others’ privacy**
> Do not invade the privacy of other users by asking for or sharing their personal information, or by sending unwanted DMs.`)
.setColor("#ff3b3b");

                await interaction.reply({
                    embeds: [rulesEmbed],
                    ephemeral: true
                });
            } else if (interaction.values[0] === 'sg') {
                const rpEmbed = new EmbedBuilder()
                    .setDescription(`
                        **[1] Lag**  
                        > When you are driving and you experience a significant amount of lag, pull over to the side and wait for it to stop.

                        **[2] Banned Vehicles**  
                        > Ensure you have the correct role for your vehicle. If caught driving a banned vehicle without the proper roles, it will escalate to a session removal.

                        **[3] Peace Status and Rules**  
                        > During peace time, you are not allowed to drift, run from law enforcement (LEO), rob stores, or drive recklessly. If you are caught breaking any of these rules, you will be removed from the roleplay session. The fail roleplay speed during this peacetime is 75 mph.  
                        > During strict peace time, you are not allowed to drift, run from law enforcement, etc., and the fail roleplay speed is 65 mph. If caught breaking any of these rules, it will result in a server infraction and session removal.  
                        > During peace time off, you are allowed to drift, run from law enforcement, rob stores, hard brake, etc. The fail roleplay speed during this time will be 100 mph. Being caught going over this speed will result in session removal.

                        **[4] Traffic Stops**  
                        > When a law enforcement member pulls you over, you must pull over to the nearest parking lot or to the right side of the road (emergency lane). All information must be provided to law enforcement when asked. Failing to do so will result in an arrest and license suspension.

                        **[5] Staff Stops**  
                        > When a staff member pulls you over, you are not allowed to drive away. If caught doing so, they can remove you from the session, and an infraction will be issued.

                        **[6] General Tips**  
                        > Ensure you are recording your gameplay by using Medals, SteelSeries, etc. This will be useful if you encounter trouble for no reason.  
                        > Respect all members within the roleplay session; otherwise, you may be marked for it.  
                        > Ensure you are following Roblox TOS while roleplaying, or this can lead to your account being reported.  
                        > No starting drama within the session; doing so will result in removal and an infraction.

                        **[7] Combat Logging**
                        > **Combat Logging**: Players must not log out of the server while in a roleplay scenario, especially during combat. If you are in danger, attempt to roleplay your escape or resolution before logging off. Logging out to avoid consequences is not permitted.

                        **[8] Banned Roleplays**
                        > **Drug/Alcohol Roleplay**: Any scenarios involving the use, sale, or distribution of drugs or alcohol are not allowed.
                        > **Gang Roleplay**: Formation or involvement in gangs or gang-related activities is forbidden.
                        > **Suicide Roleplay**: Any portrayal or discussion of suicide is prohibited.
                        > **Public Shootings**: Roleplaying public shootings or violent mass attacks is not acceptable.
                        > **Gore Roleplay**: Excessive graphic content or gore-related roleplay is banned.
                    `)
                    .setColor("#ff3b3b");

                await interaction.reply({
                    embeds: [rpEmbed],
                    ephemeral: true
                });
            } else if (interaction.values[0] === 'al') {
                const linksEmbed = new EmbedBuilder()
                    .setDescription(`Please check back later.`)
                    .setColor("#ff3b3b");


                await interaction.reply({
                    embeds: [linksEmbed],
                    ephemeral: true
                });
            } else if (interaction.values[0] === 'sping') {
                const otherEmbed = new EmbedBuilder()
                    .setDescription('Click here to receive/remove the session ping role.')
                    .setColor("#ff3b3b");

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Session Ping')
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId('session_ping')
                    );

                await interaction.reply({
                    embeds: [otherEmbed],
                    components: [button],
                    ephemeral: true
                });
            }
        }

        if (interaction.isButton() && interaction.customId === 'session_ping') {
            const roleId = '1340394672672997506';
            const role = interaction.guild.roles.cache.get(roleId);
            const member = interaction.guild.members.cache.get(interaction.user.id);

            if (role && member) {
                if (member.roles.cache.has(roleId)) {
                    await member.roles.remove(role);
                    await interaction.reply({ content: `<@&${roleId}> has been removed successfully`, ephemeral: true });
                } else {
                    await member.roles.add(role);
                    await interaction.reply({ content: `<@&${roleId}> has been added successfully`, ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Role or member not found.', ephemeral: true });
            }
        }
    },
};
