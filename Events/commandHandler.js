const Discord = require("discord.js");

/**
 * @param {Discord.Message} message 
 */
exports.execute = async (message) => {
    if(message.author.bot || !message.content.startsWith("!")) return;

    let args = message.content.split(" ");
    let commandName = args[0].substring(1);
    args = args.splice(1);
    let command = global.Commands.get(commandName);
    if(!command || !command.conf.enabled || (command.conf.guildOnly && message.channel.type != "text")) return;
    if(command)
        command.run(message.client, message, args);
};

exports.conf = {
    event: "message"
}