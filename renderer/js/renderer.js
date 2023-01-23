const form = document.querySelector('#img-form')
const img = document.querySelector('#img')
const outputPath = document.querySelector('#output-path')
const filename = document.querySelector('#filename')
const heightInput = document.querySelector('#height')
const widthInput = document.querySelector('#width')

function loadImage(e) {
  const file = e.target.files[0]
  if (!isFileImg(file)) {
    alertError('Please select an image');
    return
  }
  // Get original dimension
  const image = new Image()
  image.src = URL.createObjectURL(file)
  image.onload = function () {
    widthInput.value = this.width
    heightInput.value = this.height 
  }

  form.style.display = 'block'
  filename.innerText = file.name
  outputPath.innerText = path.join(os.homedir(), 'imagesizer')
}

//make sure file is image
function isFileImg(file) {
  const ecceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg']
  return file && ecceptedImageTypes.includes(file['type'])
}

function alertError(message) {
  Tostify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center'
    }
  })
}

function alertSuccess(message) {
  Tostify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center'
    }
  })
}

img.addEventListener('change', loadImage)
