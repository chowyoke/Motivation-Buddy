require("dotenv").config();
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters'); 
const prisma = require('./prisma');
const cron = require('node-cron'); //Scheduling with node-cron
const { DateTime } = require('luxon');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);


// Respond to /start command
bot.start((ctx) => {
  ctx.reply('Welcome! Please enter your 6-digit code.');
});


// Catch-all handler for debugging
// may want to remove or limit the catch-all handler in production to avoid excessive logs.
bot.on('message', async (ctx, next) => {
  console.log('Catch-all: Received any message:', ctx.message.text);
  await next(); // Pass control to the next matching handler
});

bot.command('unsubscribe', async (ctx) => {
  try {
    await prisma.post.updateMany({
      where: { telegram_chat_id: ctx.chat.id.toString() },
      data: { telegram_chat_id: null }
    });
    //to insert url to motivation buddy
    await ctx.reply('Sad that you are unsubscribing from the motivational messages. Visit Motivation Buddy when you want to resubscribe!');
  } catch (err) {
    console.error('Unsubscribe error:', err);
    await ctx.reply('An error occurred while unsubscribing. Please try again later.');
  }
});

// Respond to any other text message (potential signup code)
bot.on(message('text'), async (ctx) => {
  console.log('Text handler: Received text message:', ctx.message.text);
  try {
    const code = ctx.message.text && ctx.message.text.trim();


    // Ignore /start (already handled above)
    if (code.startsWith('/')) return;


    if (code.length === 6) {
      // Database lookup
      const user = await prisma.post.findFirst({ where: { signup_code: code } });
      console.log('Looked up code:', code, 'User found:', !!user);

      if (user) {
        await prisma.post.update({
          where: { id: user.id },
          data: { 
            telegram_username: ctx.from.username || null,
        telegram_chat_id: ctx.chat.id // <-- Store chat id for scheduling
      }
    });
    await ctx.reply("I have retrieved your sign up details. I will be sending you messages to uplift your spirits at the timings you have indicated!");
      } else {
        await ctx.reply('Invalid code. Please enter again.');
      }
    } else {
      await ctx.reply('Please enter your 6-digit code.');
    }
  } catch (err) {
    console.error('Bot error:', err);
    await ctx.reply('An error occurred. Please try again later.');
  }
});

// Scheduled task: runs every minute
cron.schedule('* * * * *', async () => {
  // Convert current UTC time to Asia/Singapore time
  const now = DateTime.utc().setZone('Asia/Singapore');
  let displayHour = now.hour % 12 || 12;
  let ampm = now.hour < 12 ? 'am' : 'pm';
  let formatted = `${displayHour.toString().padStart(2, '0')}:${now.minute.toString().padStart(2, '0')}${ampm}`;

  console.log(`[Cron] Checking messages for time: ${formatted} (Asia/Singapore)`);

  const users = await prisma.post.findMany({
    where: {
      message_times: { has: formatted }
    }
  });

for (const user of users) {
    if (user.telegram_chat_id) {
      try {
        // Get user's interests, or all interests if none selected
let interests = user.interests && user.interests.length > 0 ? user.interests : null;

if (!interests) {
  // Fetch all distinct interest areas from the Message table
  const allInterests = await prisma.message.findMany({
    select: { interest_area: true },
    distinct: ['interest_area'],
  });
  interests = allInterests.map(i => i.interest_area);
}

if (interests.length > 0) {
  const interest = interests[Math.floor(Math.random() * interests.length)];
  const messages = await prisma.message.findMany({
    where: { interest_area: interest }
  });

  let messageText = "Stay motivated!";

  if (messages.length > 0) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    messageText = msg.message_text;
  } else {
    messageText = `Stay motivated! (No messages found for interest: ${interest})`;
  }

  await bot.telegram.sendMessage(user.telegram_chat_id.toString(), messageText);
  console.log(`[Cron] Message sent to ${user.telegram_username} (chat_id: ${user.telegram_chat_id})`);
} else {
  await bot.telegram.sendMessage(user.telegram_chat_id.toString(), "Stay motivated! (No interests available)");
  console.log(`[Cron] Message sent to ${user.telegram_username} (chat_id: ${user.telegram_chat_id}) - No interests available`);
}
      } catch (err) {
        console.error(`[Cron] Failed to send message to ${user.telegram_username} (chat_id: ${user.telegram_chat_id}):`, err);
      }
    } else {
      console.log(`[Cron] No telegram_chat_id for user ${user.name}`);
    }
  }
});
  
bot.launch().then(() => console.log('Bot is running...'));