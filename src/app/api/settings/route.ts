import { NextResponse, type NextRequest } from "next/server"
import fs from "fs/promises"
import path from "path"

// Path to the .env.local file
const envFilePath = path.join(process.cwd(), ".env.local")

// Function to read current env variables from .env.local
async function readEnvFile() {
  try {
    const fileExists = await fs
      .access(envFilePath)
      .then(() => true)
      .catch(() => false)

    if (!fileExists) {
      return {}
    }

    const data = await fs.readFile(envFilePath, "utf8")
    const envVars: Record<string, string> = {}

    data.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        envVars[match[1]] = match[2]
      }
    })

    return envVars
  } catch (error) {
    console.error("Error reading .env file:", error)
    return {}
  }
}

// Function to write env variables to .env.local
async function writeEnvFile(envVars: Record<string, string>) {
  try {
    const content = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")

    await fs.writeFile(envFilePath, content, "utf8")
  } catch (error) {
    console.error("Error writing .env file:", error)
    throw error
  }
}

export async function GET() {
  // Return current API keys (without exposing full secret key)
  const apiKey = process.env.LKBENNETT_API_KEY || ""
  const secretKey = process.env.LKBENNETT_SECRET_KEY || ""

  // Mask the secret key for security
  const maskedSecretKey = secretKey ? "•".repeat(secretKey.length) : ""

  return NextResponse.json({
    apiKey,
    secretKey: maskedSecretKey,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, secretKey } = await request.json()

    // Read current env variables
    const envVars = await readEnvFile()

    // Update with new values
    envVars["LKBENNETT_API_KEY"] = apiKey
    envVars["LKBENNETT_SECRET_KEY"] = secretKey

    // Write back to .env.local
    await writeEnvFile(envVars)

    // Update process.env for the current session
    process.env.LKBENNETT_API_KEY = apiKey
    process.env.LKBENNETT_SECRET_KEY = secretKey

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 })
  }
}
