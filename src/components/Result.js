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
} from 'reactstrap'

export default class Result extends Component {
  render() {
    const {
      props: {
        Actors = '',
        Awards = '',
        BoxOffice = '',
        Country = '',
        DVD = '',
        Director = '',
        Genre = '',
        Language = '',
        Metascore = '',
        Plot = '',
        Poster = '',
        Production = '',
        Rated = '',
        Ratings = [],
        Released = '',
        Response = '',
        Runtime = '',
        Title = '',
        Type = '',
        Website = '',
        Writer = '',
        Year = '',
        imdbID = '',
        imdbRating = '',
        imdbVotes = '',
        Error,
      },
    } = this;

    return <Row className="pb-2">
      <Col xs="12">
        {
          Response === 'False' ?
            <Col className="flex-grow-1">{Error}</Col>
            :
            <Card inverse>
              <CardImg width="100%" src={Poster} alt={Title} />
              <CardImgOverlay>
                <CardTitle>{Title}</CardTitle>
                <CardText>
                  <Row><Col className="flex-grow-1">Awards: {Awards}</Col></Row>
                  <Row><Col className="flex-grow-1">Box Office: {BoxOffice}</Col></Row>
                </CardText>
              </CardImgOverlay>
            </Card>
        }
      </Col>
    </Row>
  }
}
