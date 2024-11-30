import { NextResponse, NextRequest } from 'next/server'
import mysql from  'mysql2/promise';
// define and export the GET handler function
let connectionParams = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Vignyc@12345',
    database: 'MovieStreamingDB'
    }
    export async function GET(request: Request) {
        try {
          // 2. connect to database
      
          const connection = await mysql.createConnection(connectionParams)
      
          // 3. create a query to fetch data
      
          let get_exp_query = ''
      
          get_exp_query = 'SELECT * FROM Movies'
      
          // we can use this array to pass parameters to the SQL query
      
          let values: any[] = []
      
          // 4. exec the query and retrieve the results
      
          const [results] = await connection.execute(get_exp_query, values)
      
          // 5. close the connection when done
      
          connection.end()
      
          // return the results as a JSON API response
      
          return NextResponse.json(results)
        } catch (err) {
          console.log('ERROR: API - ', (err as Error).message)
      
          const response = {
            error: (err as Error).message,
      
            returnedStatus: 200,
          }
      
          return NextResponse.json(response, { status: 200 })
        }
      }