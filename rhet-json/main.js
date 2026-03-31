// Function to render your items.
let renderItems = (data) => {
	// The `ul` where the items will be inserted.
	let dataList = document.getElementById('data-list')
    //just stop if container missing
    if (!dataList) return;


    // start content fresh so items are not duplicated
    dataList.innerHTML = "";



    //build the glossary lookup

    let glossaryLookup = {};

    data.Glossary.forEach((item) => {
        glossaryLookup[item.id.toLowerCase()] = item;
        glossaryLookup[item.term.toLowerCase()] = item;
    });



    // asked claude to clarify what the differences between .split(), .trim(), .slice() to use within my data
    // conversation: https://claude.ai/share/02377e0b-47d9-41ab-b4f5-e94a7832c9c2

    // convert [[term]] text to clickable buttons by splitting the double brackets
    let makeClickableTerms = (bodyText) => {
        //split text where starts with double brackets
        let parts = bodyText.split('[[');
        // need to start plain text before the first [[term]]
        let finalText = parts[0];

        //start the loop for remaining parts that may contain terms and increment through
        for (let i = 1; i < parts.length; i++){


            // need to split where the term ends with ]]
            let rightSplit = parts[i].split(']]');

            //access term inside the brackets
            let termText = rightSplit[0].trim();

            // need to get the text coming after the term
            //creating new array starting index 1, removing 1st element
            // joins array back into the string, inserting double brackets back into element
            let afterTerm = rightSplit.slice(1).join(']]');


            // convert to lower case for glossary lookup
            let key = termText.toLowerCase();

            //build a clickable button HTML string for terms
            let buttonHTML = 
                `
                <button class="term-link" daya-term="${key}" type="button">
                    ${termText}
                </button>
                `
            ;

            //add the button and the trailing text to final output
            finalText = finalText + buttonHTML + afterTerm;
        }

        //now return the final body string
        return finalText;
    };












    


















	// Loop through each item in the data array:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	data.forEach((item) => {
		let conditionalClass = '' // Set an empty class variable.

		// Conditional if this is `false` (“not true”):
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
		if (!item.alsoWrote) {
			conditionalClass = 'faded' // Update the variable.
		}

		// Make a “template literal” as we have before, inserting your data (and maybe the class):
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		let listItem =
			`
				<li class="${conditionalClass}">
					<h2>${item.title}</h2>
					<img src="${item.posterImage}">
					<p>Released in <time>${item.year}</time></p>
					<p><em>${item.runTime}</em></p>
					<a href="${item.imdbLink}">
						<p>${item.imdbRating} / 10 →</p>
					</a>
				</li>
			`

		dataList.insertAdjacentHTML('beforeend', listItem) // Add it to the `ul`!

		// Don’t feel limited to `ul > li` for these—you can insert any DOM, anywhere!
	})
}



// Fetch gets your (local) JSON file…
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
fetch('assets/data.json')
	.then(response => response.json())
	.then(data => {
		// And passes the data to the function, above!
		renderItems(data)
	})
