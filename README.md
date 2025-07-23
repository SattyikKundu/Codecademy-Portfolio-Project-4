# Reddit-Minimal-project
This is **Portfolio Project #4** for my Full-stack web development course on Codecademy. This app uses Reddit API calls to render preselected subreddits that users can search through. Besides using React, this app uses Redux features like Dispatch and Store.

---

## I. Project Overview

- **What is this app?**
  It's a miniature clone of Reddit that use Reddit JSON data to recreate some of Reddit's most popular SubReddits and their posts' content. 

- **What does it do?**
  It lets user search through Reddit's most popular SubReddits for any interesting posts and trends.

- **Who is it for?**
  Mainly for anyone who wants to keep up-to-date with the most popular SubReddits

- <ins>**KEY Features<ins>:**
  - Side bar on the left that lets users navigate between various SubReddits.
  - Search query bar, on heaer, where users can filter out posts in current SubReddit based on matching text in posts' titles, author names, and post content.
  - Posts are able to hold multi-media content including text, images, image galleries, link cards, and videos (these videos even has sound users can listen to).
  - Users can click on the comments icon at the bottom of each post to view the comments to the current SubReddit post.

---

## II. Tech Stack

- **React**           — used 'react-scripts' for frontend development.
- **Netlify**         — used for public deployment of the app.
- **Reddit JSON**     — used to access and extract SubReddits' data to get infromation on top SubReddits as well as
- **CSS**             — used for styling purposes.
- **React packages**    — imported several packages to help implement app (below are the main packages found within my ***package.json*** file):

| Package | Description |
| --- | --- |
| `@fortawesome/...` | Set of dependencies for using **Font Awesome** icons in the app.                            |
| `axios`            | Handles HTTP requests to fetch subreddit and post data from Reddit’s JSON API.              |
| `dashjs`           | Enables playback of hosted **MPEG-DASH** `.mpd` files with both video and audio.            |
| `react-dom`        | Renders React components into the browser's Document Object Model (DOM).                    |
| `react-redux`      | Connects React components to the Redux store using `useSelector`, `useDispatch`, etc.       |
 `react-markdown`    | Converts Markdown (from Reddit post bodies) into renderable React HTML elements.            |
| `@reduxjs/toolkit` | Simplifies Redux logic with built-in methods like `createSlice()`, `configureStore()`, etc. |
| `react-router-dom` | Manages navigation and routing in the app using `Routes`, `BrowserRouter`, and `Link`.      |
| `react-scripts`    | Provides configuration and scripts for running, building, and testing Create React App.     |
| `react-spinners`   | Offers loading spinner components to indicate loading states in the UI.                     |
| `netlify-cli`      | Enables app to run and test serverless functions locally, proxy frontend request to `/api/*`, and deploy site and backend functions to Netlify. (<ins>***note***</ins>: `netlify-cli` package is under "devDependencies" in *package.json*)|

---

## III. Live Site & Demo Screenshots

