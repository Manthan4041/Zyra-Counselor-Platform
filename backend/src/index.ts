import { createApp } from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: "info",
      message: `Action Center API listening on port ${PORT}`,
      timestamp: new Date().toISOString(),
    })
  );
});
