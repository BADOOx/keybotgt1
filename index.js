const Discord = require("discord.js")
const client = new Discord.Client()
const database = require("megadb")
const dbutton = require("discord-buttons")
const fs = require("fs")
client.login(require("./settings.json").token);
//setInterval(check(),10000)
client.on("ready",async() =>{
    console.log("~Aktif~")
    check();
    
    
})

let dbase = new database.crearDB('database');





dbutton(client);
const Commands = global.Commands = new Map();
console.log("--------------------------------");
console.log("Loading commands...");
fs.readdirSync("./Commands", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Commands/${file}`);
    if (prop.conf.commands == undefined || prop.run == undefined) return console.error(`[COMMAND] ${file} yüklenemedi.`);
    if (prop.conf.commands && prop.conf.commands.length > 0) {
        prop.conf.commands.forEach(aliase => Commands.set(aliase, prop));
    }
    if (prop.onLoad != undefined && typeof (prop.onLoad) == "function") prop.onLoad(client);
    console.log(`[COMMAND] ${prop.conf.commands.length} ${file} Yüklendi`);
});
console.log("--------------------------------");
console.log("Loading events...");
fs.readdirSync("./Events", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    client.on(prop.conf.event, prop.execute);
    console.log(`[EVENT] ${file} yüklendi.`);
});

console.log("--------------------------------");




setInterval(function(){
    check();
 }, 10000)

//}, 60000 * 2);


async function check(){
    let guild = client.guilds.cache.get(require("./settings.json").guild)
    let size = guild.members.cache.size

    let kodlar = await dbase.get(`kodlar`) || []
    guild.members.cache.map(async a =>{
        for (var i = 0; i < kodlar.length; i++) {
            await new Promise(function (resolve) {setTimeout(resolve, 1000)})    
            console.log("Kontrol ediliyor " + kodlar[i])
            let veri = await dbase.get(kodlar[i]) || undefined

            if(veri.claim){
                let memberTarih = veri.claim.time || undefined
                if(memberTarih !== undefined){
                    let dateNow = Date.now()
                    if(dateNow >= memberTarih){  
                        if(veri.claim.author == a.id){
                            if(veri.claim.checked == true) return
                            if(veri.date == "Unlimited") return
                        console.log(`${a.user.username} Kişisinin rolü kaldırılacak`)
                        let rol = guild.roles.cache.get(veri.role)
                        
                            try{a.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${kodlar[i]} Kodunu bozdurmuştun, kodun zamanı doldu. \`${rol.name}\` Rolünü üzerinden kaldırdık.`))}catch(err){}
                            a.roles.remove(rol)
                        
                        dbase.set(kodlar[i],{
                            "can_be_use": false,
                            "role": veri.role,
                            "date": veri.date,
                            "valid": veri.valid,
                            "claim": {
                              "author": veri.claim.author,
                              "time": veri.date +Date.now(),
                              "checked": true
                            }
                          })
                    }
                    }else{
                        console.log(`${a.user.username} Kişisinin zamanı dolmamış`)  
                    }
                }
            }
        }
    })
}




client.on("guildMemberRemove", async(member) =>{
    dbase.delete(`claimed_${kod}`)
})


