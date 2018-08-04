import React, { Component } from 'react'
import './App.css'

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
  CardColumns,
  InputGroupAddon,
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
      Search: [],
      totalResults: 0,
      Response: 'Loading',
      page: 1,
      s: '',
    };

    this.getSearchResults = this.getSearchResults.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.showMore = this.showMore.bind(this);
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

  showMore() {
    const { Search, s, page } = this.state;
    this.submitSearch(s, page + 1);
    this.setState({ page: page + 1 });
  }

  inputChanged({ target: { name, value }}) {
    this.setState({ [name]: value });
  }

  async submitSearch(term, page = 1) {
    const result = await OMDB.search(term, page);

    if (page <= 1) {
      this.setState({ ...result })
    } else {
      const { Search } = this.state;
      const results = { ...result };
      results.Search = [...Search, ...results.Search];
      this.setState({ ...results })
    }
  }

  renderResults() {
    const { Search, Response, totalResults, Error } = this.state;

    if (Response === 'Loading') {
      return <Loading/>
    } else if (Response === 'False' && Error) {
      return <Col>{Error}</Col>;
    } else if (Response === 'True' && Search.length <= 0) {
      return <Col>No Results Found</Col>
    }

    return Search.map(result => <Result {...{ ...result, Response, totalResults }} /> );
  }

  render() {
    const {
      state: {
        Search = [],
        Response,
        Error,
        s,
      },
      renderResults,
      searchChanged,
      getSearchResults,
      inputChanged,
      showMore,
    } = this;

    return (
      <div className="App">
        <Row className="mb-4">
          <Col xs="12">
            <Navbar color="light" light expand="md">
              <NavbarBrand>OMDB Search</NavbarBrand>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <form onSubmit={getSearchResults}>
                    <Input type="search" name="s" value={s} onChange={inputChanged} placeholder="search title" />
                    <InputGroupAddon addonType="append">
                      <Button color="primary">Search!</Button>
                    </InputGroupAddon>
                  </form>
                </NavItem>
              </Nav>
            </Navbar>
          </Col>
        </Row>
        <Container>
          <CardColumns>
            {renderResults()}
          </CardColumns>
          <Button block color="primary" onClick={showMore}>Show More</Button>
        </Container>
      </div>
    );
  }
}

export default App;
