const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1487845471014879364";

const commands = [
    new SlashCommandBuilder()
        .setName('oferta')
        .setDescription('Pokazuje ofertę')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log('Komenda dodana!');
    } catch (error) {
        console.error(error);
    }
})();