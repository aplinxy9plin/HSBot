const VkBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup');
const bot = new VkBot("892add9ad6f386306ccbf2981e68067989ead1e6847c181c484c62606b53448ca0e867aaa08d605e44798")
var request = require("request")
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://admin:q2w3e4r5@ds243717.mlab.com:43717/heroku_flw6d545"
var db_name = "heroku_flw6d545"
var admin_token = ""
var group_id = '183842916'
var phrases = require("./phrases.json")
bot.on((ctx) => {
    MongoClient.connect(url, (err, db) => {
        dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, user) => {
            if(err) throw err;
            if(user && (new Date(new Date() - new Date(user.date))).getMinutes() < 1440){
                ctx.reply(phrases.blocks[3].time)
                db.close()
            }else{
                if(ctx.message.text === "Да 🍻"){
                    MongoClient.connect(url, (err, db) => {
                        if(err) throw err;
                        var dbo = db.db(db_name)
                        dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, user) => {
                            if(err) throw err;
                            if(user){
                                var res = new Date(new Date() - new Date(user.date))
                                if(res.getMinutes() < 1440){
                                    ctx.reply(phrases.blocks[3].time)
                                }else{
                                dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, result) => {
                                    if(err) throw err;
                                    if(!result){
                                        dbo.collection("turn").insertOne({user_id: ctx.message.from_id, pre_tag: null, tag: false}, (err, check) => {
                                            if(err) throw err;
                                            if(check){
                                                ctx.reply(phrases.blocks[2].tag)
                                            }else{
                                                ctx.reply("Проблема с сервером. Попробуйте позже.")
                                            }
                                            db.close()
                                        })
                                    }else if(result.tag){ 
                                        ctx.reply(phrases.blocks[3].wait)
                                        db.close()
                                    }else{
                                        ctx.reply(phrases.blocks[2].tag)
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
                                                ctx.reply(phrases.blocks[2].tag)
                                            }else{
                                                ctx.reply("Проблема с сервером. Попробуйте позже.")
                                            }
                                            db.close()
                                        })
                                    }else if(result.tag){ 
                                        ctx.reply(phrases.blocks[3].wait)
                                        db.close()
                                    }else{
                                        ctx.reply(phrases.blocks[2].tag)
                                        db.close()
                                    }
                                })
                            }
                        })
                    })
                }else if(ctx.message.text === "Нет 🍻"){
                    MongoClient.connect(url, (err, db) => {
                        if(err) throw err;
                        var dbo = db.db(db_name)
                        dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, user) => {
                            if(user){
                                dbo.collection("users").updateOne({user_id: ctx.message.from_id}, {$set: {data: new Date()}})
                            }else{
                                dbo.collection("users").insertOne({user_id: enemy.user_id, date: new Date(), strike: 0})
                            }
                            ctx.reply("Ну, ничего. Держи ещё "+phrases.blocks[1].food[rand(0, phrases.blocks[1].food.length)])
                            ctx.reply(phrases.blocks[1].stories[phrases.blocks[1].stories.length])
                        })
                    })
                } else if(ctx.message.text === "Да👍🏾"){
                    MongoClient.connect(url, (err, db) => {
                        if(err) throw err;
                        var dbo = db.db(db_name)
                        dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, user) => {
                            if(err) throw err;  
                            if(user){
                                ctx.reply(phrases.blocks[3].good)
                            }else{
                                ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                                ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0, phrases.blocks[0].food.length)]+"🤛🏾")
            
                                ctx.reply(""+phrases.blocks[0].rules, null, Markup
                                  .keyboard([
                                    'Да 🍻',
                                    "Нет 🍻"
                                  ])
                                  .oneTime()
                                )
                            }
                        })
                    })
                } else if(ctx.message.text === "Нет👎🏾"){
                    MongoClient.connect(url, (err, db) => {
                        if(err) throw err;
                        var dbo = db.db(db_name)
                        dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, user) => {
                            if(err) throw err;
                            if(user){
                                dbo.collection("users").findOne({user_id: user.enemy}, (err, enemy) => {
                                    if(err) throw err;
                                    dbo.collection("users").updateOne({user_id: user.enemy}, {$set: {strike: enemy.strike+1}}, (err, result) => {
                                        if(err) throw err;
                                        if(result){
                                            ctx.reply(phrases.blocks[3].bad)
                                            if(enemy.strike+1 === 3){
                                                var jar = request.jar();
                                                jar.setCookie(request.cookie("remixlang=0"), "https://api.vk.com/method/groups.ban");
                
                                                var options = {
                                                  method: 'GET',
                                                  url: 'https://api.vk.com/method/groups.ban',
                                                  qs: {
                                                    access_token: admin_token,
                                                    group_id: group_id,
                                                    owner_id: enemy.user_id,
                                                    comment: 'Вы набрали 3 страйка.',
                                                    v: '5.95'
                                                  },
                                                  jar: 'JAR'
                                                };
                
                                                request(options, function (error, response, body) {
                                                  if (error) throw new Error(error);
                                                });
                                            }
                                        }
                                    })
                                })
                            }else{
                                ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                                ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0, phrases.blocks[0].food.length)]+"🤛🏾")
            
                                ctx.reply(""+phrases.blocks[0].rules, null, Markup
                                  .keyboard([
                                    'Да 🍻',
                                    "Нет 🍻"
                                  ])
                                  .oneTime()
                                )
                            }
                        })
                    })
                } else if(ctx.message.text === "2" || ctx.message.text.toLowerCase() === "нет"){
                    MongoClient.connect(url, (err, db) => {
                        if(err) throw err;
                        var dbo = db.db(db_name)
                        dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, user) => {
                            if(user){
                                if(user.tag){
                                    ctx.reply(phrases.blocks[3].wait)
                                }else{
                                    ctx.reply(phrases.blocks[2].tag)
                                }
                            }else{
                                ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                                ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0, phrases.blocks[0].food.length)]+"🤛🏾")
            
                                ctx.reply(""+phrases.blocks[0].rules, null, Markup
                                  .keyboard([
                                    'Да 🍻',
                                    "Нет 🍻"
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
                                                ctx.reply(phrases.blocks[3].found+" "+enemy.tag);
                                                bot.sendMessage(enemy.user_id, phrases.blocks[3].found+" " + user.pre_tag)
                                                dbo.collection("turn").remove({user_id: ctx.message.from_id})
                                                dbo.collection("turn").remove({user_id: enemy.user_id})
                                                dbo.collection("users").findOne({user_id: ctx.message.from_id}, (err, now_user) => {
                                                    if(err) throw err;
                                                    if(now_user){
                                                        dbo.collection("users").updateOne({user_id: ctx.message.from_id}, {$set: {data: new Date(), enemy: enemy.user_id}}, (err, check) => {
                                                            if(err) throw err;
                                                            if(check){
                                                                dbo.collection("users").findOne({user_id: enemy.user_id}, (err, now_user) => {
                                                                    if(err) throw err;
                                                                    if(now_user){
                                                                        dbo.collection("users").updateOne({user_id: enemy.user_id}, {$set: {data: new Date(), enemy: ctx.message.from_id}})
                                                                    }else{
                                                                        dbo.collection("users").insertOne({user_id: enemy.user_id, date: new Date(), strike: 0, enemy: ctx.message.from_id})
                                                                    }
                                                                    db.close()
                                                                })
                                                            }
                                                        })
                                                    }else{
                                                        dbo.collection("users").insertOne({user_id: ctx.message.from_id, date: new Date(), enemy: enemy.user_id}, (err, check) => {
                                                            if(check){
                                                                dbo.collection("users").findOne({user_id: enemy.user_id}, (err, now_user) => {
                                                                    if(err) throw err;
                                                                    if(now_user){
                                                                        dbo.collection("users").updateOne({user_id: enemy.user_id}, {$set: {data: new Date(), enemy: ctx.message.from_id}})
                                                                    }else{
                                                                        dbo.collection("users").insertOne({user_id: enemy.user_id, date: new Date(), strike: 0, enemy: ctx.message.from_id})
                                                                    }
                                                                    db.close()
                                                                })
                                                            }
                                                        })
                                                    }
                                                    setTimeout(() => {
                                                        ctx.reply(phrases.blocks[3].question, null, Markup.keyboard([
                                                            "Да👍🏾",
                                                            "Нет👎🏾"
                                                        ]).oneTime())
                                                        bot.sendMessage(phrases.blocks[3].question, null, Markup.keyboard([
                                                            "Да👍🏾",
                                                            "Нет👎🏾"
                                                        ]).oneTime())
                                                    }, 300000)
                                                })
                                            }else{
                                                ctx.reply(phrases.blocks[3].wait)
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
                                ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                                ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0, phrases.blocks[0].food.length)]+"🤛🏾")
            
                                ctx.reply(""+phrases.blocks[0].rules, null, Markup
                                  .keyboard([
                                    'Да 🍻',
                                    "Нет 🍻"
                                  ])
                                  .oneTime()
                                )
                                db.close()
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
                                ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                                ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0, phrases.blocks[0].food.length)]+"🤛🏾")
            
                                ctx.reply(""+phrases.blocks[0].rules, null, Markup
                                  .keyboard([
                                    'Да 🍻',
                                    "Нет 🍻"
                                  ])
                                  .oneTime()
                                )
                                db.close()
                            }else if(result.tag){ 
                                ctx.reply(phrases.blocks[3].wait)
                                db.close()
                            }else{
                                var tag = ctx.message.text;
                                var a = tag.split("#")
                                if(a.length > 1){
                                    if(Number(a[1])){
                                        if(parseInt(a[1], 10).toString().length < 4 || parseInt(a[1], 10).toString().length > 6){
                                            ctx.reply(phrases.blocks[2].bad_tag)
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
                                                ctx.reply(phrases.blocks[2].bad_tag)
                                            }
                                        }	
                                    }else{
                                        ctx.reply(phrases.blocks[2].bad_tag)
                                    }	
                                }else{
                                    ctx.reply(phrases.blocks[2].bad_tag)
                                }
                            }
                        })
                    })
                }
            }
        })
    })
})
 
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

bot.startPolling()
