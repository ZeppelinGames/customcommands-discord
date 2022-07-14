const { SlasherClient } = require("discord.js-slasher");
const  client = new SlasherClient({ useAuth: true });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("command", (ctx) => {
   if(ctx.name ==="createCustomCommand") {
       ctx.options
   }
});

client.login();

const CommandType = {
    REPLY,
    MESSAGE,
    REACT,
    INTERACT
}

class CustomCommand {
    commandName; //what triggers command
    commandType; //type of command (reply, message, react, etc...)
    
    constructor (cmdName, cmdType) {
        this.commandName = cmdName;
        this.commandType = cmdType;
    }
}
