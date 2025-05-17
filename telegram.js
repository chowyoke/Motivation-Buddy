require("dotenv").config();
const { Telegraf } = require('telegraf');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Listen for messages (e.g., user sends their signup code)
bot.on('message:text', async (ctx) => {
  const code = ctx.message.text && ctx.message.text.trim();
  if (code && code.length === 6) {
    const user = await prisma.post.findFirst({ where: { signup_code: code } });
    if (user) {
      // Update the user's telegram_username in the database
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
});

bot.launch();