import postgres from 'postgres'

const sql = postgres({ 
    host                 : import.meta.env.VITE_DB_HOST,           
    port                 : import.meta.env.VITE_DB_PORT,          
    database             : import.meta.env.VITE_DB_DATABASE,            
    username             : import.meta.env.VITE_DB_USER,          
    password             : import.meta.env.VITE_DB_PASSWORD,          
 })


export const db = {
    user: {
        async getUserById(userId){
            const user = await sql`
            SELECT
                users_id AS "usersId"
                , email_address AS "emailAddress"
                , e.full_name AS "fullName"
                , uk.token
            FROM 
                users u
            JOIN 
                users_entities ue USING (users_id)
            JOIN 
                entities e USING (entities_id)
            JOIN 
                user_keys uk USING (users_id)
            where users_id =${ userId }
            `
            return user
        },
        async getUser(email){
            const user = await sql`
                SELECT
                users_id AS "usersId",
                password_hash AS "passwordHash"
                FROM users
                WHERE email_address = ${ email }
            `
            return user
        }    ,
        async create(fullName, emailAddress, passwordHash, ipAddress){
            const user = await sql`
                SELECT * FROM create_user(
                    ${fullName}
                    , ${emailAddress}
                    , ${passwordHash}
                    , ${ipAddress}
                    , "Person"  
                )`
            return user
        }       
  },
  lists: {

  }
}