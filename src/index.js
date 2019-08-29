const Koa = require("koa");
const app = new Koa();

const PORT = 4000;

app.use((ctx, next) => {
  ctx.body = "Index Page";
  next();
});

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
