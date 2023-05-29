import { PrismaClient } from "@prisma/client";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { createHTTPServer } from "@trpc/server/dist/adapters/standalone";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export type AppRouter = typeof appRouter;

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),
  userById: publicProcedure.input(z.number()).query(async (opts) => {
    const { input } = opts;
    const user = await prisma.user.findUnique({ where: { id: input } });
    return user;
  }),
  userCreate: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await prisma.user.create({ data: { email: input.email } });
    }),
});

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
