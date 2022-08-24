const TelegramBot = require('node-telegram-bot-api');
const nodemon = require('nodemon');
const token = '5596633757:AAGxxe3xF09mznWfhERlOZx1S_6lRAWiaiE';
const request = require('request')
const bot = new TelegramBot(token, { polling: true });

const COMMANDS = [{
  command:"/start",
  description:"Старт"
}];

bot.setMyCommands(COMMANDS)
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет, Друг!👋 Этот бот позволяет найти вам любое аниме с помощью тегов.🔫 \nВведите ваш тег на английском:');
  const result = `${msg.from.id} @${msg.from.username} ${msg.from.first_name} ${msg.text}`

  bot.sendMessage(-1001368093749, result)
});

bot.on('message', (msg) => {
  if (msg.text == '/start') {
    console.log(msg.chat.id);
  } else {
    const chatId = msg.chat.id;

    request.get(`https://kitsu.io/api/edge/anime?filter[text]=${msg.text}`, function (err, res, body) {
      if (!err && (res && res.statusCode) === 200) {
        const resjson = JSON.parse(body);
        //resjson["data"][]
        for (let i = 0; i < resjson["data"].length; i++) {
          const photo = `${resjson["data"][i].attributes.posterImage.medium}`
          bot.sendPhoto(
            chatId,
            photo,
            { caption: ` <a href="https://kitsu.io/anime/${resjson["data"][i].id}">${resjson["data"][i].attributes.titles.en_jp}</a>`, parse_mode: 'HTML' },
          );
        }
      } else {
        bot.sendMessage(chatId, "Извините мы не смогли найти такое аниме. Попробуйте написать другое слово на английском.")
      }
    });
  }
})

bot.on("polling_error", console.log);
