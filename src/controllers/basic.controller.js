import multer from "multer"
import fs from "fs/promises"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: async function (req, file, cb) {
    const fileName = req.body?.fileName || file.originalname

    try {
      await fs.access(`./uploads/${fileName}`)
      cb(new Error("File with the same name already exists"))
    } catch (error) {
      cb(null, fileName)
    }
  },
});

const upload = multer({
  storage,
}).single("file");

// Controllers

const uploadFile = asyncHandler(async (req, res) => {
  console.log("Request Coming..")
  upload(req, res, function (err) {
    if (err) {
      throw new ApiError(400, err.message);
    }

    if (!req.file) {
      throw new ApiError(400, "File not selected");
    }

    return res.status(200).json(new ApiResponse(200, "Avatar image updated successfully"));
  });
});


const downloadFile =  asyncHandler(async(req, res) => {
  const filePath = `./uploads/${req.params.fileName}`

  try {
    // Check if the file exists
    await fs.promises.access(filePath);

    // Set the appropriate headers for the response
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Create a readable stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    throw new ApiError(404, "File not found");
  }
})


export {
    uploadFile,
    downloadFile
}