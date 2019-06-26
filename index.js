const VkBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup');
const bot = new VkBot("892add9ad6f386306ccbf2981e68067989ead1e6847c181c484c62606b53448ca0e867aaa08d605e44798")
var MongoClient = require("mongodb").MongoClient
var url = "mongodb://127.0.0.1:27017"
var db_name = "hs_bot"

bot.on((ctx) => {
    if(ctx.message.text.toLowerCase() === "записаться"){
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            var dbo = db.db(db_name)
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
        })
    }else if(ctx.message.text === "2" || ctx.message.text.toLowerCase() === "нет"){
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            var dbo = db.db(db_name)
            dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, user) => {
                if(user){
                    ctx.reply("Пришлите, пожалуйста ваш Battle Tag")
                }else{
                    ctx.reply('Если хочешь катнуть - жми "Записаться"', null, Markup
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
                                }else{
                                    ctx.reply("Вы в очереди. Ожидайте")
                                }
                                db.close()
                            })
                        }else{
                            ctx.reply(user.pre_tag+" это точно ваш Battle tag?\n1 - Да\n2 - Нет", null, Markup
                            .keyboard(
                                [
                                    "Да", "Нет"
                                ]
                            ))
                            db.close()
                        }
                    })
                }else{
                    ctx.reply('Если хочешь катнуть - жми "Записаться"', null, Markup
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
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection("turn").findOne({user_id: ctx.message.from_id}, (err, result) => {
                if(err) throw err;
                if(!result){
                    ctx.reply('Если хочешь катнуть - жми "Записаться"', null, Markup
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
                    dbo.collection("turn").updateOne({user_id: ctx.message.from_id}, {$set: {pre_tag: ctx.message.text}}, (err) => {
                        if(err) throw err;
                        ctx.reply(ctx.message.text+" это ваш Battle tag?\n1 - Да\n2 - Нет", null, Markup
                        .keyboard(
                            [
                                "Да", "Нет"
                            ]
                        ))
                        db.close()
                    })
                }
            })
        })
    }
})
 
bot.startPolling()
