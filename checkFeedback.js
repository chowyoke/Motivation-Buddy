const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get all feedbacks (filter for dislikes)
  const feedbacks = await prisma.feedback.findMany({
    where: {
      feedback: 'dislike', // Only show dislikes; remove this line to see all
    },
    include: {
      user: true,    // Include user info (Post model)
      message: true, // Include message info
    }
  });

  console.dir(feedbacks, { depth: null });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

  // use node checkFeedback.js to print all feedback records in the terminal
  // use npx prisma studio to check feedback against user and message