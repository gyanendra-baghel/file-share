const cut = document.querySelector(".cut")
const uploadWrapper = document.querySelector(".upload-wrapper")
const uploadBtn = document.querySelector(".upload-btn")
const customNameInput = document.querySelector(".custom-name")
const passwordElem = document.querySelector(".password-input")
const uploadBox = document.querySelector(".upload-box")
const progress = document.querySelector(".progress")
const fileInputElem = document.querySelector("#file-input")
const errorBox = document.querySelector(".error-box")
const uploadedBox = document.querySelector(".uploaded-box")
const uploadData = document.querySelector(".upload-data")

const copyBtn = document.querySelector(".copy-btn")
const uploadedLink = document.querySelector(".uploaded-link")

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'copy';
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  const files = event.dataTransfer.files;
  handleFileInput(files);
}

function handleFileInput(files) {
  if (files.length > 0) {
    uploadWrapper.classList.remove("hidden")
  }
}

function hideUploadDialog() {
  uploadBox.classList.add("hidden")
  uploadedBox.classList.add("hidden")
  errorBox.classList.add("hidden")
  uploadWrapper.classList.add("hidden")
  customNameInput.value = ""
  passwordElem.value = ""
  fileInputElem.value = ""
}

function uploadFiles() {
  const form = new FormData();
  form.append("fileName", customNameInput.value)
  form.append("password", passwordElem.value)
  form.append("file", fileInputElem.files[0])
  console.log(form)
  
  progress.style.width = "0%"
  uploadData.innerText = "0/0" 
  uploadBox.classList.remove("hidden")
  uploadForm(form)
}

function copyLink() {
  navigator.clipboard.writeText(uploadedLink.innerText || "")
}

copyBtn.addEventListener("click", copyLink)
cut.addEventListener("click", hideUploadDialog)
uploadBtn.addEventListener("click", uploadFiles)

function uploadForm(form) {
  const xhr = new XMLHttpRequest()
  xhr.upload.addEventListener("progress", function(ev) {
    if(ev.lengthComputable) {
      const percentCompleted = (ev.loaded / ev.total) * 100
      progress.style.width = percentCompleted + "%"
      uploadData.innerText = ev.loaded + "/" + ev.total 
      if(ev.loaded === ev.total) {
        uploadedBox.classList.remove("hidden")
      }
    }
  })
  xhr.addEventListener("load", function() {
    const response = JSON.parse(xhr.responseText)
    console.log(response)
    if(xhr.status === 200) {
      uploadedLink.innerText = response.data
      console.log("Uploaded Sucessfully")
    } else {
      errorBox.box,innerText = response.message
      errorBox.classList.remove("hidden")
      console.log("Error uploading")
    }
  })
  xhr.open("POST", "http://localhost:8080")
  xhr.send(form)
}