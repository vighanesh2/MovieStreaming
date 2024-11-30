import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const connectionParams = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',
  database: 'MovieStreamingDB'
}

interface Movie {
  MovieID: number;
  Title: string;
  Genre: string;
  ReleaseDate: string;
  Rating: number;
  Description: string;
  Duration: number;
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionParams)

    const query = 'SELECT * FROM Movies ORDER BY RAND() LIMIT 1'
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(query)

    await connection.end()

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No movies found' }, { status: 404 })
    }

    const movie = rows[0] as Movie
console.log(movie)
    return NextResponse.json(movie)
  } catch (err) {
    console.error('ERROR: API - ', (err as Error).message)

    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}