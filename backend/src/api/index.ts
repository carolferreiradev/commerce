import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { routerFiles } from '../routes';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.use(routerFiles);

app.listen(PORT, () => {
	console.log('🚀 Server is running');
});
