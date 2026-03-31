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
                <button class="term-link" data-term="${key}" type="button">
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






    // looping through each POST
    // adapted from demo for loop from class

    data.Posts.forEach((item) =>{

        //convert [[terms]] into clickable buttons
        let clickableBody = makeClickableTerms(item.body);

        // build post HTML using template lit
        let listItem =
            `
                <li>
                    <section class="profile-header">
                        <section class="initials">${item.initials}</section>

                        <section class="profile-meta">
                            <h2>${item.emoji || ''} ${item.accountname}</h2>
                            <p>${item.accounthandle}</em> • <time>${item.time}</time></p>
                        </section>
                    </section>
                    
                    <p>${clickableBody}</p>
                    <p>❤️ ${item.likes} • 🔁 ${item.reposts} • 💬 ${item.comments}</p>
                </li>
            `;


        // insert the post into the list
        dataList.insertAdjacentHTML('beforeend',listItem);





    });



	// Loop through each item in the data array:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	// data.forEach((item) => {
	// 	let conditionalClass = '' // Set an empty class variable.

		// Conditional if this is `false` (“not true”):
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
		// if (!item.alsoWrote) {
		// 	conditionalClass = 'faded' // Update the variable.
		// }

		// Make a “template literal” as we have before, inserting your data (and maybe the class):
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		// let listItem =
		// 	`
		// 		<li class="${conditionalClass}">
		// 			<h2>${item.title}</h2>
		// 			<img src="${item.posterImage}">
		// 			<p>Released in <time>${item.year}</time></p>
		// 			<p><em>${item.runTime}</em></p>
		// 			<a href="${item.imdbLink}">
		// 				<p>${item.imdbRating} / 10 →</p>
		// 			</a>
		// 		</li>
		// 	`

		// dataList.insertAdjacentHTML('beforeend', listItem) // Add it to the `ul`!

		// Don’t feel limited to `ul > li` for these—you can insert any DOM, anywhere!
// 	})
// }






    //click handler

    document.addEventListener('click', (event) =>{


        //checking to see if click happened on term
        let termButton = event.target.closest('.term-link');

        // now we gotta check if term button was clicked then open the modal!!!

        if (termButton){

            // reaad glossary key from button
            // asked claude to remind me what the .dataset accesses within javascript
            //conversation: https://claude.ai/share/02377e0b-47d9-41ab-b4f5-e94a7832c9c2
            let key = termButton.dataset.term;

            //find the matching glossary item from lookup
            let termData = glossaryLookup[key];



            // if there is no matching glossary term then just stop
            if (!termData) return;


            //backdrop for modal
            let modal = document.getElementById('term-modal');
            //title element
            let modalTerm = document.getElementById('modal-term');
            //definition 
            let modalDefinition = document.getElementById('modal-definition');
            //related list
            let modalRelated = document.getElementById('modal-related');



            // put the term TEXT into the modal heading
            modalTerm.textContent = termData.term;
            // put term DEF into modal definition spot
            modalDefinition.textContent = termData.definition;



            // building an array for the existing related terms
            // asked claude how I would approach related terms for those that have either two or three related 
            // suggested using the .length() property to check
            // conversation: https://claude.ai/share/02377e0b-47d9-41ab-b4f5-e94a7832c9c2
            let related = [];


            // check to see if not just whitespace and not empty
            if (termData.related1 && termData.related1.trim().length > 0) {
                // push to add to array
                related.push(termData.related1.trim());
            }

            //repeat for related2
            if (termData.related2 && termData.related2.trim().length > 0) {
                // push to add to array
                related.push(termData.related2.trim());
            }

            //repeat for related3
            if (termData.related3 && termData.related3.trim().length > 0) {
                // push to add to array
                related.push(termData.related3.trim());
            }







            //empty string for related terms
            let relatedHTML = '';

            //loop through each related term that exists
            related.forEach((relatedTerm) =>{
                
                //again need to do lowercase for lookup
                let relatedKey = relatedTerm.toLowerCase();

                //make related terms clickable as buttons
                relatedHTML +=
                `
                    <li>
                        <button class="term-link" data-term="${relatedKey}" type="button">
                            ${relatedTerm}
                        </button>
                    </li>
                `;
            });







            //need to insert the related terms into the modal as well
            modalRelated.innerHTML = relatedHTML;





            //MAKE MODAL VISIBLE!!! because remember set at hidden

            modal.hidden = false;


    

        }



        //closing the modal if click on close or backdrop

        if (event.target.id === 'modal-close' || event.target.id === 'term-modal'){
            document.getElementById('term-modal').hidden = true;
        }



    });

};































// Fetch gets your (local) JSON file…
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
fetch('./rhet-json/data.json')
	.then(response => response.json())
	.then(data => {
		// And passes the data to the function, above!
		renderItems(data);
	});
