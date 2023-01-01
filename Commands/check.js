const {MessageEmbed} = require("discord.js");
const Discord = require("discord.js");
const moment = require("moment")

module.exports.run = async (client, message, args) => {
  
  
  if(message.channel.type !== "dm") return message.reply(`Bu komutu yalnızca DM kutusundan kullanabilirsin.`)
  
  
    let embed = new MessageEmbed()
        .setDescription(`Lütfen sana verilen kodu gir.`)
        .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setFooter("Kod Bozdur", message.author.avatarURL({dynamic: true}));

           await message.channel.send(message.author.toString(),  {embed: embed}).then(async msg => {              
            var filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 40000,
              errors: ['time']
            }).then(async collected => {
              let kod = collected.first().content
const database = require("megadb")
  let dbase = new database.crearDB('database');
              let search = await dbase.get(kod) || false
              if(search){
                //let veri = await dbase.get(`${kod}`) || false 
                
                if(search.can_be_use == false){
                  let embedx = new MessageEmbed()
                  .setDescription(`Bu kod zaten bozdurulmuş.`)
                  .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
                  .setColor("RANDOM")
                  .setFooter("Kod Bozdur", message.author.avatarURL({dynamic: true}));
                          return message.channel.send(embedx)
                }

              

                let guild = client.guilds.cache.get(require("../settings.json").guild)
                let member = guild.members.cache.get(message.author.id)
                let rol = guild.roles.cache.get(search.role)                
                if(rol) member.roles.add(rol)

                let zaman = search.date 
                if(zaman == "Unlimited"){
                  dbase.set(kod,{
                  "can_be_use": false,
                  "role": search.role,
                  "date": search.date,
                  "valid": search.valid,
                  "claim": {
                    "author": message.author.id,
                    "time": "Unlimited"
                  }
                })
              }else{
                
                dbase.set(kod,{
                  "can_be_use": false,
                  "role": search.role,
                  "date": search.date,
                  "valid": search.valid,
                  "claim": {
                    "author": message.author.id,
                    "time": zaman+Date.now()
                  }
                })

              
              }
         
                
                if(rol){
                  if(search.date == "Unlimited"){
                    let embedf = new MessageEmbed()
                    .setDescription(`\`${guild.name}\` Sunucusunda \`${rol.name}\` adlı rolü başarıyla aldın.\n\nKod geçerlilik süresi sınırsız, geri alınmayacak.`)
                    .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setFooter("Kod Bozdur", message.author.avatarURL({dynamic: true}));
                    return message.channel.send(embedf)
                  }else{
                    
                 let embedx = new MessageEmbed()
                .setDescription(`\`${guild.name}\` Sunucusunda \`${rol.name}\` adlı rolü başarıyla aldın.\n\n${moment(zaman+Date.now()).format('DD.MM.YYYY - HH:mm:ss')} Tarihinde geri alınacak.`)
                .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setFooter("Kod Bozdur", message.author.avatarURL({dynamic: true}));
                    return message.channel.send(embedx)}

                  }
                else return message.reply("Hata oluştu, rol bulunamadı. Yetkililere danış.")
              }else{
               let embedx = new MessageEmbed()
        .setDescription(`Hatalı kod girdin.`)
        .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setFooter("Kod Bozdur", message.author.avatarURL({dynamic: true}));
                return message.channel.send(embedx)
              }
              
            })
          })
          
}

exports.conf = {
    commands: ["check"],
    usage: "[p]eval",
    enabled: true,
    guildOnly: false
};