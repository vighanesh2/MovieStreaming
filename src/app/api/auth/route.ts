import { NextResponse } from 'next/server'
import { createPool } from 'mysql2/promise'
import { RowDataPacket } from 'mysql2'

// Define a User interface to type the result from the database
interface User {
    UserID: number
    Name: string
    Email: string
    Password: string // You will store the hashed password, so avoid sending this to the client
    SubscriptionID: number
  }
const pool = createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',
  database: 'MovieStreamingDB',
})

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Fetch the rows with the correct type
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM Users WHERE Email = ? AND Password = ?',
      [email, password]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Cast the rows to User[] since they match the User interface
    const user: User = rows[0] as User
    const { Password, ...userWithoutPassword } = user
    console.log(`User's password: ${Password}`) // Just an example of using it

    return NextResponse.json(userWithoutPassword)
  } catch (err) {
    console.error('ERROR: API - ', (err as Error).message)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
