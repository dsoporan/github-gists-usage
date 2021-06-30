# github-gists-usage
**Using the API provided by Github Gist API, I have created a basic single-page application with ReactJS. The goal of this application is to allow its users to enter a username and get the full list of public Gists for that user.**

Functionalities: 
- **Avatar: Show the user avatar along with details such as: username, name, followers, repo and followings.**
- Search: When a user enters a username, they should be able to get a full list of public Gists by that user, if there is no user with that username a message is prompted. 

- Filetypes: Convert the filetypes of the files in the Gist into a tag/badge (For example, if the returned Gist has a list of files containing Python and Javascript files, the items listed should have the respective tags/badges). 

- Forks: Additionally, include with the list of the Gists, the avatar of the last 3 users who have forked it. 

- Gist contents: When clicking one of the Gists, display the content of the files.

**For UI I have used the Framework React-Semantic-UI. For the last updated date of the gists I have used the 'react-time-ago' component.**
