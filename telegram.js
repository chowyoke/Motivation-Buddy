require("dotenv").config();
const { Telegraf } = require('telegraf');
const prisma = require('./prisma');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Listen for messages (e.g., user sends their signup code)
bot.on('message:text', async (ctx) => {
  try {
    console.log('Received message:', ctx.message.text);
    const code = ctx.message.text && ctx.message.text.trim();
    if (code && code.length === 6) {
      const user = await prisma.post.findFirst({ where: { signup_code: code } });
      if (user) {
        await prisma.post.update({
          where: { id: user.id },
          data: { telegram_username: ctx.from.username || null }
        });
      await ctx.reply("I have retrieved your sign up details. I will be sending you messages to uplift your spirits at the timings you have indicated!");
    } else {
      await ctx.reply('Invalid code. Please try again.');
      }
    } else {
      await ctx.reply('Please send your 6-character signup code.');
    }
  } catch (err) {
    console.error('Bot error:', err);
    await ctx.reply('An error occurred. Please try again later.');
  }
});

bot.launch();