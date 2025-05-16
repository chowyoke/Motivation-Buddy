const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.message.createMany({
    data: [
      { interest_area: 'Foodie', message_text: 'Just like the best recipes require patience and the right ingredients, your success is a blend of hard work and passion. Keep stirring the pot!' },
      { interest_area: 'Foodie', message_text: 'Remember, even the richest flavors take time to develop. Your hard work is the secret sauce that will make your dreams irresistible.' },
      { interest_area: 'Sports and Fitness', message_text: 'Champions aren’t born; they’re made through sweat, dedication, and heart. Keep training hard and play your best game!' },
      { interest_area: 'Sports and Fitness', message_text: 'Just like every rep counts in the gym, every small effort today builds the strength you need for tomorrow’s victory. Keep pushing forward!' },
      { interest_area: 'Travelling', message_text: 'Life is a journey filled with new paths and adventures. Embrace every step and discover the amazing places your dreams can take you!' },
      { interest_area: 'Travelling', message_text: 'Your passion for travel shows your courage to explore the unknown. Bring that same spirit to work, and you’ll discover new horizons in your career.' },
      // Add more messages here
    ]
  });
  console.log('Messages seeded!');
}

main()
  .catch(e => { throw e })
  .finally(async () => { await prisma.$disconnect() });