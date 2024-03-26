import { File } from "formidable"


export interface FileBeginEventFile extends File {
  open: Function
  end: (callback: Function) => void
}
