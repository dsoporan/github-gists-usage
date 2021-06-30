import React, { useState, useEffect } from 'react';
import { Form, Grid, Image, Card, Icon, List } from 'semantic-ui-react';
import ReactTimeAgo from 'react-time-ago'
import './App.css';

function App() {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [repos, setRepos] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gistsList, setGistList] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExampleAvatar();
    fetchGistsList();
  }, []);

  const fetchExampleAvatar = () => {
    fetch("https://api.github.com/users/example")
    .then(res => res.json())
    .then(data => {
      setData(data);
    })
  }

  const fetchGistsList = () => {
    fetch("https://api.github.com/users/octocat/gists")
    .then(res => res.json())
    .then(data => {
      setGistList(data);
    })
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
    fetch(`https://api.github.com/users/${userInput}`)
      .then(res => res.json())
      .then(data => {
        if (data.message)
          setError(data.message)
        else{
          setError(null);
          setData(data);
        }
      })
  }

  return (
    <div>
      <div className="navbar">Github Search</div>
      <div className="container">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={5}>
            <div className="search">
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Input placeholder='Github User' name='github user' onChange={handleSearch}/>
                  <Form.Button content='Search'/>
                </Form.Group>
              </Form>
              </div>
              <div className="avatar">
              { error ? (<h1>{error}</h1>) : (
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
            <Grid.Column width={11}>
            <div className="gists-list">
              
            </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
}

export default App;
