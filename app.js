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
  // instructionDiv.setAttribute("style", "border: 2px solid rgb(72, 21, 126); padding: 5px; width: fit-content; margin: 5px auto; text-align: center;")
  model.appendChild(instructionDiv)

  const instructionButton = document.createElement("button")
  instructionButton.onclick = function() {
    window.open(linkPrefix+"_instrukcja.pdf", "_blank");
  }
  instructionButton.setAttribute("style", "background-color: rgb(72, 21, 126); color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;")
  instructionButton.innerText = "Show free instructions"
  instructionDiv.appendChild(instructionButton)

  document.getElementById("content").appendChild(model)

  return model
}
createModelDescription("river", "Escape across the river", "przeprawa_przez_rzekę/przeprawa_przez_rzekę")

createModelDescription("szkieletor", "Time will end for everyone", "skeleton/skeleton")

createModelDescription("skuter", "Hyperlash", "skuter/skuter" )

createModelDescription("uczta", "Feast for centuries", "uczta/uczta")

createModelDescription("miniBaza", "Mini base", "stanowisko_klona/stanowisko_klona")

createModelDescription("stragan","Medieval food stall", "średniowieczny_stragan/średniowieczny_stragan")

createModelDescription("droidowySprinter","Droidowy sprinter","droidowy_sprinter/droidowy_sprinter")