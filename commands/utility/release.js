const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

const gameID = "891852901"; // Roblox game ID
let sessionMessage; // Stores the embed message
let previousPlayerCount = 0; // Tracks last known player count

async function getRoblox(discordId) {
  try {
    const baseURL = "https://api.blox.link/v4/public/guilds/1124805501381791826";
    const token = process.env.BLOXLINK;

    const response = await fetch(`${baseURL}/discord-to-roblox/${discordId}`, {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      console.error(`Blox.link API error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.robloxID;
  } catch (error) {
    console.error("Error fetching Roblox ID:", error);
    return null;
  }
}

async function getInstances() {
  try {
    const baseURL = "https://games.roblox.com/v1/games";
    const response = await fetch(`${baseURL}/${gameID}/private-servers?limit=100`, {
      headers: { Cookie: `.ROBLOSECURITY=${process.env.ROBLOSECURITY}` },
    });

    if (!response.ok) {
      console.error(`Roblox API error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.data.length > 0 ? data.data[0] : null; // Return first private server if available
  } catch (error) {
    console.error("Error fetching private server instances:", error);
    return null;
  }
}

async function updateEmbed(interaction) {
  if (!sessionMessage) return; // Do nothing if no session embed exists

  const instance = await getInstances();
  if (!instance) return;

  if (instance.playing !== previousPlayerCount) {
    previousPlayerCount = instance.playing; // Update stored player count

    const updatedEmbed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} | Session Release`)
      .setDescription(`
      **<@${interaction.user.id}> has released their session.**  
      Ensure you have read our information and registered your vehicle before joining.
      
      **__Session Information:__**  
      **FRP Speeds:** ${interaction.options.getString("frp-speed")}  
      **Peacetime Status:** ${interaction.options.getString("peacetime-status")}  
      **Drifting Status:** ${interaction.options.getString("drifting-status")}  
      **LEO Status:** ${interaction.options.getString("leo-status")}
      
      Make sure you follow all of the instructions provided by the session host. If you have any inquiries, feel free to DM the host or any of the active staff team.
      
      **Member Count:** ${instance.playing}
      `)
      .setColor("#ff3b3b")  
      .setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340574888204963903/sr-rrv.png?ex=67b2db28&is=67b189a8&hm=3abcd7f38e7b88ad8fde1150374f97d9d7a440f5c36d0f78ca3e5cf032ff6cd8&")
      .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

    await sessionMessage.edit({ embeds: [updatedEmbed] }); // Update the embed
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("release")
    .setDescription("Release a session with details and a join link.")
    .addStringOption((option) =>
      option.setName("link").setDescription("Session join link.").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("peacetime-status")
        .setDescription("Current peacetime status.")
        .addChoices(
          { name: "Strict Peacetime", value: "Strict" },
          { name: "Normal Peacetime", value: "Normal" },
          { name: "Disabled Peacetime", value: "Off" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("frp-speed")
        .setDescription("FRP speed limits.")
        .addChoices(
          { name: "75", value: "75" },
          { name: "80", value: "80" },
          { name: "85 (use sparingly)", value: "85" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("drifting-status")
        .setDescription("Drifting status.")
        .addChoices(
          { name: "Corners Only", value: "Corners Only" },
          { name: "Disabled", value: "Disabled" },
          { name: "Enabled", value: "Enabled" }
        )
        .setRequired(true)  
    )
    .addStringOption((option) =>    
      option
        .setName("leo-status")
        .setDescription("LEO status.")
        .addChoices(
          { name: "Active", value: "Active" },
          { name: "Not Active", value: "Inactive" }
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: 64 }); // Using flags instead of `ephemeral: true`

    try {
      // Check if the bot has permission to send messages
      if (!interaction.guild.members.me.permissionsIn(interaction.channel).has("SEND_MESSAGES")) {
        return interaction.followUp({
          content: "I do not have permission to send messages in this channel.",
          flags: 64,
        });
      }

      
      const requiredRoleId = '1340119045579477072';
      if (!interaction.member.roles.cache.has(requiredRoleId)) {
          return interaction.reply({
              content: "You do not have permission to use this command.",
              ephemeral: true
          });
      }
      await interaction.deferReply({ ephemeral: true });

      const roblox = await getRoblox(interaction.user.id);
      if (!roblox) {
        return interaction.followUp({
          content: "Error",
          flags: 64,
        });
      }

      // Get instances and check if they are undefined
      const instance = await getInstances();
      if (!instance) {
        return interaction.followUp({
          content: "Make sure you have added this [Account](https://www.roblox.com/users/8023975165/profile?friendshipSourceType=PlayerSearch). https://cdn.discordapp.com/attachments/1340394244271112346/1340577186586955786/image.png?ex=67b2dd4c&is=67b18bcc&hm=de7f215d7deff7b61d35c58318a8b7d0a8245671565249873ac5196486cc94cf&",
          flags: 64,
        });
      }

      const sessionLink = interaction.options.getString("link");

      const releaseEmbed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} | Session Release`)
      .setDescription(`
      **<@${interaction.user.id}> has released their session.**  
      Ensure you have read our information and registered your vehicle before joining.
      
      **__Session Information:__**  
      **FRP Speeds:** ${interaction.options.getString("frp-speed")}  
      **Peacetime Status:** ${interaction.options.getString("peacetime-status")}  
      **Drifting Status:** ${interaction.options.getString("drifting-status")}  
      **LEO Status:** ${interaction.options.getString("leo-status")}
      
      Make sure you follow all of the instructions provided by the session host. If you have any inquiries, feel free to DM the host or any of the active staff team.
      
      **Member Count:** ${instance.playing}
      `)
      .setColor("#ff3b3b")  
      .setImage("https://cdn.discordapp.com/attachments/1340379594456563772/1340574888204963903/sr-rrv.png?ex=67b2db28&is=67b189a8&hm=3abcd7f38e7b88ad8fde1150374f97d9d7a440f5c36d0f78ca3e5cf032ff6cd8&")
      .setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` });

      const button = new ButtonBuilder()
        .setCustomId("session_link")
        .setLabel("Link")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      sessionMessage = await interaction.channel.send({
        content: "@here <@&1340394672672997506>",
        embeds: [releaseEmbed],
        components: [row],
      });

      sessionMessage.sessionLink = sessionLink; // Store the session link on the message

      await interaction.followUp({
        content: "Session released successfully.",
        flags: 64,
      });

      // Start updating the embed every 10 seconds, passing interaction
      setInterval(() => updateEmbed(interaction), 60000);
    } catch (error) {
      console.error("Error executing command:", error);
      return interaction.followUp({
        content: "An error occurred while executing the command.",
        flags: 64,
      });
    }
  },
};
