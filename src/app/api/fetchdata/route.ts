import { NextResponse } from 'next/server'

// Define and export the GET handler function
export async function GET() {
  // This is going to be your JSON response
  const results = {
    message: 'Hello World!',
  }

  // Log the results to the console
  console.log(results)

  // Return the JSON response
  return NextResponse.json(results)
}
