import React, { Component } from 'react'
import './App.scss'

import OMDB from './services/OMDB'
import queryString from 'query-string'

import {
  Container,
  Col,
  Card,
  CardBody,
  Button,
  Row,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Input,
  FormGroup,
} from 'reactstrap';
import Spinner from 'react-spinkit';
import Result from './components/Result';

const Loading = () => <Col xs="12">
<Card>
  <CardBody>
    <div className="d-flex justify-content-center">
      <Spinner name="three-bounce"></Spinner>
    </div>
  </CardBody>
</Card>
</Col>

class App extends Component {
  constructor() {
    super();

    this.state = {
      results: [],
      s: '',
    };

    this.getSearchResults = this.getSearchResults.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
  }

  componentDidMount() {
    const { s } = queryString.parse(document.location.search);
    if (s) {
      this.setState({ s });
      this.submitSearch(s)
    }
  }

  getSearchResults(event) {
    const { s } = this.state;
    document.history.pushState({
      search: `?s=${s}`
    })

    event.preventDefault();
    this.submitSearch(s);
  }

  inputChanged({ target: { name, value }}) {
    this.setState({ [name]: value });
  }

  async submitSearch(term) {
    const results = await OMDB.search(term);
    this.setState({ results: [{...results}] })
  }

  renderResults(results) {
    return results.map(result => <Result {...result}/>);
  }

  render() {
    const {
      state: {
        results = [],
        s,
      },
      renderResults,
      searchChanged,
      getSearchResults,
      inputChanged,
    } = this;

    return (
      <div className="App">
        <Row className="mb-4">
          <Col xs="12">
            <Navbar color="light" light expand="md">
              <NavbarBrand>OMDB Search</NavbarBrand>
              <Nav className="ml-auto" navbar>
                <form onSubmit={getSearchResults}>
                  <NavItem>
                    <FormGroup>
                      <Input type="search" name="s" value={s} onChange={inputChanged} placeholder="search title" />
                    </FormGroup>
                  </NavItem>
                  <NavItem>
                    <Button outline color="primary">Search</Button>
                  </NavItem>
                </form>
              </Nav>
            </Navbar>
          </Col>
        </Row>
        <Container>
          <Row className="text-center">
            <Col className="flex-grow-1">Search Results</Col>
          </Row>
          <div>
            {results.length > 0 ? renderResults(results): <Loading/>}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
