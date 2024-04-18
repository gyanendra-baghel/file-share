import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
      const fileName = req.body?.fileName || file.originalname
      try {
        fs.access(`./uploads/${fileName}`)
        cb(new Error("File with same name already exists"))
      } catch (error) {
        cb(null, fileName)
      }
    }
  })
  
export const uploadFile = multer({ 
    storage, 
})