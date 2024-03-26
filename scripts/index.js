function uploadOnChange(event) {
  for (const file of event.target.files) {
    console.log(`${file.name}, size: ${Number(file.size / 1024 / 1024).toFixed(4)}MB`)
    const span = document.createElement("span")
    span.innerText = `${file.name}, size: ${Number(file.size / 1024 / 1024).toFixed(4)}MB`
    document.getElementById("selected-files").append(span)
  }
}

const file = document.getElementById("file")
file.addEventListener("change", event => uploadOnChange(event))
