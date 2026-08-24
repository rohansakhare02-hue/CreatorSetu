const prisma = require("./prisma/lib/prisma");

async function test() {
    const count = await prisma.earning.count();
    console.log("Earning count:", count);
}

test()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });