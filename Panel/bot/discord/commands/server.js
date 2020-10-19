const axios = require('axios');
exports.run = async (client, message, args) => {
    const otherargs = message.content.split(' ').slice(3).join(' ');
    if (userData.get(message.author.id) == null) {
        message.channel.send("Oh no, Seems like you do not have an account linked to your discord ID. \nIf you have not made an account yet please check out `" + config.DiscordBot.Prefix + "getstarted` to create an account \nIf you already have an account link it using `" + config.DiscordBot.Prefix + "link`")
    } else {
        if (!args[0]) {
            //No args
            let embed = new Discord.RichEmbed()
                .setTitle('__**Commands**__ \nCreate a server: `' + config.DiscordBot.Prefix + 'server create type servername` \nServer Types: `' + config.DiscordBot.Prefix + 'server create list`')
            message.channel.send(embed)

        } else if (args[0].toLowerCase() == "create") {
            //Do server creation things
            if (!args[1]) {
                let embed = new Discord.RichEmbed()
                    .setTitle('__**Commands**__ \nCreate a server: `' + config.DiscordBot.Prefix + 'server create type servername` \nServer Types: `' + config.DiscordBot.Prefix + 'server create list`')
                message.channel.send(embed)
            }
            if (args[1].toLowerCase() === "nodejs") {
                //Code for nodejs server
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 5,
                        "egg": 16,
                        "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_nodejs-12",
                        "startup": `if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == "1" ]]; then git pull; fi && /usr/local/bin/npm install --production && /usr/local/bin/node /home/container/{{BOT_JS_FILE}}`,
                        "limits": {
                            "memory": 0,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "INSTALL_REPO": null,
                            "INSTALL_BRANCH": null,
                            "USER_UPLOAD": "0",
                            "AUTO_UPDATE": "0",
                            "BOT_JS_FILE": "index.js"
                        },
                        "feature_limits": {
                            "databases": 0,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/servers",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        },
                        data: data,
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                        console.log(response)
                    }).catch(error => {
                        if (error.includes("400")) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node is out of ports. \nPlease wait for a host admin to open more ports.")
                            message.channel.send(embed)
                            message.channel.send('<@137624084572798976> Assign more ports.')
                        } else if (error.includes('504')) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node did not respond in time. You could re-run the command or a outage might be happening if this happens multiple times")
                            message.channel.send(embed)
                        } else {
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        }
                    })
                }
            } else if (args[1].toLowerCase() === "python") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 5,
                        "egg": 22,
                        "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_python-3.8",
                        "startup": "${STARTUP_CMD}",
                        "limits": {
                            "memory": 0,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "STARTUP_CMD": "bash"
                        },
                        "feature_limits": {
                            "databases": 0,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/servers",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        },
                        data: data,
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        if (error.includes("400")) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node is out of ports. \nPlease wait for a host admin to open more ports.")
                            message.channel.send(embed)
                            message.channel.send('<@137624084572798976> Assign more ports.')
                        } else if (error.includes('504')) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node did not respond in time. You could re-run the command or a outage might be happening if this happens multiple times")
                            message.channel.send(embed)
                        } else {
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        }
                    })
                }
            } else if (args[1].toLowerCase() === "java") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 5,
                        "egg": 25,
                        "docker_image": "quay.io/parkervcp/pterodactyl-images:debian_openjdk-8-jre",
                        "startup": "${STARTUP_CMD}",
                        "limits": {
                            "memory": 0,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "STARTUP_CMD": "bash"
                        },
                        "feature_limits": {
                            "databases": 0,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [3],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/servers",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        },
                        data: data,
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        if (error.includes("400")) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node is out of ports. \nPlease wait for a host admin to open more ports.")
                            message.channel.send(embed)
                            message.channel.send('<@137624084572798976> Assign more ports.')
                        } else if (error.includes('504')) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node did not respond in time. You could re-run the command or a outage might be happening if this happens multiple times")
                            message.channel.send(embed)
                        } else {
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        }
                    })
                }
            } else if (args[1].toLowerCase() === "minecraft.paper") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 1,
                        "egg": 3,
                        "docker_image": "quay.io/pterodactyl/core:java",
                        "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}",
                        "limits": {
                            "memory": 2048,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "MINECRAFT_VERSION": "latest",
                            "SERVER_JARFILE": "server.jar",
                            "DL_PATH": "https://papermc.io/api/v1/paper/1.16.1/138/download",
                            "BUILD_NUMBER": "latest"
                        },
                        "feature_limits": {
                            "databases": 0,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/servers",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        },
                        data: data,
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        
                    })
                }
            } else if (args[1].toLowerCase() === "minecraft.forge") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 1,
                        "egg": 2,
                        "docker_image": "quay.io/pterodactyl/core:java",
                        "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
                        "limits": {
                            "memory": 2048,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "SERVER_JARFILE": "server.jar",
                            "MC_VERSION": "latest",
                            "FORGE_VERSION": "1.16.3"
                        },
                        "feature_limits": {
                            "databases": 2,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/servers",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        },
                        data: data,
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        
                    })
                }
            } else if (args[1].toLowerCase() === "fivem") {
                if (!otherargs) {
                    message.channel.send('You must provide a server name!')
                } else {
                    //Data to send
                    const data = {
                        "name": otherargs,
                        "user": userData.get(message.author.id + ".consoleID"),
                        "nest": 9,
                        "egg": 26,
                        "docker_image": "quay.io/parkervcp/pterodactyl-images:base_alpine",
                        "startup": `$(pwd)/alpine/opt/cfx-server/ld-musl-x86_64.so.1 --library-path "$(pwd)/alpine/usr/lib/v8/:$(pwd)/alpine/lib/:$(pwd)/alpine/usr/lib/" -- $(pwd)/alpine/opt/cfx-server/FXServer +set citizen_dir $(pwd)/alpine/opt/cfx-server/citizen/ +set sv_licenseKey {{FIVEM_LICENSE}} +set steam_webApiKey {{STEAM_WEBAPIKEY}} +set sv_maxplayers {{MAX_PLAYERS}} +set serverProfile default +set txAdminPort {{TXADMIN_PORT}} $( [ "$TXADMIN_ENABLE" == "1" ] || printf %s '+exec server.cfg' )`,
                        "limits": {
                            "memory": 2048,
                            "swap": 0,
                            "disk": 0,
                            "io": 500,
                            "cpu": 0
                        },
                        "environment": {
                            "FIVEM_LICENSE": "6pc7xbhxoep0ms5m5rsg09k11plzib6w",
                            "MAX_PLAYERS": "32",
                            "SERVER_HOSTNAME": "My new FXServer!",
                            "FIVEM_VERSION": "latest",
                            "DOWNLOAD_URL": null,
                            "STEAM_WEBAPIKEY": "none",
                            "TXADMIN_PORT": "40120",
                            "TXADMIN_ENABLE": "0"
                        },
                        "feature_limits": {
                            "databases": 2,
                            "allocations": 1
                        },
                        "deploy": {
                            "locations": [5],
                            "dedicated_ip": false,
                            "port_range": []
                        },
                        "start_on_completion": false
                    };

                    //Sending the data:
                    axios({
                        url: config.Pterodactyl.hosturl + "/api/application/servers",
                        method: 'POST',
                        followRedirect: true,
                        maxRedirects: 5,
                        headers: {
                            'Authorization': 'Bearer ' + config.Pterodactyl.apikey,
                            'Content-Type': 'application/json',
                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                        },
                        data: data,
                    }).then(response => {
                        let embed = new Discord.RichEmbed()
                            .setColor(`GREEN`)
                            .addField(`__**Status:**__`, response.statusText)
                            .addField(`__**Created for user ID:**__`, data.user)
                            .addField(`__**Server name:**__`, data.name)
                            .addField(`__**Type:**__`, args[1].toLowerCase())
                        message.channel.send(embed)
                    }).catch(error => {
                        if (error.includes("400")) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node is out of ports. \nPlease wait for a host admin to open more ports.")
                            message.channel.send(embed)
                            message.channel.send('<@137624084572798976> Assign more ports.')
                        } else if (error.includes('504')) {
                            const embed = new Discord.RichEmbed()
                                .setColor('RED')
                                .addField(`__**ERROR:**__`, "Node did not respond in time. You could re-run the command or a outage might be happening if this happens multiple times")
                            message.channel.send(embed)
                        } else {
                        let embed1 = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .addField(`__**FAILED:**__`, "Please contact a host admin. \n\nError: `" + error + "`")
                        message.channel.send(embed1)
                        message.channel.send("<@137624084572798976> Issue when creating server. \nResponse: `" + error + "`")
                        }
                    })
                }
            } else {
                //Anything else
                let embed2 = new Discord.RichEmbed()
                    .setColor(`RED`)
                    .addField(`__**Supported By Server Creation:**__`, "NodeJS \nPython \nJava \nMinecraft.Paper \nMinecraft.Forge \nFiveM")
                message.channel.send(embed2)
            }
        } else if (args[0].toLowerCase() == "delete") {
            //delete server things
            message.channel.send('Uh this isnt done yet...')
        } else if (args[0].toLowerCase() == "manage") {
            message.channel.send('Uh this isnt done yet...')
        } else if (args[0].toLowerCase() == "status") {
            axios({
                url: config.Pterodactyl.hosturl + "/api/client/servers/" + args[1],
                method: 'GET',
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': 'Bearer ' + config.Pterodactyl.apikeyclient,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                }
            }).then(response => {
                //response.data.attributes - identifier - node - limits - feature_limits (LIMITS: limits: { memory: 0, swap: -1, disk: 5000, io: 500, cpu: 0 }) (Feature_Limits:  feature_limits: { databases: 0, allocations: 0, backups: 0 })
                console.log(response.data.attributes.variables)
            });
        }
    };
};