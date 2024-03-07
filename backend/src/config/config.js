import { config } from "dotenv";

config();

export let port = process.env.PORT;
export let db_url = process.env.DB_URL;
export let secret_key = process.env.SECRET_KEY;
export let email = process.env.EMAIL;
export let password = process.env.PASSWORD;