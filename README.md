# Custom Commands
Discord bot for creating custom commands. Allows anyone (currently) to create commands.  

# Basic usage  
````/createcustomcommand <command trigger regex> ```<command event code>``` ````  

For example:
````/createcustomcommand /ping ```reply(pong);``` ````  

More than one line of code can be used at a time. For example:  
````
/createcustomcommand /ping ```
reply(pong);  
message(hey ${user});  
```
````  

Current avaliable commands to use in command event code:  
`reply(<message>)`: Replys to the user that triggered the command  
`message(<message>)`: Sends a message to the channel that the command was triggered in   
`send(<file/image link)`: Sends a file or image to the channel that the command was triggered in (***WARNING: Still in progress. Local files can be accessed with this command. Be careful***)  

Current avaliable message replacements:  
`${user}`: Replaces with the username of the user who triggered the command

# Roadmap
- Add `send` local file security
- Saving and loading of custom commands
- Allow editing and deleting of custom commands
