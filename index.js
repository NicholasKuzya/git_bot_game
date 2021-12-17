const TelegramBot = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token = '5029374023:AAH1_M-wZ4Uj0mU5Q4RBGHW1vN_PB7oLFaE'

const bot = new TelegramBot(token, {polling: true})

const chats = {};


const startGame = async (chatid) => {
    await bot.sendMessage(chatid, 'Сейчас я загадаю цифру от 0 до 9, а ты балбес попробуй её угадать ;) ')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatid] = randomNumber;
    await bot.sendMessage(chatid, 'Ну шо балбес отгадывай!)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Получить информацию о себе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatid = msg.chat.id; 
    
        if(text === '/start') {
            // await bot.sendSticker(chatid, '') в кавычках ссылку на стикер
            return bot.sendMessage(chatid, 'Добро пожаловать' + (msg.from.first_name) + (msg.from.last_name))
        }
        if(text === '/info') {
            return bot.sendMessage(chatid, 'Тебя зовут ' + (msg.from.first_name) + (msg.from.last_name))
        }
        if(text === '/game') {
            return startGame(chatid);
        }
        return bot.sendMessage(chatid, 'Я тебя не понимаю), пожалуйста выбери то что тебе нужно и не занимайся самодеятельностью:)')
    })


    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatid = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatid)
        }
        if(data === chats[chatid]) {
            return await bot.sendMessage(chatid, 'Ах ты умный ублюженок' + chats[chatid], againOptions)
        } else {
            return bot.sendMessage(chatid, 'Ты не угадал лошара, я загадал цифру ' + (chats[chatid]) + ' хехе', againOptions);
        }
    })

}

start()