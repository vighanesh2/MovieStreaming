import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const connectionParams = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',  // Make sure to keep this secure
  database: 'MovieStreamingDB',
}

export async function GET(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionParams)

    const query = `
      SELECT r.UserID, r.MovieID, r.Reason, m.Title
      FROM Recommendation r
      JOIN Movies m ON r.MovieID = m.MovieID
      ORDER BY r.UserID, r.MovieID
    `
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(query)

    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error('ERROR: API - ', (error as Error).message)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
