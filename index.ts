import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())

app.get("/", (request: Request, response: Response) => {
  response.json({ start: "Home Page" })
})

app.listen(process.env.PORT, function() {
  console.log(`Application started at port ${process.env.PORT}`)
})