const VkBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup');
const bot = new VkBot("892add9ad6f386306ccbf2981e68067989ead1e6847c181c484c62606b53448ca0e867aaa08d605e44798")
var request = require("request")
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://admin:q2w3e4r5@ds243717.mlab.com:43717/heroku_flw6d545"
var db_name = "heroku_flw6d545"
var admin_token = ""
bot.on((ctx) => {
    if(ctx.message.text.toLowerCase() === "записаться"){
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            var dbo = db.db(db_name)
            dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, user) => {
                if(err) throw err;
                if(user){
                    var res = new Date(new Date() - new Date(user.date))
                    if(res.getMinutes() < 1440){
                        ctx.reply("Вы можете участвовать в дуэли лишь раз в сутки.")
                    }else{
                    dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, result) => {
                        if(err) throw err;
                        if(!result){
                            dbo.collection("turn").insertOne({user_id: ctx.message.from_id, pre_tag: null, tag: false}, (err, check) => {
                                if(err) throw err;
                                if(check){
                                    ctx.reply("Пришлите, пожалуйста ваш Battle Tag")
                                }else{
                                    ctx.reply("Проблема с сервером. Попробуйте позже.")
                                }
                                db.close()
                            })
                        }else if(result.tag){ 
                            ctx.reply("Вы в очереди. Ожидайте")
                            db.close()
                        }else{
                            ctx.reply("Пришлите, пожалуйста ваш Battle Tag")
                            db.close()
                        }
                    })
                    }
                }else{
                    dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, result) => {
                        if(err) throw err;
                        if(!result){
                            dbo.collection("turn").insertOne({user_id: ctx.message.from_id, pre_tag: null, tag: false}, (err, check) => {
                                if(err) throw err;
                                if(check){
                                    ctx.reply("Пришлите, пожалуйста ваш Battle Tag")
                                }else{
                                    ctx.reply("Проблема с сервером. Попробуйте позже.")
                                }
                                db.close()
                            })
                        }else if(result.tag){ 
                            ctx.reply("Вы в очереди. Ожидайте")
                            db.close()
                        }else{
                            ctx.reply("Пришлите, пожалуйста ваш Battle Tag")
                            db.close()
                        }
                    })
                }
            })
        })
    }else if(ctx.message.text === "2" || ctx.message.text.toLowerCase() === "нет"){
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            var dbo = db.db(db_name)
            dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, user) => {
                if(user){
                    if(user.tag){
                        ctx.reply("Вы в очереди. Ожидайте")
                    }else{
                        ctx.reply("Пришлите, пожалуйста ваш Battle Tag")
                    }
                }else{
                    ctx.reply('Если хочешь катнуть - жми "Записаться"\nЕсли хочешь пожаловаться на пользователя напиши: бан @aplinxy9plin\nГде aplinxy9plin - идентификатор пользователя ВК.', null, Markup
                    .keyboard([
                      'Записаться',
                    ])
                    .oneTime()
                  )
                }
            })
        })
    } else if(ctx.message.text === "1" || ctx.message.text.toLowerCase() === "да"){
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            var dbo = db.db(db_name)
            dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, user) => {
                if(err) throw err;
                if(user){
                    dbo.collection("turn").updateOne({user_id: ctx.message.from_id}, {$set: {tag: user.pre_tag}}, (err, check) => {
                        if(err) throw err;
                        if(check){
                            dbo.collection("turn").findOne({user_id: {$ne: ctx.message.from_id}, tag: {$ne: false}}, (err, enemy) => {
                                if(err) throw err;
                                if(enemy){
                                    ctx.reply("Тэг вашего соперника: "+enemy.tag);
                                    bot.sendMessage(enemy.user_id, 'Тэг вашего соперника: ' + user.pre_tag)
                                    dbo.collection("turn").remove({user_id: ctx.message.from_id})
                                    dbo.collection("turn").remove({user_id: enemy.user_id})
                                    dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, now_user) => {
                                        if(err) throw err;
                                        if(now_user){
                                            dbo.collection("users").updateOne({user_id: ctx.message.from_id}, {$set: {data: new Date()}}, (err, check) => {
                                                if(err) throw err;
                                                if(check){
                                                    dbo.collection("users").findOne({user_id: enemy.user_id}, (err, now_user) => {
                                                        if(err) throw err;
                                                        if(now_user){
                                                            dbo.collection("users").updateOne({user_id: enemy.user_id}, {$set: {data: new Date()}})
                                                        }else{
                                                            dbo.collection("users").insertOne({user_id: enemy.user_id, date: new Date(), strike: 0})
                                                        }
                                                        db.close()
                                                    })
                                                }
                                            })
                                        }else{
                                            dbo.collection("users").insertOne({user_id: ctx.message.from_id, date: new Date()}, (err, check) => {
                                                if(check){
                                                    dbo.collection("users").findOne({user_id: enemy.user_id}, (err, now_user) => {
                                                        if(err) throw err;
                                                        if(now_user){
                                                            dbo.collection("users").updateOne({user_id: enemy.user_id}, {$set: {data: new Date()}})
                                                        }else{
                                                            dbo.collection("users").insertOne({user_id: enemy.user_id, date: new Date()})
                                                        }
                                                        db.close()
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }else{
                                    ctx.reply("Вы в очереди. Ожидайте")
                                    db.close()
                                }
                            })
                        }else{
                            ctx.reply(user.pre_tag+" это точно ваш Battle tag?\n1 - Да\n2 - Нет", null, Markup
                            .keyboard(
                                [
                                    "Да", "Нет"
                                ]
                            ).oneTime())
                            db.close()
                        }
                    })
                }else{
                    ctx.reply('Если хочешь катнуть - жми "Записаться"\nЕсли хочешь пожаловаться на пользователя напиши: бан @aplinxy9plin\nГде aplinxy9plin - идентификатор пользователя ВК.', null, Markup
                    .keyboard([
                      'Записаться',
                    ])
                    .oneTime()
                  )
                  db.close()
                }
            })
        })
    }else{
        console.log(ctx.message.text.split("бан "))
        if(ctx.message.text.split("бан ").length > 1){
            var id = ctx.message.text.split("бан ")[1].split("[")[1].split("|")[0].split("id").join("")
            MongoClient.connect(url, (err, db) => {
                if(err) throw err;
                var dbo = db.db(db_name)
                dbo.collection("users").findOne({user_id: parseInt(id, 10)}, (err, user) => {
                    if(err) throw err;
                    if(user){
                        dbo.collection("users").updateOne({user_id: parseInt(id, 10)}, {$set: {strike: user.strike+1}}, (err, result) => {
                            if(result){
                                ctx.reply("Бан на пользователя [id"+id+"|@id"+id+"] успешно отправлен.")
                                if(user.strike+1 === 3){
                                    var jar = request.jar();
                                    jar.setCookie(request.cookie("remixlang=0"), "https://api.vk.com/method/groups.ban");

                                    var options = {
                                      method: 'GET',
                                      url: 'https://api.vk.com/method/groups.ban',
                                      qs: {
                                        access_token: admin_token,
                                        group_id: '183842916',
                                        owner_id: id,
                                        comment: 'Вы набрали 3 страйка.',
                                        v: '5.95'
                                      },
                                      jar: 'JAR'
                                    };

                                    request(options, function (error, response, body) {
                                      if (error) throw new Error(error);

                                      console.log(body);
                                    });
                                }
                            }
                        })
                    }else{
                        ctx.reply("Такого пользователя еще нет в базе.")
                    }
                })
            })
        }else{
            MongoClient.connect(url, (err, db) => {
                if (err) throw err;
                var dbo = db.db(db_name);
                dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, result) => {
                    if(err) throw err;
                    if(!result){
                        ctx.reply('Если хочешь катнуть - жми "Записаться"\nЕсли хочешь пожаловаться на пользователя напиши: бан @aplinxy9plin\nГде aplinxy9plin - идентификатор пользователя ВК.', null, Markup
                          .keyboard([
                            'Записаться',
                          ])
                          .oneTime()
                        )
                        db.close()
                    }else if(result.tag){ 
                        ctx.reply("Вы в очереди. Ожидайте")
                        db.close()
                    }else{
                        var tag = ctx.message.text;
                        var a = tag.split("#")
                        if(a.length > 1){
                            if(Number(a[1])){
                                if(parseInt(a[1], 10).toString().length < 4 || parseInt(a[1], 10).toString().length > 6){
                                    ctx.reply("Неверный формат Battle Tag, пришлите верный.")
                                }else{
                                    if(!Number(a[0])){
                                        dbo.collection("turn").updateOne({user_id: ctx.message.from_id}, {$set: {pre_tag: ctx.message.text}}, (err) => {
                                            if(err) throw err;
                                            ctx.reply(ctx.message.text+" это ваш Battle tag?\n1 - Да\n2 - Нет", null, Markup
                                            .keyboard(
                                                [
                                                    "Да", "Нет"
                                                ]
                                            ).oneTime())
                                            db.close()
                                        })
                                    }else{
                                        ctx.reply("Неверный формат Battle Tag, пришлите верный.")
                                    }
                                }	
                            }else{
                                ctx.reply("Неверный формат Battle Tag, пришлите верный.")
                            }	
                        }else{
                            ctx.reply("Неверный формат Battle Tag, пришлите верный.")
                        }
                    }
                })
            })   
        }
    }
})
 
bot.startPolling()
