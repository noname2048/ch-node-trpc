import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000" })],
});

const user = await trpc.userById.query(1);
const createdUser = await trpc.userCreate.mutate({
  email: "test001@example.com",
});
