import React, { Component } from 'react'
import './App.css'

import EOS from './services/eojs'
import { BLOCK_PAGE_COUNT } from './constants/constants'

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
} from 'reactstrap';
import Spinner from 'react-spinkit';
import Block from './components/Block';

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
      blocks: [],
    };

    this.renderBlocks = this.renderBlocks.bind(this);
    this.getLatestBlocks = this.getLatestBlocks.bind(this);
  }

  componentDidMount() {
    this.getLatestBlocks();
  }

  async getLatestBlocks() {
    this.setState({ blocks: [] })

    const {
      eos,
      chain: {
        head_block_num
      }
    } = await EOS();

    let blocks = [];
    let count = 0;

    let block = await eos.getBlock(head_block_num);
    while (block.previous && count < BLOCK_PAGE_COUNT) {
      count++;
      block = await eos.getBlock(block.previous);
      block.shortId = block.id.substr(0, 16);
      if (block.transactions.length > 1) {
        block.actions = block.transactions.reduce((prev, curr, index, arr) => {
          return (index === 1 ? prev.trx.transaction.actions.length : prev) + curr.trx.transaction.actions.length;
        })
      } else {
        block.actions = block.transactions.length === 1 ? block.transactions[0].trx.transaction.actions.length : 0;
      }

      if (block.transactions.length > 0) {
        block.account = block.transactions[0].trx.transaction.actions[0].account
      }

      blocks = [...blocks, block];

      this.setState({ blocks, eos });
    }
  }

  renderBlocks(blocks) {
    if (blocks.length === 0) {
      return <Loading />;
    }
    if (blocks.length < 10) {
      return [...blocks.map((block) => {
        return <Block block={block} key={block.id} />
      }), <Loading key='loading'/>]
    } else {
      return blocks.map((block) => {
        return <Block block={block} key={block.id} />
      })
    }
  }

  render() {
    const {
      state: {
        blocks,
        eos,
      },
      renderBlocks,
      getLatestBlocks,
    } = this;

    return (
      <div className="App">
        <Row className="mb-4">
          <Col xs="12">
            <Navbar color="light" light expand="md">
              <NavbarBrand>Recent EOS Blocks</NavbarBrand>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Button outline color="primary" onClick={getLatestBlocks}>Reload Blocks</Button>
                </NavItem>
              </Nav>
            </Navbar>
          </Col>
        </Row>
        <Container>
          <Row className="text-center">
            <Col xs="2">Time</Col>
            <Col className="flex-grow-1">Block ID</Col>
            <Col xs="2">Actions</Col>
          </Row>
          <div>
            {renderBlocks(blocks, eos)}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
