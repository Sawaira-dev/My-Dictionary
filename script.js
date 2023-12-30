function searchDictionary() {
    const searchInput = document.getElementById('searchInput').value;

    if (!searchInput) {
        alert('Please enter a word to search.');
        return;
    }

    // Replace 'your-api-key' with your actual Merriam-Webster API key
    const apiKey = '49d1f368-dd3b-40dc-b16f-1333e4c37806';
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/learners/json/${searchInput}?key=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayDefinition(data);
        })
        .catch(error => {
            console.error(`Error fetching data: ${error.message}`);
            alert(`Error fetching data. Please try again later.\nDetails: ${error.message}`);
        });
}

function displayDefinition(data) {
    const definitionContainer = document.getElementById('definition-container');
    definitionContainer.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach(entry => {
            const definition = entry.shortdef ? entry.shortdef[0] : 'Definition not found.';
            const word = entry.hwi ? entry.hwi.hw : 'Word not found.';
            const audio = entry.hwi && entry.hwi.prs && entry.hwi.prs[0].sound && entry.hwi.prs[0].sound.audio;

            const definitionCard = document.createElement('div');
            definitionCard.classList.add('definition-card');
            definitionCard.innerHTML = `<h2>${word}</h2><p>${definition}</p>`;

            if (audio) {
                const audioElement = document.createElement('audio');
                audioElement.controls = true;
                audioElement.src = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audio[0]}/${audio}.mp3`;
                definitionCard.appendChild(audioElement);
            }

            definitionContainer.appendChild(definitionCard);
        });
    } else {
        definitionContainer.innerHTML = '<p>No results found.</p>';
    }
}
