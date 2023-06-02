import { build, fake } from "test-data-bot";

export const userBuilder = () =>
  build("User").fields({
    userName: fake(f => f.name.firstName()),
    password: fake(f => f.internet.password())
  });
