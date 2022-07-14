const { Client, Intents } = require("discord.js");
const dotenv = require('dotenv');
dotenv.config();

client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

class CustomCommand {

    constructor(cmdTrigger, cmdEventCommand, cmdOwner) {
        this.commandTrigger = cmdTrigger;
        this.commandOwner = cmdOwner;
        this.commandEventCommand = cmdEventCommand;
    }
}

class Command {
    commandName;
    commandEvent;

    constructor(cmdName, cmdEvent) {
        this.commandName = cmdName;
        this.commandEvent = cmdEvent;
    }
}

let allCustomCommands = [];

const CreateCommand = (ctx, params) => {
    if (params.length >= 2) {
        let cmdTrigger = params[0];

        let cmdEventCommand = "";
        for (let i = 1; i < params.length; i++) {
            cmdEventCommand += params[i] + " ";
        }
        cmdEventCommand = cmdEventCommand.replaceAll('`', '');
        console.log(cmdEventCommand);

        let bound = isCommandBound(cmdTrigger);
        if (bound) {
            if (bound == true) {
                ctx.reply("Command already in use");
                return;
            } else {
                ctx.reply("Command already bound by " + client.users.cache.get(bound.commandOwner));
                return;
            }
        }

        let newCC = new CustomCommand(cmdTrigger, cmdEventCommand, ctx.author.id);
        allCustomCommands.push(newCC);
        ctx.reply("Created new custom command successfully");
    }
}

function isCommandBound(cmdTrigger) {
    for (let i = 0; i < commands.length; i++) {
        if (cmdTrigger.toUpperCase() === (commandPrefix + commands[i].commandName).toUpperCase()) {
            return true;
        }
    }

    for (let i = 0; i < allCustomCommands.length; i++) {
        if (allCustomCommands[i].commandTrigger === cmdTrigger) {
            return allCustomCommands[i];
        }
    }
    return null;
}

function RunCustomCommand(ctx, cmd) {
    let cmdEvent = cmd.commandEventCommand.replaceAll("\n", "");
    let cmdLines = cmdEvent.split(";");
    console.log(cmdLines);
    for (let i = 0; i < cmdLines.length; i++) {
        cmdLines[i] = cmdLines[i].trim();

        if (cmdLines[i].startsWith('reply')) {
            replyMessage = ProcessBracketedCommand(ctx, cmdLines[i]);

            ctx.reply(replyMessage);
        }

        if (cmdLines[i].startsWith("message")) {
            replyMessage = ProcessBracketedCommand(ctx, cmdLines[i]);

            const channel = client.channels.cache.get(ctx.channelId);
            channel.send(replyMessage);
        }

        if (cmdLines[i].startsWith("send")) {
            replyMessage = ProcessBracketedCommand(ctx, cmdLines[i]);

            const channel = client.channels.cache.get(ctx.channelId);
            channel.send({ files: [replyMessage] });
        }
    }
}

function ProcessBracketedCommand(ctx, cmd) {
    let replyStart = cmd.indexOf("(");
    let replyEnd = cmd.indexOf(")")
    let replyMessage = cmd.substring(replyStart + 1, replyEnd);

    replyMessage = replyMessage.replaceAll("${user}", ctx.author.username);

    return replyMessage;
}

const commandPrefix = "/";
const commands = [
    new Command("createCustomCommand", CreateCommand)
];

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", ctx => {
    for (let i = 0; i < commands.length; i++) {
        let cmd = commandPrefix + commands[i].commandName.toLowerCase();

        if (ctx.content.toLowerCase().startsWith(cmd)) {
            let params = ctx.content.toLowerCase().split(" ");
            let index = params.indexOf(cmd);
            if (index >= 0) {
                params.splice(index, 1);
            }
            commands[i].commandEvent(ctx, params);
            return;
        }
    }

    for (let i = 0; i < allCustomCommands.length; i++) {
        if (ctx.content.match(allCustomCommands[i].commandTrigger)) {
            console.log("Running " + allCustomCommands[i].commandTrigger);
            RunCustomCommand(ctx, allCustomCommands[i]);
        }
    }
});

client.login(process.env.TOKEN);