import mysql from 'mysql2/promise';
import 'dotenv/config';

export const connection = mysql.createPool({
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME
});
