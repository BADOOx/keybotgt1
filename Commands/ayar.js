const {MessageEmbed} = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms")

const moment =require("moment")
const client = new Discord.Client();  
const dbutton = require("discord-buttons");
module.exports.run = async (client, message, args) => {
  
  
  if(!message.member.hasPermission("ADMINISTRATOR")) return
  const database = require("megadb")
  let dbase = new database.crearDB('database');


    let embed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
        .setFooter("Ayarlar", message.guild.iconURL({dynamic: true}));
 

      let embed2 = new Discord.MessageEmbed().setDescription(`Ne yapmak istersin?`).setColor("RANDOM")
            let metin = new dbutton.MessageButton().setEmoji("🗨️").setLabel("Kod ayarla").setStyle("green").setID("mesaj")  
            let sil = new dbutton.MessageButton().setEmoji("🎠").setLabel("Kod sil").setStyle("red").setID("sil")  
            let liste = new dbutton.MessageButton().setEmoji("🥃").setLabel("Kod listesi").setStyle("green").setID("liste")  
            let kontrol = new dbutton.MessageButton().setEmoji("👹").setLabel("Kod Kontrol").setStyle("blurple").setID("kontrol")  
            
           let unqown = await message.channel.send(message.author.toString(),  {buttons : [metin,sil,liste,kontrol], embed: embed2, } ).then(async msg => {
              
  let Collector = await msg.createButtonCollector((fn) => fn, {
				time: 20000
			}); 

                Collector.on('collect', async (button) => {
                 let clicker = button.clicker.user.id;
                  if(clicker !== message.author.id) return button.reply.send("Üzgünüm yapamazsın.",true)

                         if(button.id == "mesaj"){
                        
                           let clicker = button.clicker
                           var filter = m => m.author.id === message.author.id;   
                       let msg = await button.channel.send("[Adım (1/3)]\n\nBozdurulacak geçerli bir kod gir.\n\n \nİptal etmek için `iptal` yaz")
                        await button.reply.defer();
                           message.channel.awaitMessages(filter, { max: 1, time: 30000, errors:['time']}).then(async collected => {
                           //let a = || collected.first().content;
                           let a = collected.first().content;
                           if(a == "iptal"){
                            await msg.edit(`Kurulum iptal edildi.`)
                             return
                           }
                           
                            try{
                                setTimeout(function(){
                                  collected.first().delete()
                                },100)
                          }catch(err){}
                            msg.edit(`[Adım (2/3)]\n\nBu kodu girince verilecek rolü gir. (ID)`)
                            
                            message.channel.awaitMessages(filter, { max: 1, time: 50000, errors:['time']}).then(async collected => {
                              
                              try{
                                  setTimeout(function(){
                                    collected.first().delete()
                                  },100)
                            }catch(err){}
                              
                            let a2 = collected.first().content;
                            
                            const gizlikod = a.slice(0, 4);
                            const gizlikod2 = a.slice(-3, a.length);
                            let rol = message.guild.roles.cache.get(a2)
                            //msg.edit(`[Adım (2/3)]\n\n\`${gizlikod}----${gizlikod2}\` kodunu girince artık \`${rol.name}\` rolü verilecek.`)
                            msg.edit(`[Adım (3/3)]\n\nBir kişi bu kodu girdikten ne kadar süre sonra silinecek?\n\nÖrnek:\n\`7 saat\`\n\`sınırsız\`\n\`5 gün\`\n\`10 dakika\``)
                            
                            message.channel.awaitMessages(filter, { max: 1, time: 50000, errors:['time']}).then(async collected => {
                              
                              try{
                                  setTimeout(function(){
                                    collected.first().delete()
                                  },100)
                            }catch(err){}
                            
                            let zaman = collected.first().content;
                            let args = zaman.split(' ').slice(0);
                            let secenekler = ["gün","saat","dakika","sınırsız","saniye"]
                            
                            if(!secenekler.includes(args[1])){
                              if(args[0] !== "sınırsız"){
                                return msg.edit(`Geçerli bir zaman belirtmedin.\n${secenekler.map(a => `**${a}**`).join('/')}`)
                              }
                            } 

                            let end;
                            if(args[0].toLowerCase() == "sınırsız"){
                              end = "Unlimited"
                            }else{
                              end = ms(args[0]+' '+args[1].replace('saniye', 'seconds').replace('dakika', 'minutes').replace('saat', 'hours').replace('saniye', 'seconds').replace('gün', 'day'));
                            }

                            
                            if(end !== "Unlimited") msg.edit(`[Bitti]\n\n\`${gizlikod}----${gizlikod2}\` kodunu girince artık \`${rol.name}\` rolü verilecek.\n\`${zaman}\` Süre sonra da geri alınacak.`)
                            if(end == "Unlimited") msg.edit(`[Bitti]\n\n\`${gizlikod}----${gizlikod2}\` kodunu girince artık \`${rol.name}\` rolü verilecek.\n\`**Geri alınmayacak**.`)
                            //msg.edit(`[Bitti]\n\nBu kodu girdikten ne kadar süre sonra silinecek.`)
                            
                            dbase.set(a,{
                              "can_be_use": true,
                              "role": a2,
                              "date": end,
                              "valid": `${zaman}`
                            })
                            dbase.push(`kodlar`, a)
                            //dbase.set(`canbeuse_${a}`, true)
                            //dbase.set(`rol_${a}`, a2)
                            //dbase.push(`kodlar`, a)
                            //dbase.set(`date_${a}`, end)
                         
                            })
                          })
                        })
                        }
                        //${secenekler.map(a => `**${a}**`).join('/')}

                        if(button.id == "sil"){
                        
                          let clicker = button.clicker
                          var filter = m => m.author.id === message.author.id;   
                          let veri = await dbase.get(`kodlar`)
                          if(veri.length == 0){
                            veri = ["Bulunamadı"]
                          }
                      await button.reply.send(`Kod listesi;\n${veri.map(codes => `**${codes}**`).join("\n")}`, true)
                      let msg = await button.channel.send(`[Adım (1/2)]\nSilinecek bir kod gir.\n\nİptal etmek için \`iptal\` yaz`)
                       //await button.reply.defer();
                          message.channel.awaitMessages(filter, { max: 1, time: 30000, errors:['time']}).then(async collected => {
                          //let a = || collected.first().content;
                          let a = collected.first().content;
                          if(a == "iptal"){
                            await msg.edit(`Silme işlemi iptal edildi.`)
                            return
                          }
                          let check = await dbase.get(a) || false
                          if(!check) return msg.edit(`Böyle bir kod bulunamadı.`)                       
                           try{
                               setTimeout(function(){
                                 collected.first().delete()
                               },100)
                         }catch(err){}
                           msg.edit(`[Adım (2/2)]\n\n${a} Kodunu silmek istediğine emin misin?\n \`evet\`/\`hayır\``)
                           
                           message.channel.awaitMessages(filter, { max: 1, time: 20000, errors:['time']}).then(async collected => {
                             
                             try{
                                 setTimeout(function(){
                                   collected.first().delete()
                                 },100)
                           }catch(err){}
                             
                           let a2 = collected.first().content;
                           if(a2.toLowerCase() == "evet"){
                            let getUser = await dbase.get(a) 
                            if(getUser.claim){
                            let member = message.guild.members.cache.get(getUser.claim.author)
                            if(member){
                              if(member.roles.cache.has(getUser.role)){
                                member.roles.remove(getUser.role)
                                let rol = member.guild.roles.cache.get(getUser.role)
                                try{member.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${a} Kodunu bozdurmuştun, kod yetkililer tarafından silindiği için. \`${rol.name}\` Rolünü üzerinden kaldırdık.`))}catch(err){console.log(err)}

                                await dbase.delete(a)
                                let deletex = veri.filter(g => !g.includes(a));
                                
                                await dbase.set('kodlar', deletex)
                                return msg.edit(`[Bitti]\n\n${a} Kodu silindi ${getUser.claim.author} ID'li kişiden ${rol.name} rolü kaldırıldı.`)
                              }else{
                                await dbase.delete(a)
                                let deletex = veri.filter(g => !g.includes(a));
                                
                                await dbase.set('kodlar', deletex)
                                return msg.edit(`[Bitti]\n\n${a} Kodu silindi ${getUser.claim.author} bu kodu almıştı, süresi dolmuştu ya da role sahip değildi. `)
                              }
                            }


                            }else{
                              await dbase.delete(a)
                                let deletex = veri.filter(g => !g.includes(a));
                                
                                await dbase.set('kodlar', deletex)
                                return msg.edit(`[Bitti]\n\n${a} Kodu silindi kimse bu kodu kullanmamıştı.`)
                            }

                          
                           }else{
                             return msg.edit(`[Bitti]\n\n${a} Kodu silinmedi.`)
                           }
                         })
                       })
                       }
                        

                       if(button.id == "liste"){
                        
                        let clicker = button.clicker
                        var filter = m => m.author.id === message.author.id;   
                        let veri = await dbase.get(`kodlar`)
                        if(veri.length == 0){
                          veri = ["Bulunamadı"]
                        }
                    await button.reply.send(`[Bitti]\nKod listesi;\n${veri.map(codes => `**${codes}**`).join("\n")}\n\nKod sayısı: ${veri.length}`,true)
                     
                      
                     }



                     if(button.id == "kontrol"){
                        
                      let clicker = button.clicker
                      var filter = m => m.author.id === message.author.id;   
                      let veri = await dbase.get(`kodlar`)
                      if(veri.length == 0){
                        veri = ["Bulunamadı"]
                      }
                  await button.reply.send(`Kod listesi;\n${veri.map(codes => `**${codes}**`).join("\n")}`, true)
                  let msg = await button.channel.send(`[Adım (1/1)]\n\nKontrol edilecek kodu gir.\n\nİptal etmek için \`iptal\` yaz`)
                   //await button.reply.defer();
                      message.channel.awaitMessages(filter, { max: 1, time: 30000, errors:['time']}).then(async collected => {
                      //let a = || collected.first().content;
                      let a = collected.first().content;
                      if(a == "iptal"){
                        await msg.edit(`Kontrol işlemi iptal edildi.`)
                        return
                      }
                      let check = await dbase.get(a) || false
                      if(!check) return msg.edit(`Böyle bir kod bulunamadı.`)                       
                      
                      if(check.claim){
                        let msgx = "Kodu alan kişi:"
                        msgx = msgx + " <@" + check.claim.author +">("+check.claim.author+")\n"
                     
                        if(!check.claim.time !== "Unlimited"){

                          if(Date.now() >= check.claim.time){
                           msgx = msgx + "Kod geçerliliği:\`" + moment(check.claim.time).format('DD.MM.YYYY - HH:mm:ss') +"\` (Bitmiş)\n"
                            
                          }else{
                            msgx = msgx + "Kod geçerliliği:\`" + moment(check.claim.time).format('DD.MM.YYYY - HH:mm:ss') + "\` (Devam ediyor)\n"
                          }
                        }else{
                          msgx = msgx + "Kod geçerliliği: \`Sınırsız\`\n"
                           
                        }

                        msgx = msgx + `Kod geçerlilik süresi: \`${check.valid}\`\n`
                        msgx = msgx + `Kod rolü: \`${check.role}\`\n`
                        try{setTimeout(function(){msg.delete()},100)}catch(err){}
                        await button.reply.edit(`[\`${a}\` İçin Bilgiler]\n${msgx}`,true)
                      }else{
                        let msgx = "Kodu kimse almamış."
                          msgx = msgx + "Kod geçerlilik süresi:" + check.claim.valid + "\n"
                          msgx = msgx + `Kod rolü: \`${check.role}\`\n`
                          try{setTimeout(function(){msg.delete()},100)}catch(err){}
                          await button.reply.edit(`[\`${a}\` İçin Bilgiler]\n${msgx}`,true)
                        }
                        try{
                          setTimeout(function(){
                            collected.first().delete()
                          },100)
                    }catch(err){}
                      })
                    }
              })
            })
          
}

exports.conf = {
    commands: ["ayar"],
    usage: "[p]eval",
    enabled: true,
    guildOnly: true
};