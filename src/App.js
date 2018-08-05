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
  Form,
  Label,
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
      Response: null,
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
    this.setState({ Response: 'Loading' });
    const termkey = `${term}-${page}`;
    const savedResult = JSON.parse(localStorage.getItem(termkey));
    const result = savedResult || await OMDB.search(term, page);

    if (!savedResult) {
      localStorage.setItem(termkey, JSON.stringify(result));
    }

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

    if (Response === 'False' && Error) {
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
        page,
        totalResults,
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
            </Navbar>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col sm="12" md={{ size: 8, offset: 2 }} >
            <Card>
              <CardBody>
                <Form onSubmit={getSearchResults}>
                  <Label for="search">Find a Show</Label>
                  <Input type="search" id="search" name="s" value={s} onChange={inputChanged} placeholder="search title" />
                  <Button color="primary">Search</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {Response !== null &&
          <Row>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <Card>
                <CardBody>
                  {Response === 'Loading' ? <Loading /> : ''}
                  <CardColumns>
                    {renderResults()}
                  </CardColumns>
                  {page * 10 < totalResults ? <Button block color="primary" onClick={showMore}>Show More</Button> : ''}
                </CardBody>
              </Card>
            </Col>
          </Row>}
      </div>
    );
  }
}

export default App;
