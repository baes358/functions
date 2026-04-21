// default home filter
let activeFilter = "All";

let filterFeed = () => {

    let items = document.querySelectorAll('#data-list li');

    items.forEach((li) => {
        // check if showing all items OR the item's topic matches the active filter
        if (activeFilter === "All" || li.dataset.topic === activeFilter) {
            //show item -> empty string is default display
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    });
};

// asked Claude of specific Math methods within Javascript to help me shuffle the li elements (posts)
// claude conversation: https://claude.ai/share/18d9ec65-1005-4953-9d0e-2d3405e4f6aa
let shufflePosts = (posts) => {
    // make copy so it doesn’t change original list
    let shuffledPosts = posts.slice();

    // go through each position in the array, starting from the end
    for (let currentIndex = shuffledPosts.length - 1; currentIndex > 0; currentIndex--) {

        //take random position from the start up to the current position
        //Math.floor rounds number down
        //Math.random gives random decimal
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));

        // swap current item with random item
        let currentItem = shuffledPosts[currentIndex];
        let randomItem = shuffledPosts[randomIndex];

        shuffledPosts[currentIndex] = randomItem;
        shuffledPosts[randomIndex] = currentItem;
    }

    // return shuffled result
    return shuffledPosts;
}




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



    // for storing relatedterms allowing users to navigate back
    let termHistory = [];











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




    let shortenHTML = (bodyString, maxLength = 125) => {
        let temp = document.createElement('section');

        temp.innerHTML = bodyString;

        // // asked claude to remind and clarify to me the difference of textcontent and innerhtml
        // // conversation: https://claude.ai/share/03efce1b-3d63-40fe-9717-7d4e3636c9e1
      
        //return all text inside temp or inner visual text 
        let body = temp.textContent || temp.innerText;

        if (body.length <= maxLength){
            return bodyString;
        }

        //remember index slice(start, end) end NOT INCLUDED
        let shortenedText = body.slice(0, maxLength) + '...';

        return shortenedText;


    }



    // function to build post card html!!!! 
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
                '<p class="stat">' +
                    '<img src="./assets/icons/like.svg" class="icon"/>' + postData.likes + 
                '</p>' +
                
                '<p class="stat">' +
                    '<img src="./assets/icons/repost.svg" class="icon"/>' + postData.reposts + 
                '</p>' +
                
                '<p class="stat">' +
                   '<img src="./assets/icons/comment.svg" class="icon"/>' + postData.comments + 
                '</p>' +

            '</section>'
        );
    };



    // when building out the related terms, i asked claude if it would be more efficient to use the length property or a boolean to check for related terms
    // conversation: https://claude.ai/share/3ce87fcf-b4c8-483d-8803-c24e00251991
    let buildRelatedHTML = (termData) => {

        let related = [];

        if (termData.related1 && termData.related1.trim().length > 0) {
            related.push(termData.related1.trim());
        }
        if (termData.related2 && termData.related2.trim().length > 0) {
            related.push(termData.related2.trim());
        }
        if (termData.related3 && termData.related3.trim().length > 0) {
            related.push(termData.related3.trim());
        }

        let relatedHTML = '';

        related.forEach((relatedTerm) =>{
            let relatedKey = relatedTerm.toLowerCase();

            relatedHTML += 
            `
                <li>
                    <button class="term-link" data-term="${relatedKey}" type="button">
                        ${relatedTerm}
                    </button>
                </li>
            `;
        });

        return relatedHTML;
    };

    // helper to populate and reveal the inline term panel inside the post modal
    let showInlineTermPanel = (termData) => {
        let inlineTermPanel = document.getElementById('inline-term-panel');
        let inlineTermName = document.getElementById('inline-term-name');
        let inlineTermTopic = document.getElementById('inline-term-topic');
        let inlineTermDef = document.getElementById('inline-term-definition');
        let inlineTermRel = document.getElementById('inline-term-related');
        let backButton = document.getElementById('term-back');
 
        if (!inlineTermPanel) return;
 
        inlineTermName.textContent = termData.term;
        inlineTermTopic.textContent = termData.topic;
        // adding specific classes of the topics so i can match colors to the filters
        inlineTermTopic.className = 'topic-tag-' + termData.topic.toLowerCase();
        inlineTermDef.textContent = termData.definition;
        inlineTermRel.innerHTML = buildRelatedHTML(termData);
 
        // show or hide back button based on history depth
        if (termHistory.length === 0) {
            backButton.classList.add('hidden');
        } else {
            backButton.classList.remove('hidden');
        }
 
        inlineTermPanel.hidden = false;
    };

    // function for opening a post
    let openPostModal = (postData) => {
        let postModal = document.getElementById('post-modal');
        
        let postInner = document.getElementById('post-modal-inner');

        let inlineTermPanel = document.getElementById('inline-term-panel');



        // if empty return
        if (postModal === null || postInner === null) {
            return;
        }

        postInner.innerHTML = buildPostCardInnerHTML(postData);

        //store current state of showing post or term to reset navigation for back button behavior reset
        postInner.dataset.type = 'post';
        postInner.dataset.key = '';
        termHistory = [];

        // hide the inline term panel when opening a fresh post
        if (inlineTermPanel) {
            inlineTermPanel.hidden = true;
        }

        postInner.classList.add('tweet-card');
        
    



        



        // show the modal
	    postModal.hidden = false;
        return;

    };







    // looping through each POST
    // adapted from demo for loop from class

    data.Posts.forEach((item) =>{

        //convert [[terms]] into clickable buttons
        let clickableBody = makeClickableTerms(item.body);
        let shortenedBody = shortenHTML(clickableBody, 125);

        // build post HTML using template lit
        let listItem =
            `
                <li class="tweet-card" data-post-id="${item.id}" data-topic="${item.topic}">
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

                    <p class="post-body">${shortenedBody}</p>

                    <section class="post-stats">

                        <p class="stat">
                            <img src="./assets/icons/like.svg" class="icon" />${item.likes}
                        </p>
                        
                        <p class="stat">
                            <img src="./assets/icons/repost.svg" class="icon" />${item.reposts}
                        </p>
                        
                        <p class="stat">
                            <img src="./assets/icons/comment.svg" class="icon" />${item.comments}
                        </p>
                    </section>
    
                </li>
            `;


        // insert the post into the list
        dataList.insertAdjacentHTML('beforeend',listItem);





    });





    //click handler

    document.addEventListener('click', (event) =>{
        // access back button for terms
        let backButton = document.getElementById('term-back');

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

            if (!termData) return;

            let postInner = document.getElementById('post-modal-inner');
            // first need to grab the id for the post modal
            // grabbing post modal so that it adds class for bump transition with term modal
            let postModal = document.getElementById('post-modal');

            
            // if the post modal is not open, this is a fresh term open from the feed
            // reset history and state so the back button never shows on the first term
            if (postModal.hidden) {

                termHistory = [];
                postInner.dataset.type = '';
                postInner.dataset.key  = '';

                // open modal with no post card, just the term panel below
                postInner.innerHTML = '';
                postInner.classList.remove('tweet-card');
                postModal.hidden = false;
            }
 
            // push current term to history ONLY if already viewing a term
            if (postInner.dataset.type === 'term') {

                let currentKey = postInner.dataset.key;

                if (currentKey) {
                    termHistory.push(currentKey);
                }
            }
 
            // update state to the new term
            postInner.dataset.type = 'term';
            postInner.dataset.key  = key;
 
            showInlineTermPanel(termData);
 
            return;
        }







        //clicking back for terms + related terms modals
        if (event.target.closest('#term-back')) {

            let postInner = document.getElementById('post-modal-inner');
            let backButton = document.getElementById('term-back');

            let inlineTermName = document.getElementById('inline-term-name');
            let inlineTermTopic = document.getElementById('inline-term-topic');
            let inlineTermDef = document.getElementById('inline-term-definition');
            let inlineTermRel = document.getElementById('inline-term-related');

            // let modalTerm = document.getElementById('modal-term');
            // let modalDefinition = document.getElementById('modal-definition');
            // let modalRelated = document.getElementById('modal-related');
            


            //remove most previous from stack
            //navigates to previous term user clicked on
            // popping the previous term from the stack
            let previousKey = termHistory.pop();


            // if nothing to go back to
            if (!previousKey) {
                if (backButton) backButton.classList.add('hidden');
                return;
            }

            //lookup using the key
            let previousTerm = glossaryLookup[previousKey];


            //if it doesn't exist then stop
            if (!previousTerm) return;
        



            //populating the panel with the previous term
            inlineTermName.textContent = previousTerm.term;
            inlineTermTopic.textContent = previousTerm.topic;
            inlineTermDef.textContent = previousTerm.definition;
            inlineTermRel.innerHTML = buildRelatedHTML(previousTerm);


            postInner.dataset.type = 'term';
            postInner.dataset.key = previousKey;


            // hide back button if we're back to the first term
            if (termHistory.length === 0) {
                backButton.classList.add('hidden');
            } else {
                backButton.classList.remove('hidden');
            }
 
            return;
        }




            


       




        if (event.target.closest('#inline-term-close')) {
            let inlineTermPanel = document.getElementById('inline-term-panel');
            let postInner = document.getElementById('post-modal-inner');

            inlineTermPanel.hidden = true;
            termHistory = [];
            postInner.dataset.type = 'post';
            postInner.dataset.key = '';

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






       
        //closing the post modal if click on close or backdrop

        if (event.target.id === 'post-modal-close' || event.target.id === 'post-modal'){
            let postModal = document.getElementById('post-modal');
            let inlineTermPanel = document.getElementById('inline-term-panel');
            let postInner = document.getElementById('post-modal-inner');
 
            postModal.hidden = true;
            


            // reset all term state on close
            if (inlineTermPanel) inlineTermPanel.hidden = true;
            termHistory = [];
 
            if (postInner) {
                postInner.dataset.type = '';
                postInner.dataset.key  = '';
            }
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









        let filters = document.querySelectorAll('#topic-filters .filter-btn');

        filters.forEach((btn) => {

            btn.addEventListener('click', () => {

                // update the active filter based on what is clicked
                activeFilter = btn.dataset.filter;

                //removing "active" class from all buttons
                filters.forEach((b) => {
                    b.classList.remove('active');
                });

                //add "active" class to what's clicked
                btn.classList.add('active');

                //if "All" is selected, reshuffle and re-render posts
                if (activeFilter === "All") {
                    let shuffledData = {
                        // copy all properties from the original data object
                        // posts, glossary, etc
                        // asked claude if there is an operator to copy all data without manually calling
                        // ... spread operator
                        // conversation: https://claude.ai/share/18d9ec65-1005-4953-9d0e-2d3405e4f6aa
                        ...data,

                        // override Posts property with a shuffled version
                        // take the original posts, shuffle them, assign result
                        Posts: shufflePosts(data.Posts)
                    };

                    renderItems(shuffledData);
                }

                //apply filtering to posts
                filterFeed();
            });

        });

});









// for info button

let infoBtn = document.getElementById('info-btn');
let infoModal = document.getElementById('info-modal');
let infoClose = document.getElementById('info-modal-close');

//opening the info modal on first load so user has context of what the interface purpose is
infoModal.hidden = false;

// closing the info modal
infoClose.addEventListener('click', () => {
    infoModal.hidden = true;
});

// close on backdrop click
infoModal.addEventListener('click', (event) => {
    if (event.target.id === 'info-modal') {
        infoModal.hidden = true;
    }
});

// reopening via info button
infoBtn.addEventListener('click', () => {
    infoModal.hidden = false;
});