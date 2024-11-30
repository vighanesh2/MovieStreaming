import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const connectionParams = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',
  database: 'MovieStreamingDB',
}

export async function GET(request: Request) {
  try {
    const connection = await mysql.createConnection(connectionParams)

    const query = `
      SELECT vh.UserID, vh.MovieID, vh.WatchedDuration, vh.Status, m.Title, m.Duration 
      FROM ViewingHistory vh
      JOIN Movies m ON vh.MovieID = m.MovieID
      ORDER BY vh.UserID, vh.MovieID
    `
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(query)

    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error('ERROR: API - ', (error as Error).message)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
