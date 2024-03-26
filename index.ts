import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import express, { Request, Response } from "express"
import { fileParser } from "./util/fileParser"

dotenv.config()
const app = express()
app.use(cors())

app.set("json spaces", 5)

app.use("/public", express.static(path.join(process.cwd(), "public")))
app.use("/scripts", express.static(path.join(process.cwd(), "scripts")))

app.get("/", (_: Request, response: Response) => {
  response.sendFile(path.join(process.cwd(), "views", "index.html"))
})

app.post("/api/upload", async (request: Request, response: Response) => {
  await fileParser(request)
  .then(data => {
    response.status(200).json({ message: "Success", data: JSON.parse(data) })
  })
  .catch(error => {
    response.status(400).json({ message: "Internal server error", error })
  })
})

app.listen(process.env.PORT, function() {
  console.log(`Application started at port ${process.env.PORT}`)
})