- 🔗 **Live Site:** [https://mini-reddit-clone.netlify.app](https://mini-reddit-clone.netlify.app/)

### **Screenshots of Reddit Minimal's features and how they work:**
<ins>**Note:**</ins> Many of these screenshots are zoomed in for better viewing.
**1.** Here's the home page for the Reddit Minimal app. It consists of the left sidebar that contains list of selectable/clickable SubReddits (the current active SubReddit is Highlighted), a header section with a search bar, and the posts' body for the current SubReddit.
![(1) Reddit-Minimal-home-page](https://github.com/user-attachments/assets/cf529ce8-b1e4-477d-a7b5-267a0ba9350c)

**2.** The SubReddits' posts on this App are designed to handle various forms of multi-media data typically found on actual Reddit website. Here are the forms of media that the **Reddit Minimal** app can handle:\
   
   **i.** <ins>First off, any post can have embedded images as shown below:</ins>
       ![(2) Single image posts](https://github.com/user-attachments/assets/131c0fde-005b-4e77-97a2-b0fe5091a32c)

   **ii.** <ins>Besides posts with single embedded images, the app can also handle posts with image carousels. In the below screenshot, visible arrows allow users to parse the carousel:</ins>
       ![(3) Carousel images post](https://github.com/user-attachments/assets/3a478b6e-d0d4-46fe-8d94-8005ac338036)

   **iii.** <ins>Also, thanks to the imported ***dashjs*** package, `.mpd` videos that are typically hosted on Reddit can run on this app, allowing users to enjoy both video and sound:</ins>
       ![(4) Video hosted on Reddit](https://github.com/user-attachments/assets/215cb37a-9180-455f-a3c2-7b49ab88fa93)

   **iv.** <ins>Some posts have URL cards (or Link cards) to visually represent the linked website prior to clicking the link:</ins>
       ![(5) Link cards post](https://github.com/user-attachments/assets/a511b38a-c991-4ecb-ba05-954ac48d1615)

   **v.** <ins>Lastly, Reddit Minimal can handle plain text posts like normal. ***However***, there are text posts that have additional styling and formatting; these are represented as markdown strings within the Reddit JSON API. The **react-markdown** package can convert the markdown strings to format and style the posts' text as intended with reasonable accuracy. Here's an example of a post with text styled and fomatted with the help of **react-markdown**:<ins>
   ![(6) Mark-down handling](https://github.com/user-attachments/assets/08b9bc71-fe47-40ca-8a47-0de778122dfb)

**3.** Another feature, as mentioned earlier, is the search bar in the header menu. It allows users to search and filter current SubReddit's posts based on the search bar's query that matches with posts' *title*, *author*, and *post body* text. After typing in the search term in the text box, click on the *magnifying glass* icon to initiate search. Additionally, if no posts match search query, an error message would be returned. See screenshots below:\

  **i.** <ins>Below is an example of a post returned for the query `thread` for the SubReddit **NoStupidQuestions**. However, Reddit Minimal currently does **not** support any feature that highlights the search query text inside the posts for visual clarity and user-friendliness (this feature will be added in the future): </ins>
  ![(7) Search Term Query](https://github.com/user-attachments/assets/a13e4317-69da-461c-a959-bc5021b8ea00)

  **ii.** <ins>Also, if there's no returned posts for Search Query, here's the returned error message:</ins>
  ![(8) No posts message](https://github.com/user-attachments/assets/3cc8c2f6-b530-41e9-af39-c92888bcd19f)

  **iii.** <ins>As seen in the above/previous screenshot, you can see the **Clear** button as well as the name of the current SubReddit in the search bar. For convenience, the **Clear** button clears the search bar and returns all posts for current SubReddit. Also, regarding the current SubReddit notice in the search bar, despite it's convenience, is hidden for table and mobile screen sizes (specifically for **<=612px** screen width) to save screen space. However, the current SubReddit is still viewable using the toggleable Sidebar menu. See Screenshot Below:</ins>
  <img src='https://github.com/user-attachments/assets/6ccfdd73-25ae-4b9c-bc4f-a0e28fbb2ba6' max-width='500' />
  

**4.** The last major feature of Reddit Minimal is the rendering of comments for each post. At the bottom-right of each post is a *comment* icon that the user can click on. Clicking on the *comment* icon will cause the rendering of available comments from the Reddit API for the current clicked on post. Also, as seen in screenshot below, you notice that some comments have varying levels of indentation; similar to comments in actual Reddit posts, this visually cues which nested comments are replies to which parent comments:
![(10) Nested comments for post](https://github.com/user-attachments/assets/d3a7bc0d-2f07-4d09-8212-5bf2afd88c58)

---

## IV. Limitations of Reddit Minimal App 

- Since this is a Reddit clone app relying on the actual Reddit's json data, various Reddit interactions can't be replicated including account *login*, *post creation*, and *comment writing*.
- As stated earlier, while the Search Bar feature can filter posts based on posts' *author*, *title*, and *body text*, the returned posts doesn't highlight any text parts *yellow* to match the search query. This feature will be added in the future in improve user-friendliness when searching.
- This app requires being connected to a Reddit app created on a Reddit user account. The `client_id` and `client_secret` need to be part of environmental variables to run the full app (*more will be explained in the next section detailing local installation*).
- Finally, the Reddit API restricts the number of fetch requests for `json` within a period. <ins>***For example***</ins>: Each time a user clicks on a SubReddit option from the left sidemenu, a fetch request is made to the Reddit API for posts' data. Then, if the user clicks the SubReddit options too many times in a short time period, the Reddit API will temporarily restrict API fetches. Usually, the user will need to wait at least 10-15 minutes before reloading the page and accessing the Reddit API again. Here's the screenshot showing error messages for this situation:
  ![(11) Fetch error handling](https://github.com/user-attachments/assets/ee8bd1a4-fa25-4155-b8bb-015fbbddfa36)

---

## V. Steps to Use Reddit Minimal App Locally

1. First, clone this repository and save on your local machine:
     ```bash
   git clone https://github.com/SattyikKundu/Codecademy-Portfolio-Project-4.git
   cd Codecademy-Portfolio-Project-4
2. Have ***Node.js*** installed to run app locally (<ins>**OPTIONALLY**</ins>: install an IDE like **Visual Studio Code** for editing and running app code)
3. Use `npm install` command to install packages listed in ***package.json*** file. Note that `netlify-cli` package is part of "devDependencies" in *package.json*.
4. Have an active Reddit account so you can create your Reddit app. After logging in (or registering first), go to [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) in order to start creating the reddit app.
5. Rename the `.env.example` file to `.env` in order to store environment variables. Step #7 will explain which environment variables to add to `.env`. 
6. Below screenshot is the form for creating a Reddit app to interface with. Fill out based on template in screenshot. However, app type should be *script* since its a developer app. Also, *redirect uri* should where the app is being host. This can be on your localhost (like `http://localhost:8888` or something similar) or on a hosting site like Netlify (like  `https://your-subdomain-name.netlify.app/`); the *redirect uri* also needs to start with `http://` or `https://`. <ins>Finally, after filling out fields, click the **`create app`** button</ins>:
<img width="600" alt="Reddit app creation screenshot #1" src="https://github.com/user-attachments/assets/9c554a8c-db55-44be-8d42-25687180e87b" /></br>

7. <ins>Next, after creating the Reddit app (see screenshot below), get the following values from created app and add them to your `.env` file</ins>:
   - `REDDIT_CLIENT_ID` from area covered in *purple*
   - `REDDIT_CLIENT_SECRET` from area covered in *blue*
   - `REDDIT_USERNAME` from area covered in *green*)
   - and `HOSTING_URL` from area covered in *red*, but exclude the `http://` and `https://` when copying the redirect uri value to `HOSTING_URL`. Note that `HOSTING_URL` is the uri where this app's code is hosted (<ins>*example*</ins>: `localhost:8888` OR `your-app-subdomain.netlify.app`). 
</br><img width="600" alt="Reddit app creation screenshot #2" src="https://github.com/user-attachments/assets/0dfc0689-0f34-4ab1-9eca-697413407278" /></br>

8. Finally, run the app locally using a `npm start` command to run the app inside your Command Line Interface (**CLI**) or Independent Developer Environment (**IDE**).
---

## VI. Future Improvements for Reddit Minimal

- Add *yellow* highlighting to text areas in posts matching the search query for better user friendliness.
- While my app covers most media handling cases (*image carousels*, *embedded video*, etc.), there are still some edge cases that I'll handle later like showing media in post comments (some users post Gifs, images, and even video link in the posts comment section!).
- In the actual Post comment sections found in Reddit, there are lines that connect comments. These lines make it visually easy to follow which comments are nested replies to which comments. I would like to impelment something like this in the future. See below screenshot showing what I want to implement:
<img src='https://github.com/user-attachments/assets/1a64ca4b-43a0-4765-86b2-9b857d61af67' width='500' />



