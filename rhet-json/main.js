// Function to render your items.
let renderItems = (data) => {
	// The `ul` where the items will be inserted.
	let dataList = document.getElementById('data-list')
    //to check and show error if does not exists
    if (!dataList){
        console.error('Missing element with id="data-list" in index.html');
        return;
    }


    // start content fresh so items are not duplicated
    dataList.innerHTML = "";





    // for Glossary section 
    // check if it exists and is an array before looping
    if (Array.isArray(data.Glossary)){
        
        // add heading TODO: maybe change placeholder name
        dataList.insertAdjacentHTML("beforeend", "<li><h2>Glossary</h2></li>");

        // loop through each item
        data.Glossary.forEach(function(item){
            // declare related term variable first
            let relatedText = "";

            // if related1 exists, add it to the html
            if (item.related1){
                relatedText = relatedText + item.related1;
            }

            // if related2 exists, add comma if needed then add to html
            if (item.related2){

                if (relatedText !== ""){
                    relatedText = relatedText + ", ";
                }  
                relatedText = relatedText + item.related2;
            }

            // same as related2 logic
            // if related3 exists, add comma if needed then add to html
            if (item.related3){

                if (relatedText !== ""){
                    relatedText = relatedText + ", ";
                }  
                relatedText = relatedText + item.related3;
            }














        })
    }




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
