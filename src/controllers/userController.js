import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export const getOneUser = async(req,res) => {
  const { id } = req.params;

  try {
    const user = await connection.query(`
      SELECT users.id, users.name, SUM(urls.visits) AS "visitCount"
      FROM urls 
        JOIN users ON urls.user_id = users.id
      WHERE users.id = $1
      GROUP BY users.id`, [id])
    
    if(!user.rowCount) return res.sendStatus(404)

    const shortnedUrls = await connection.query(`
      SELECT u.id, u.short_url AS "shortUrl", u.url, u.visits AS "visitCount"
      FROM urls u
      WHERE u.user_id = $1`, [id]);

    const response = {...user.rows[0], shortnedUrls: shortnedUrls.rows}
    return res.status(200).send(response)
  }catch(err){
    return res.status(500).send(err)
  }
}