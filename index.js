
require("dotenv").config();
const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    PermissionsBitField
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CATEGORY_ID = "1460308929073381539"; // <- wklej ID kategorii

const STAFF_ROLE_ID = "1289511452918550568";
const TRANSCRIPT_CHANNEL_ID = "1413843563166437396";

client.once('clientReady', () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
});

const userLang = new Map();

client.on('interactionCreate', async interaction => {

    // ================= KOMENDA /oferta =================
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === 'oferta') {

            const embed = new EmbedBuilder()
                .setTitle('📦 Optimization / Tweaks Pack')
                .setColor('#2b2d31')
                .setDescription(`
💸 **Price:**
• 5€ / ~6$

🛠️ **Package Contents:**

⚡ **CPU Performance**
• Enhancements that increase CPU processing power

🚀 **System Opti Mods**
• Advanced system modifications to improve overall performance

🖥️ **OPTI+RESP**
• Improved system responsiveness and smoothness

📦 **Package A & Package B**
• Additional optimization bundles

⚙️ **Registry Tweaks**
• Windows registry optimizations

💎 **Pro Tweaks**
• More advanced performance improvements

🔧 **Tools Pack**
• Extra tools and system configurations

🎮 **Game Boost**
• Gaming optimizations (higher FPS, lower input lag)

🧩 **Basic Tweaks**
• Fundamental system improvements

---

🔥 **Results:**
• Higher FPS
• Reduced lag
• Better overall performance and stability

*altrix cfg*
                `);

const ticketRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('Open Ticket')
        .setStyle(ButtonStyle.Primary)
);

            const langRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('lang_pl')
                    .setLabel('Polski')
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId('lang_en')
                    .setLabel('English')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.reply({
                embeds: [embed],
                components: [ticketRow, langRow]
            });
        }
    }

    // ================= PRZYCISKI =================
    if (interaction.isButton()) {

        // ===== OPEN TICKET =====
      if (interaction.customId === 'open_ticket') {

    await interaction.deferReply({ ephemeral: true });

    try {
        const lang = userLang.get(interaction.user.id) || 'en';

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0,
            parent: CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                },
                {
                    id: STAFF_ROLE_ID,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages
                    ]
                }
            ]
        });

        // ===== EMBED ZALEŻNY OD JĘZYKA =====
        let ticketEmbed;

        if (lang === 'pl') {
            ticketEmbed = new EmbedBuilder()
                .setTitle('🧾 Nowy Ticket')
                .setColor('#2b2d31')
                .setDescription(`
Cześć <@${interaction.user.id}>, opisz swój problem.

**Podaj od razu:**
• specyfikację PC  
• CPU / GPU / RAM  
• chłodzenie  
• wersję Windows  
• czego dokładnie oczekujesz  
                `);
        } else {
            ticketEmbed = new EmbedBuilder()
                .setTitle('🧾 New Ticket')
                .setColor('#2b2d31')
                .setDescription(`
Hi <@${interaction.user.id}>, describe what you need here.

**Please send:**
• your PC specifications  
• CPU / GPU / RAM  
• cooling solution  
• Windows version  
• what you expect  
                `);
        }

        const closeRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
            content: `<@${interaction.user.id}> <@&${STAFF_ROLE_ID}>`,
            embeds: [ticketEmbed],
            components: [closeRow]
        });

        await interaction.editReply({
            content: `✅ Ticket utworzony: ${channel}`
        });

    } catch (err) {
        console.error(err);

        await interaction.editReply({
            content: "❌ Błąd przy tworzeniu ticketa"
        });
    }
}
        // ===== CLOSE TICKET =====
      if (interaction.customId === 'close_ticket') {

    await interaction.deferReply({ ephemeral: true });

    try {
        const messages = await interaction.channel.messages.fetch({ limit: 100 });

        const transcript = messages
            .map(m => `[${new Date(m.createdTimestamp).toLocaleString()}] ${m.author.tag}: ${m.content}`)
            .reverse()
            .join('\n');

        const buffer = Buffer.from(transcript, 'utf-8');

        const logChannel = interaction.guild.channels.cache.get(TRANSCRIPT_CHANNEL_ID);

        if (logChannel) {
            await logChannel.send({
                content: `📁 Transcript z ${interaction.channel.name}`,
                files: [{
                    attachment: buffer,
                    name: `transcript-${interaction.channel.name}.txt`
                }]
            });
        }

        await interaction.channel.delete();

    } catch (err) {
        console.error(err);

        await interaction.editReply({
            content: "❌ Błąd przy zamykaniu ticketa"
        });
    }
}
        // ===== POLSKI =====
       if (interaction.customId === 'lang_pl') {

    userLang.set(interaction.user.id, 'pl');

            const embedPL = new EmbedBuilder()
    .setTitle('📦 Pakiet Optymalizacji')
    .setColor('#2b2d31')
    .setDescription(`
💸 **Cena:**
• 5€ / ~6$

🛠️ **Zawartość zestawu:**

⚡ **CPU Performance**
• Ulepszenia zwiększające moc obliczeniową procesora

🚀 **System Opti Mods**
• Zaawansowane modyfikacje poprawiające działanie systemu

🖥️ **OPTI+RESP**
• Lepsza responsywność i płynność systemu

📦 **Pakiet A & Pakiet B**
• Dodatkowe zestawy usprawnień

⚙️ **Registry Tweaks**
• Optymalizacje rejestru Windows

💎 **Pro Tweaks**
• Rozszerzone, bardziej zaawansowane poprawki

🔧 **Tools Pack**
• Dodatkowe narzędzia i konfiguracje systemowe

🎮 **Game Boost**
• Optymalizacja pod gry (wyższe FPS, niższy input lag)

🧩 **Basic Tweaks**
• Podstawowe usprawnienia systemu

---

🔥 **Rezultat:**
• Większa liczba FPS
• Mniejsze opóźnienia
• Stabilniejsza i szybsza praca systemu

*altrix cfg*
                `);

            await interaction.update({
                embeds: [embedPL]
            });
        }

        // ===== ENGLISH =====
        if (interaction.customId === 'lang_en') {

    userLang.set(interaction.user.id, 'en');

           const embedEN = new EmbedBuilder()
    .setTitle('📦 Optimization / Tweaks Pack')
    .setColor('#2b2d31')
    .setDescription(`

💸 **Price:**
• 5€ / ~5.5$


🛠️ **Package Contents:**

⚡ **CPU Performance**
• Enhancements that increase CPU processing power

🚀 **System Opti Mods**
• Advanced system modifications to improve overall performance

🖥️ **OPTI+RESP**
• Improved system responsiveness and smoothness

📦 **Package A & Package B**
• Additional optimization bundles

⚙️ **Registry Tweaks**
• Windows registry optimizations

💎 **Pro Tweaks**
• More advanced performance improvements

🔧 **Tools Pack**
• Extra tools and system configurations

🎮 **Game Boost**
• Gaming optimizations (higher FPS, lower input lag)

🧩 **Basic Tweaks**
• Fundamental system improvements

---

🔥 **Results:**
• Higher FPS
• Reduced lag
• Better overall performance and stability

*altrix cfg*
    `);

            await interaction.update({
                embeds: [embedEN]
            });
        }
    }
});

client.login(process.env.TOKEN);
