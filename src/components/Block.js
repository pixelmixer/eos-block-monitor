import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import {
  Collapse,
  CardBody,
  Card,
  Row,
  Col,
  Badge,
  CardHeader,
} from 'reactstrap'
import { TriangleDownIcon, TriangleRightIcon } from 'react-octicons'
import { formatTime } from '../helpers/helpers'
import Markdown from 'react-markdown'

export default class Block extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggledId: true,
      toggledDetails: false,
    };

    this.toggleShortId = this.toggleShortId.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
  }

  componentDidMount() {
    this.getRicardianContract();
  }

  async getRicardianContract() {
    const {
      account,
      eos,
    } = this.props;

    if (account) {
      const {
        actions = [],
        ricardian_clauses = [],
      } = await eos.getAbi(account);

      const ricardianContract = [
        // TODO: Process ricardian_contract with mustache before rendering via markdown.
        ...actions.map(({ ricardian_contract }) => <Markdown source={ricardian_contract} />),
        ...ricardian_clauses.map(({ body = '' }) => <p>{body}</p>)
      ]

      this.setState({ ricardianContract });

      return ricardianContract;
    }
  }

  toggleShortId() {
    this.setState({ toggledId: !this.state.toggledId });
  }

  toggleDetails() {
    this.setState({ toggledDetails: !this.state.toggledDetails });
  }

  render() {
    const {
      toggleShortId,
      toggleDetails,
      props: { block: { id, shortId, timestamp, actions = 0 } },
      state: { toggledId, toggledDetails, ricardianContract }
    } = this;

    return <Row className="pb-2">
      <Col xs="12">
        <Card>
          <CardHeader>
            <Row className="text-center" onClick={toggleDetails} onMouseOver={toggleShortId} onMouseOut={toggleShortId} style={{ 'cursor': 'pointer' }}>
              <Col xs="2"><Badge color="secondary">{formatTime(timestamp)}</Badge></Col>
              <Col className="flex-grow-1">{toggledId ? shortId : id}</Col>
              <Col xs="2"><Badge color="secondary">{actions}</Badge> { toggledDetails ? <TriangleDownIcon className="float-right"/> : <TriangleRightIcon className="float-right"/> }</Col>
            </Row>
          </CardHeader>
          {toggledDetails &&
            <Row>
              <Col xs="12">
                <Collapse isOpen={toggledDetails}>
                  <CardBody>
                  <ReactJson {...{ src: this.props.block, collapsed: 1, displayDataTypes: false, displayObjectSize: false, editKeyRequest: false, collapseStringsAfterLength: 45, shouldCollapse: false, onAdd: false, onDelete: false, onEdit: false, onSelect: false }} theme="summerfruit:inverted" style={{ 'overflowY': 'scroll' }} />
                  </CardBody>
                </Collapse>
              </Col>
            </Row>
          }
          { ricardianContract }
        </Card>
      </Col>
    </Row>
  }
}
