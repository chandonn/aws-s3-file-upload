import { Request } from "express"
import { Transform } from "stream"
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import { FileBeginEventFile } from "../types/File"
import formidable from "formidable"

export const fileParser = async (request: Request): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options = {
      maxFileSize: 10 * 1024 * 1024,
      allowEmptyFiles: false
    }

    const form = formidable(options)

    form.parse(request, (error, fields, files) => {

    })

    form.on("error", (error) => {
      reject(error.message)
    })

    form.on("data", (data) => {
      if (data.name === "file") {
        resolve(data.value)
      }
    })

    form.on("fileBegin", function(formName, file: FileBeginEventFile) {
      
      file.open = async function () {
        this._writeStream = new Transform({
          transform(chunk, encoding, callback) {
            callback(null, chunk)
          }
        })

        this._writeStream.on("error", error => form.emit("data", error))

        new Upload({
          client: new S3Client({
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION
          }),
          params: {
            Bucket: process.env.AWS_BUCKET,
            Key: `${Date.now().toString()}-${file.originalFilename}`,
            Body: this._writeStream,
          }
        }).done().then(data => {

          form.emit("data", { name: "file", value: JSON.stringify(data), formname: formName })

        })
      }

      file.end = function(callback) {
        this._writeStream.on("finish", () => {
          this.emit("end")
          callback()
        })
        this._writeStream.end()
      }
    })
  })
}
