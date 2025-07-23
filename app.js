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

const translations = {
  pl: {
    models: {
      zamek: 'Sredniowieczne wrota',
      palpatine: 'Zdrada w senacie',
      books: 'Książki dla każdego',
      river: 'Ucieczka przez rzekę',
      szkieletor: 'Czas kończy się dla wszystkich',
      skuter: 'Hiperskok',
      uczta: 'Uczta na wieki',
      miniBaza: 'Mini baza',
      stragan: 'Średniowieczny stragan z jedzeniem',
      droidowySprinter: 'Droidowy sprinter',
    },
    button: 'Pokaż darmową instrukcję',
    heading: 'Legofan',
    subtitle: 'Instrukcje moich budowli :)',
  },
  en: {
    models: {
      zamek: 'Medieval gates',
      palpatine: 'Betreyal in the senate',
      books: 'Books for everyone',
      river: 'Escape across the river',
      szkieletor: 'Time will end for everyone',
      skuter: 'Hyperlash',
      uczta: 'Feast for centuries',
      miniBaza: 'Mini base',
      stragan: 'Medieval food stall',
      droidowySprinter: 'Droid sprinter',
    },
    button: 'Show free instructions',
    heading: 'Legofan',
    subtitle: "My builds' instructions :)",
  }
};

function renderContent(lang) {
  const content = document.getElementById('content');
  content.innerHTML = '';
  createModelDescription('zamek', 'zamek/zamek', lang);
  createModelDescription('palpatine', 'palpatin/palpatin', lang);
  createModelDescription('books', 'books/books', lang);
  createModelDescription('river',  'przeprawa_przez_rzekę/przeprawa_przez_rzekę', lang);
  createModelDescription('szkieletor', 'skeleton/skeleton', lang);
  createModelDescription('skuter', 'skuter/skuter', lang);
  createModelDescription('uczta', 'uczta/uczta', lang);
  createModelDescription('miniBaza', 'stanowisko_klona/stanowisko_klona', lang);
  createModelDescription('stragan', 'średniowieczny_stragan/średniowieczny_stragan', lang);
  createModelDescription('droidowySprinter', 'droidowy_sprinter/droidowy_sprinter', lang);
  document.querySelector('h1').innerText = translations[lang].heading;
  document.querySelectorAll('p')[2].innerText = translations[lang].subtitle;
}

function createModelDescription(id, linkPrefix, lang){
  const title = translations[lang].models[id]
  const model = document.createElement('div');
  model.id = id;
  const header = document.createElement('h3');
  header.innerText = '"' + title + '"';
  model.appendChild(header);
  const imageP = document.createElement('p');
  model.appendChild(imageP);
  const image = document.createElement('img');
  image.setAttribute('src', linkPrefix + '.png');
  image.setAttribute('alt', title);
  image.setAttribute('width', '800px');
  image.setAttribute('style', 'border: 7px solid rgb(72, 21, 126); padding: 5px; margin: 5px auto; text-align: center;');
  imageP.appendChild(image);
  const instructionDiv = document.createElement('div');
  model.appendChild(instructionDiv);
  const instructionButton = document.createElement('button');
  instructionButton.onclick = function() {
    window.open(linkPrefix + '_instrukcja.pdf', '_blank');
  };
  instructionButton.setAttribute('style', 'background-color: rgb(72, 21, 126); color: white; border: none; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;');
  instructionButton.innerText = translations[lang].button;
  instructionDiv.appendChild(instructionButton);
  document.getElementById('content').appendChild(model);
  return model;
}

const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', function() {
  renderContent(this.value);
});

// Default language
renderContent(languageSelect.value);