import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const connectionParams = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',
  database: 'MovieStreamingDB'
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionParams)

    const query = 'SELECT * FROM movies'
    const [results] = await connection.execute(query)
    await connection.end()

    return NextResponse.json(results)
  } catch (err) {
    console.error('ERROR: API - ', (err as Error).message)

    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

