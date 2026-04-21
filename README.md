# Functions: Decoded Lines

For this final project for Typography & Interaction, I created a simulated political social feed with an inline glossary. The "function," or intent, of this interface is so that the average social media consumer can understand the language and context of American politics without ever leaving the application.

---

## The Problem I Found

Politics moves extremely fast within social media. As an American myself, there are still gaps to my own understanding of certain terms and concepts within American politics and fully understanding it often means leaving the conversation entirely. What I mean by this is that you may see a term within a tweet or post, navigate out of the app to search for its definition, lose your place, come back, and then find three more terms you don't recognize. Then, you repeat this inconvenient process until you've forgotten what you were even reading about.

## The Web Interface

Decoded Lines is essentially a field guide built for this specific problem. It is a constructed social feed of political discourse where glossary terms are embedded within the posts themselves and always one tap away. Definitions open inline, right beneath the posts that use them. Within these term defintions, the user can also navigate to related terms and their respective defintions as well. This flow allows the user to stay within the same page.

Regarding the terms and definitions themselves, they are all intentionally neutral. My goal was not to tell the user how or what to think about American politics, but moreso to equip them with the language and context to form an opinion about it themselves.

---

## Data Structure

I initially curated the glossary and posts within a Google Sheets (two separate pages) and exported them as a JSON file. They are stored in `data.json`. Posts reference glossary terms using double brackets, `[[term]]`, in the body text, which I parsed into clickable buttons when rendering.

For each glossary term, I included the term itself, its topic category, definition, and two to three related terms for useful context.

---

## Styles

### Typography 
Rubik Variable Font is loaded locally via `@font-face` in `style.css`.

### Color 
CSS custom properties are declared in `:root`. Each political topic has a dedicated color pair: a light base and a more saturated hover. They are used across the filter buttons and for topic tags on term definitions. The background has an animated gradient, representing the bipartisan colors of the American government with a purple middleground blending the extremes. The posts on the home feed and the modals remain neutral, and the clickable terms are highlighted yellow to stand out.

### Assets/Icons
Icons were imported as SVGs and created within Figma through Material Design Icons.
**Reset.css** is based on [The New CSS Reset](https://github.com/elad2412/the-new-css-reset) by Elad Shechter.

### Layout 
Flexbox is usedthroughout. The feed is centered with a `max-width` of 40rem, and modals use `min(40rem, 90vw)` to stay contained on both mobile and desktop.


### Responsiveness

Mobile-first styles, with `@media` queries declared at 768px and 1024px breakpoints.

---

## Features

- **Simulated social feed:** posts are styled like a real social media timeline, each containing embedded glossary terms
- **Inline term definitions:** clicking a highlighted term opens its definition beneath the post
- **Related term navigation:** each definition surfaces related terms that the user can explore, with a back button and close button to retrace back to previous terms if necessary
- **Topic filters:** users can filter the posts by specific topics, like Economy, Immigration, Elections, Healthcare, and Constitutional. `For You` filter shows all posts and shuffles all randomly on each click
- **Color-coded topic tags:** each topic has a consistent color that carries across filters and the terms themselves
- **Info modal:** opens on first load to explain the interface to first-time users and is accessible again through the info button


---

## Claude Conversations

Throughout development, Claude was used to clarify specific JavaScript concepts and methods. Each conversation is linked within the code and described below.

**Conversation #1:**
https://claude.ai/share/02377e0b-47d9-41ab-b4f5-e94a7832c9c2

In my very first conversation with Claude, I first asked about the content structure of political tweets. I decided to create all of the posts because my aim was to keep the content as neutral as possible, and pulling from real tweets/posts was a risk. However, if I curated them myself, it would keep everything educational.

I also asked Claude about specific string methods, specifically `.split()`, `.trim()`, `.slice()`. When extracting from my JSON data file, I needed to clarify the differences between these three string methods, which were used for parsing the `[[term]]` syntax in the post body text and converting them into clickable buttons. `.trim()` removes whitespace from the start and end of a string, `.split()` breaks a string into an array, and `.slice()` extracts a part of a string or array.

Then, I asked Claude to remind me what `.dataset` can read specifically, and I understood it to be custom attributes off the clickable termm buttons and for tracking term states like `data-type` and `data-key` within the post modal inner container.


**Conversation #2:**
https://claude.ai/share/18d9ec65-1005-4953-9d0e-2d3405e4f6aa

I asked Claude what specific Math methods can be used to randomly shuffle the `<li>` elements, in this case, the posts on the social media home feed. It returned two methods `Math.floor()` and `Math.random()`, which I understood for rounding numbers down and returning random decimal. So, I combined these two methods to create the shuffliing logic.

I also asked where I should place a helper function that shuffles the elements within the `<ul>`, and it explained specific scenarios dependent on when I would want the shuffle to occur. I wanted the shuffle to happen when a user clicked on a button, so I narrowed it and decided to place it in my fetch, where my data lives and after the `<li>` elements are inserted into the DOM.

Lastly, within this same conversation, I asked Claude if there was an operator within Javascript that would allow me to copy all data from a JSON object without having to manually copy/call everything, and it returned the spread operator: `...`

**Conversation #3:**
https://claude.ai/share/03efce1b-3d63-40fe-9717-7d4e3636c9e1

I asked Claude to remind me what the difference between `.textContent` vs `.innerHTML` was. `.textContent` is used for plain text, like term names and definitions, while `.innerHTML` is used for rendering HTML strings, like related term button lists.

**Conversation #4:**
https://claude.ai/share/3ce87fcf-b4c8-483d-8803-c24e00251991

When building out the related terms, I asked claude if it would be more efficient to use the `.length` property or a boolean to check for related terms. It suggested using the `.length` property, so I paired it with `.trim()` (getting rid of whitespaces) and conditional checks to collect the related terms.

**Conversation #5:**
https://claude.ai/share/006c92fb-82f7-4ccf-8718-d97494780522

I asked Claude if there was an HTML element that could be used for a line divider without explicitly using a section or div element, and it suggested using the `<hr>` element. I used it as the separator between the post content and the inline term panel.

