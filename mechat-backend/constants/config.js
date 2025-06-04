// import dotenv from "dotenv";
// dotenv.config(); 

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://talktalknow.vercel.app",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const CHATTU_TOKEN = "mechat-token";

export { corsOptions, CHATTU_TOKEN };
