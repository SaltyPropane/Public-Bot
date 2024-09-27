To change the value of the payout you need to change two files. Mypayout.js and totalpayout.js. const totalPayout = Math.floor((userPercentage / 100) * 10_000_000).toLocaleString(); This line needs to be changed to what ever value you want it to be.

Alot of this is just spaghetti code that I threw into chatgpt to fix my issues. Idk how any of the database shit works as im awful with sql.

Theres a few libraries you'll need to install to make this work. I think the main ones are sqlite3 and discordjs(obvisouly). You'll also need to change the color/name of each output to match the name of your gang. You'll need to figure out how to launch it on your own.

Be sure to add a role named: "Discord-Admin" to run any of the commands that make changes etc.


edit* I've added the config.json file. If you want to add a command to change the values of every item in there feel free. It's easy to do I'm just lazy.
