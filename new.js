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
    var {text, from_id} = ctx.message
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db(db_name)
        dbo.collection("users").findOne({user_id: from_id}, (err, user) => {
            if(err) throw err;
            if(user){
                switch (user.status){
                    case 0:
                        if(user.date){
                            var res = new Date(new Date() - new Date(user.date))
                            if(res.getMinutes() >= 1440){
                                dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 1}})
                                ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                                ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0,phrases.blocks[0].food.length)]+"🤛🏾")
                            
                                ctx.reply(""+phrases.blocks[0].rules, null, Markup
                                  .keyboard([
                                    'Да 🍻',
                                    "Нет 🍻"
                                  ])
                                  .oneTime()
                                )
                                db.close()
                            }else{
                                if(!user.info_message){
                                    ctx.reply(phrases.blocks[3].time)
                                    dbo.collection("users").updateOne({user_id:from_id}, {$set: {info_message: true}}, () => {
                                        db.close()
                                    })
                                }else{
                                    db.close()
                                }
                            }
                        }else{
                            dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 1}})
                            ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                            ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0,phrases.blocks[0].food.length)]+"🤛🏾")
                        
                            ctx.reply(""+phrases.blocks[0].rules, null, Markup
                              .keyboard([
                                'Да 🍻',
                                "Нет 🍻"
                              ])
                              .oneTime()
                            )
                            db.close()
                        }
                        break;
                    case 1:
                        if(text === "Да 🍻" || text.toLowerCase() === "да" ){
                            dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 2}}, (err) => {
                                if(err) throw err;
                                ctx.reply(phrases.blocks[2].tag)
                            })
                        }else if(text === "Нет 🍻" || text.toLowerCase() === "нет"){
                            dbo.collection("users").updateOne({user_id: from_id}, {$set: {date: new Date(), status: 0}}, (err, result) => {
                                if(err) throw err;
                                if(result){
                                    ctx.reply("Ну, ничего.\n Держи ещё "+phrases.blocks[1].food[rand(0, phrases.blocks[1].food.length)] +"🤛🏾")
                                    ctx.reply(phrases.blocks[1].stories[rand(0, phrases.blocks[1].stories.length)])   
                                }else{
                                    ctx.reply("Ошибка сервера")
                                }
                            })
                        }else{
                            ctx.reply(""+phrases.blocks[0].rules, null, Markup
                              .keyboard([
                                'Да 🍻',
                                "Нет 🍻"
                              ])
                              .oneTime()
                            )
                        }
                        break;
                    case 2: 
                        var tag = ctx.message.text;
                        var a = tag.split("#")
                        if(a.length > 1){
                            if(Number(a[1])){
                                if(parseInt(a[1], 10).toString().length < 4 || parseInt(a[1], 10).toString().length > 6){
                                    ctx.reply(phrases.blocks[2].bad_tag)
                                }else{
                                    if(!Number(a[0])){
                                        dbo.collection("users").updateOne({user_id: from_id}, {$set: {pre_tag: text, status: 3}}, (err) => {
                                            if(err) throw err;
                                            ctx.reply(text+" это ваш Battle tag?\n1 - Да\n2 - Нет", null, Markup
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
                        break;
                    case 3: 
                        if(text === "1" || text.toLowerCase() === "да"){
                            dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 4}}, (err) => {
                                if(err) throw err;
                                dbo.collection("users").findOne({user_id: {$ne: from_id}, pre_tag: {$ne: false}, status: 4}, (err, enemy) => {
                                    if(err) throw err;
                                    if(enemy){
                                        ctx.reply(phrases.blocks[3].found);
                                        ctx.reply("BattleTag: " + enemy.pre_tag)
                                        bot.sendMessage(enemy.user_id, phrases.blocks[3].found)
                                        bot.sendMessage(enemy.user_id, "BattleTag: " + user.pre_tag)
                                        dbo.collection("users").updateOne({user_id: ctx.message.from_id}, {$set: {date: new Date(), enemy: enemy.user_id, status: 5}}, (err, check) => {
                                            if(err) throw err;
                                            if(check){
                                                dbo.collection("users").updateOne({user_id: enemy.user_id}, {$set: {date: new Date(), enemy: ctx.message.from_id, status: 5}}, (err) => {
                                                    if(err) throw err;
                                                    db.close()
                                                    setTimeout(() => {
                                                        bot.sendMessage(from_id, phrases.blocks[3].question, null, Markup.keyboard([
                                                            "Да👍🏾",
                                                            "Нет👎🏾"
                                                        ]).oneTime())
                                                        bot.sendMessage(enemy.user_id, phrases.blocks[3].question, null, Markup.keyboard([
                                                            "Да👍🏾",
                                                            "Нет👎🏾"
                                                        ]).oneTime())
                                                    }, 300000)
                                                })
                                            }
                                        })
                                    }else{
                                        ctx.reply(phrases.blocks[3].wait)
                                        db.close()
                                    }
                                })
                            })
                        }else if(text === "2" || text.toLowerCase() === "нет"){
                            dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 2}}, (err) => {
                                if(err) throw err;
                                ctx.reply(phrases.blocks[2].tag)
                                db.close()
                            })
                        }else{
                            ctx.reply(user.pre_tag+" это ваш Battle tag?\n1 - Да\n2 - Нет", null, Markup
                            .keyboard(
                                [
                                    "Да", "Нет"
                                ]
                            ).oneTime())
                            db.close()
                        }
                        break;
                    case 4: 
                        // nothing
                        break;
                    case 5: 
                        if(text === "Да👍🏾" || text.toLowerCase() === "да"){
                            dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 0}}, (err) => {
                                if(err) throw err;
                                ctx.reply(phrases.blocks[3].good)
                                db.close()
                            })
                        }else if(text === "Нет👎🏾" || text.toLowerCase() === "нет"){
                            dbo.collection("users").findOne({user_id: user.enemy}, (err, enemy) => {
                                if(enemy.strike === 2){
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
                                    ctx.reply(phrases.blocks[3].bad)
                                    dbo.collection("users").updateOne({user_id: user.enemy}, {$set: {strike: 0}})
                                    db.close()
                                }else{
                                    dbo.collection("users").updateOne({user_id: user.enemy}, {$set: {strike: enemy.strike+1}}, (err) => {
                                        if(err) throw err;
                                        dbo.collection("users").updateOne({user_id: from_id}, {$set: {status: 0}}, (err) => {
                                            if(err) throw err;
                                            ctx.reply(phrases.blocks[3].bad)
                                            db.close()
                                        })
                                    })
                                }
                            })
                        }else{
                            bot.sendMessage(from_id, phrases.blocks[3].question, null, Markup.keyboard([
                                "Да👍🏾",
                                "Нет👎🏾"
                            ]).oneTime())
                        }
                        break;
                }
            }else{
                dbo.collection("users").insertOne({user_id: from_id, pre_tag: null, tag: false, strike: 0, status: 1, date: null}, (err, result) => {
                    ctx.reply(phrases.blocks[0].hello[rand(0, phrases.blocks[0].hello.length)])
            
                    ctx.reply("Угощайся "+phrases.blocks[0].food[rand(0,phrases.blocks[0].food.length)]+"🤛🏾")
            
                    ctx.reply(""+phrases.blocks[0].rules, null, Markup
                      .keyboard([
                        'Да 🍻',
                        "Нет 🍻"
                      ])
                      .oneTime()
                    )
                    db.close()
                })
            }
        })
    })
})

let rand = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

bot.startPolling()