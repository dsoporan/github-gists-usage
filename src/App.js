import React, { useState, useEffect } from 'react';
import { Form, Grid, Image, Card, Icon, Button, Item, List } from 'semantic-ui-react';
import ReactTimeAgo from 'react-time-ago';
import './App.css';

function App() {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [repos, setRepos] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gistsList, setGistList] = useState([]);
  const [forks, setForks] = useState(new Map());
  const [fileContent, setFileContent] = useState(new Map());
  const [avatarError, setAvatarError] = useState('');
  const [gistsError, setGistsError] = useState('');

  useEffect(() => {
    fetchExampleAvatar();
    setForks(new Map());
    setGistList([]);
    setFileContent(new Map());
  }, []);

  const fetchExampleAvatar = () => {
    fetch("https://api.github.com/users/example")
    .then(res => res.json())
    .then(data => {
      setData(data);
    })
  }

  const fetchUserAvatar = () => {
    fetch(`https://api.github.com/users/${userInput}`)
      .then(res => res.json())
      .then(data => {
        if (data.message)
          setAvatarError(data.message)
        else{
          setAvatarError(null);
          setData(data);
        }
      })
  }

  const fetchUserGistsList = () => {
    fetch(`https://api.github.com/users/${userInput}/gists`)
      .then(res => res.json())
      .then(data => {
        if (data.message)
          setGistsError(data.message)
        else{
          data.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });
          setGistList(data);
          fetchForks(data);
          fetchContent(data);
          setGistsError(null);
        }
      })
  }

  const fetchForkForGist = (gist) => {
    fetch(`https://api.github.com/gists/${gist.id}/forks`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0){
          data.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });
          if (data.length >= 3){
            data = data.slice(0, 3);
            setForks(map => (new Map(map.set(gist.id, data))));
          }
        }
        else {
          data = ["No Forks!"];
          setForks(map => (new Map(map.set(gist.id, data))));
        }
    })
  }

  const  fetchForks = async (data) => {
    for (var key of Object.keys(data)) {
      await fetchForkForGist(data[key]);
    }
  }

  const fetchContentForFile = (file) => {
    if (file.raw_url){
      fetch(file.raw_url)
        .then(res => res.text())
        .then(data => {
          if (data.length > 0){
              setFileContent(map => (new Map(map.set(file.filename, data))));
          }
      })
    }
  }

  const fetchContent = async (data) => {
    for (var key of Object.keys(data)) {
      if (data[key].files){
        for (var keyFile of Object.keys(data[key].files)){
          await fetchContentForFile(data[key].files[keyFile]);
        }
      }
    }
  }

  const setData = ({ name, login, followers, following, public_repos, avatar_url}) => {
    setName(name);
    setUsername(login);
    setFollowers(followers);
    setFollowing(following);
    setRepos(public_repos);
    setAvatar(avatar_url);
  }

  const handleSearch = (e) => {
    setUserInput(e.target.value);
  }

  const handleSubmit = () => {
    fetchUserAvatar();
    fetchUserGistsList();
  }

  const handleContentClick = (gistId) => {
    let displayContent = document.getElementById(gistId).style.display;
    if (displayContent === 'none')
      displayContent = "block";
    else
      displayContent = "none";
    document.getElementById(gistId).style.display = displayContent;
  }

  return (
    <div>
      <div className="navbar">Github Search</div>
      <div className="container">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column id="left-column" width={5}>
            <div className="search">
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Input placeholder='Github User' name='github user' onChange={handleSearch}/>
                  <Form.Button content='Search'/>
                </Form.Group>
              </Form>
              </div>
              <div className="avatar">
              { avatarError ? (<h1>{avatarError}</h1>) : (
              <Card>
                <Image src={avatar} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{name}</Card.Header>
                  <Card.Header>{username}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='user' />
                    {followers} Followers
                  </a>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='user' />
                    {repos} Repos
                  </a>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='user' />
                    {following} Following
                  </a>
                </Card.Content>
              </Card>)}
              </div>
            </Grid.Column>
            <Grid.Column id="right-column" width={11}>
            <div className="gists-list">
            <Item.Group>
            { !gistsError && gistsList.length > 0 && gistsList.map(gist => (
              <Item onClick={() => handleContentClick(gist.id)} key={gist.id}>
                <Item.Image size='tiny' src='/images/github.png' />

                <Item.Content>
                  <Item.Header as='a'>{gist.description}</Item.Header>
                  <Item.Meta>Last updated: <ReactTimeAgo date={Date.parse(gist.updated_at)} locale="en-US"/></Item.Meta>
                  <Item.Description>
                    { gist.files && Object.keys(gist.files).map(file => (
                          <Button key={file}>{gist.files[file].language}</Button>
                    ))}
                  </Item.Description>
                  <Item.Extra>
                      <h5>Forks: </h5>
                      <List horizontal relaxed>
                      {forks && forks.get(gist.id) && forks.get(gist.id).map(fork => { return fork.id ? 
                          <List.Item key={fork.owner.avatar_url}>
                            <Image className="fork-avatar" circular src={fork.owner.avatar_url} />
                          </List.Item>
                        : 
                        <h1 key={fork}>{fork}</h1>})}
                        </List>
                        <div className="content-files" id={gist.id} style={{display: "none"}}>
                          <Grid divided='vertically'>
                            <Grid.Row columns={1}>
                                { gist && gist.files && fileContent && Object.keys(gist.files).map(file => {
                                return (
                                  <Grid.Column key={gist.files[file].filename}>
                                    <p><strong>{gist.files[file].filename}</strong></p>
                                    <hr/>
                                    <p>{fileContent.get(gist.files[file].filename)}</p>
                                  </Grid.Column>
                                )})}
                            </Grid.Row>
                          </Grid>
                        </div>
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
            </Item.Group>
            </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
}

export default App;
