import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const connectionParams = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Vignyc@12345',
  database: 'MovieStreamingDB'
}

interface Subscription {
  SubscriptionID: number;
  SubscriptionType: string;
  Price: number;
  BillingCycle: string;
  Features: string;
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(connectionParams)

    const query = 'SELECT * FROM Subscription'
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(query)

    await connection.end()

    const subscriptions = rows.map(row => ({
      ...row,
      Features: row.Features ? row.Features.split(',').map((feature: string) => feature.trim()) : []
    })) as Subscription[]

    return NextResponse.json(subscriptions)
  } catch (err) {
    console.error('ERROR: API - ', (err as Error).message)

    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

