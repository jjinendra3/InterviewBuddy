const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/start", require("./routes/start"));
app.use("/end", require("./routes/end"));
app.use("/server", require("./routes/server"));
app.use("/meet", require("./routes/meet"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
