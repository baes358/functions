







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


    // want to make posts clickable for the users as well
    let postsLookup = {};
    
    data.Posts.forEach((post) => {
        postsLookup[String(post.id)] = post;
    });

    // asked claude to clarify what the differences between .split(), .trim(), .slice() to use within my data
    // conversation: https://claude.ai/share/3ce87fcf-b4c8-483d-8803-c24e00251991

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






    // function to build post card html!!!! TODO
    let buildPostCardInnerHTML = (postData) => {
	    let clickableBody = makeClickableTerms(postData.body);

        return (
            // format like listitem so looks identical
            '<section class="profile-header">' +

                '<section class="initials">' + (postData.initials || '') + '</section>' +

                '<section class="profile-meta">' +
                    '<h2 class="acc-name">' +
                        (postData.emoji || '') + ' ' + postData.accountname + 
                    '</h2>' +
                    '<section class="handle-sect">' +
                        '<p class="handle">' + postData.accounthandle + '</p>' +
                        '<p class="divider"> • </p>' +
                        '<time>' + postData.time + '</time>' +
                    '</section>' +
                '</section>' +
            '</section>' +
            '<p class="post-body">' + clickableBody + '</p>' +
            '<section class="post-stats">' +
                '<p class="likes">❤️ ' + postData.likes + '</p>' +
                '<p class="divider"> • </p>' +
                '<p class="reposts">🔁 ' + postData.reposts + '</p>' +
                '<p class="divider"> • </p>' +
                '<p class="reposts">💬 ' + postData.comments + '</p>' +

            '</section>'
        );
    };





    // function for opening a post
    let openPostModal = (postData) => {
        let postModal = document.getElementById('post-modal');
        
        let postInner = document.getElementById('post-modal-inner');



        // if empty return
        if (postModal === null || postInner === null) {
            return;
        }

        postInner.innerHTML = buildPostCardInnerHTML(postData);

        postInner.classList.add('tweet-card');
        
    


        // // starting with empty initials in case missing
        // let initialsText = '';
        // // if exist, fill variable with
        // if (postData.initials){
        //     initialsText = postData.initials;
        // }

        // // building the title text
        // let titleText = initialsText;

        // // If title has initials alr, then add space before adding acc name
        // if (titleText.length > 0) {
        //     titleText = titleText + ' ';
        // }

        // // add accountname to title text
        // titleText = titleText + postData.accountname;
        // //put final title text in modal title element
        // postTitle.textContent = titleText;



        // //now building meta text
        // let metaText = '';

        // // account handle first
        // metaText = metaText + postData.accounthandle;

        // // separater and topic and time next
        // metaText = metaText + ' • ' + postData.topic + ' • ' + postData.time;

        // //put into post meta
        // postMeta.textContent = metaText;



        // // convert [[term]] into clickable term buttons using helper function
        // let bodyHTML = makeClickableTerms(postData.body);

        // // asked claude to remind and clarify to me the difference of textcontent and innerhtml
        // // conversation: https://claude.ai/share/03efce1b-3d63-40fe-9717-7d4e3636c9e1
        // // put into modal body
        // postBody.innerHTML = bodyHTML;


        // // now build stats
        // let statsText = '';
        // //add the likes
        // statsText = statsText + '❤️ ' + postData.likes;
        // //add reposts
        // statsText = statsText + ' • 🔁 ' + postData.reposts;
        // //add comments
        // statsText = statsText + ' • 💬 ' + postData.comments;
        // //put into posts element
        // postStats.textContent = statsText;
        

        // show the modal
	    postModal.hidden = false;
        return;

    };







    // looping through each POST
    // adapted from demo for loop from class

    data.Posts.forEach((item) =>{

        //convert [[terms]] into clickable buttons
        let clickableBody = makeClickableTerms(item.body);

        // build post HTML using template lit
        let listItem =
            `
                <li class="tweet-card" data-post-id="${item.id}">
                    <section class="profile-header">
                        <section class="initials">${item.initials}</section>

                        <section class="profile-meta">
                            <h2 class="acc-name">${item.emoji || ''} ${item.accountname}</h2>

                            <section class="handle-sect">
                                <p class="handle">${item.accounthandle}</p>
                                <p class="divider"> • </p>
                                <time>${item.time}</time>
                            </section>
                        </section>

                    </section>

                    <p class="post-body">${clickableBody}</p>

                    <section class="post-stats">
                        <p class="likes">❤️ ${item.likes}</p>
                        <p class="divider"> • </p>
                        <p class="reposts">🔁 ${item.reposts}</p>
                        <p class="divider"> • </p>
                        <p class="reposts">💬 ${item.comments}</p>
                    </section>
    
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




            // grabbing post modal so that it adds class for bump transition with term modal
            let postCard = document.querySelector('modal-content');
            if (postCard) {
                postCard.classList.add('is-bumped');
            }








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


            // so term layer only jumps above post modal WHEN user opens glossary from term button
            modal.classList.add('term-front');



            //MAKE MODAL VISIBLE!!! because remember set at hidden

            modal.hidden = false;
            return;


    

        }


        //need to now handle post card clicks
        let postCard = event.target.closest('#data-list .tweet-card');

        if (postCard){
            let postId = postCard.dataset.postId;
            let postData = postsLookup[postId];

            if(postData){
                openPostModal(postData);
            }
            return;
        }






        //closing the modal if click on close or backdrop

        if (event.target.id === 'modal-close' || event.target.id === 'term-modal'){
            let termModal = document.getElementById('term-modal');
	        termModal.hidden = true;
	        termModal.classList.remove('term-front');

            // making sure to remove class for post modal as well when term modal is affected
	        let postCard = document.querySelector('modal-content');
            if (postCard){
                postCard.classList.remove('is-bumped');
            }
	        


        }
        //closing the post modal if click on close or backdrop

        if (event.target.id === 'post-modal-close' || event.target.id === 'post-modal'){
            document.getElementById('post-modal').hidden = true;
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
