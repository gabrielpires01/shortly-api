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

const getShortUrl = async(req,res) => {
	const { shortUrl } = req.params;

	try {
		const short = await connection.query(`SELECT id, short_url AS "shortURL", url FROM urls WHERE short_url = $1`, [shortUrl]);

		return res.status(200).send(short.rows)
	} catch(err) {
		return res.status(500).send(err)
	}
}

const deleteUrl = async(req,res) => {
	const { id } = req.params;
	const { user } = res.locals;

	try {
		const url = await connection.query(`SELECT * FROM urls WHERE id = $1 AND user_id = $2`,[id, user.id])
		if(!url.rowCount) return res.sendStatus(404)
		console.log()
		await connection.query(`DELETE FROM urls WHERE id = $1`, [id]);
		return res.sendStatus(204)
	}catch(err) {
		return res.status(500).send(err)
	}
}

export { postShortenUrl, getShortUrl, deleteUrl };