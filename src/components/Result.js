import React, { Component } from 'react'
import {
  Card,
  Row,
  Col,
  CardHeader,
  CardImgOverlay,
  CardImg,
  CardTitle,
  CardText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from 'reactstrap'
import { IMDB_PATH, PLACEHOLDER_IMAGE } from '../constants/constants'
import OMDB from '../services/OMDB';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      details: {}
    }

    this.toggle = this.toggle.bind(this);
  }

  async toggle() {
    const { imdbID } = this.props;

    const details = await OMDB.getDetails(imdbID);

    this.setState({
      modal: !this.state.modal,
      details
    });
  }

  render() {
    const {
      props: {
        Poster = '',
        Title = '',
        Type = '',
        Year = '',
        imdbID = '',
        Response = '',
        Error,
        totalResults = 0,
      },
      state: {
        modal,
        details: {
          Plot = '',
          Actors = '',
          Released = '',
          Runtime = '',
        } = {}
      },
      toggle,
    } = this;

    return <Row className="pb-2">
      <Col xs="12">
        {
          Response === 'False' ?
            <Col className="flex-grow-1">{Error}</Col>
            :
            <Card inverse onClick={toggle} style={{cursor: 'pointer'}}>
              <CardImg width="100%" src={Poster !== 'N/A' ? Poster : PLACEHOLDER_IMAGE} alt={Title} />
              <CardImgOverlay>
                <CardTitle>{Title}</CardTitle>
                <CardText>
                  <Row><Col className="flex-grow-1">Year: {Year}</Col></Row>
                </CardText>
              </CardImgOverlay>
            </Card>
        }
      </Col>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{Title}</ModalHeader>
        <ModalBody>
          <Row>
            <Col><strong>Released</strong>: {Released}</Col>
            <Col className="text-right"><strong>Runtime</strong>: {Runtime}</Col>
          </Row>
          <hr/>
          <Row>
            <Col><strong>Actors</strong>:<br/>{Actors}</Col>
          </Row>
          <hr/>
          <Row>
            <Col><p>{Plot}</p></Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Ok</Button>
        </ModalFooter>
      </Modal>
    </Row>
  }
}
