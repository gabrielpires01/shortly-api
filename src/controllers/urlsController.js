import { connection } from "../database.js";
import { v4 as uuid } from 'uuid';

const postShortenUrl = async(req, res) => {
	const { url } = req.body;
	const { user } = res.locals;

	const token = uuid();
	const shortUrl = token.split('-')[0];
	try {
		await connection.query(`INSERT INTO urls (short_url, url, user_id) VALUES ($1,$2,$3)`, [shortUrl, url, user.id])
		return res.send(shortUrl)
	} catch(err) {
		return res.status(500).send(err)
	}
}

export { postShortenUrl };