function toggleImages(buttonId, contentId) {
    const content = document.getElementById(contentId);
    const button = document.getElementById(buttonId);

    const isHidden = content.style.display === "none" || content.style.display === "";

    if (isHidden) {
      content.style.display = "block";
      button.classList.add("open");
    } else {
      content.style.display = "none";
      button.classList.remove("open");
    }
  }

function createModelDescription(id, title, linkPrefix){

  const model = document.createElement("div")
  model.id=id
  
  const header = document.createElement("h3")
  header.innerText = '"'+title+'"'
  model.appendChild(header)
  

  const imageP = document.createElement("p")
  model.appendChild(imageP)
  
  const image = document.createElement("img")
  image.setAttribute("src", linkPrefix+".png")
  image.setAttribute("alt", title)
  image.setAttribute("width", "700")
  image.setAttribute("style", "border: 7px solid rgb(72, 21, 126); padding: 5px; width: fit-content; margin: 5px auto; text-align: center;")
  imageP.appendChild(image)
  
  const instructionDiv = document.createElement("div")
  instructionDiv.setAttribute("style", "border: 2px solid rgb(72, 21, 126); padding: 5px; width: fit-content; margin: 5px auto; text-align: center;")
  model.appendChild(instructionDiv)

  const linkDescription = document.createElement("p")
  linkDescription.innerText = "Open a free instruction"
  instructionDiv.appendChild(linkDescription)

  const nothing = document.createElement("p")
  instructionDiv.appendChild(nothing)

  const link = document.createElement("a")
  link.setAttribute("href", linkPrefix+"_instrukcja.pdf")
  link.setAttribute("target", "_blank")
  link.innerText = "Open pdf file"
  nothing.appendChild(link)
  document.getElementById("content").appendChild(model)

  return model
}
createModelDescription("szkieletor", "Time will end for everyone", "skeleton/skeleton")

createModelDescription("skuter", "Hyperlash", "skuter/skuter" )

createModelDescription("uczta", "Feast for centuries", "uczta/uczta")

createModelDescription("miniBaza", "Mini base", "stanowisko_klona/stanowisko_klona")

createModelDescription("stragan","Medieval food stall", "średniowieczny_stragan/średniowieczny_stragan")

createModelDescription("droidowySprinter","Droidowy sprinter","droidowy_sprinter/droidowy_sprinter")