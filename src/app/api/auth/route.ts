import { NextResponse } from 'next/server'
import { createPool } from 'mysql2/promise'

const pool = createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',
  database: 'MovieStreamingDB'
})

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const [rows] = await pool.execute<any[]>(
      'SELECT * FROM Users WHERE Email = ? AND Password = ?',
      [email, password]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const user = rows[0]
    const { Password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (err) {
    console.error('ERROR: API - ', (err as Error).message)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

