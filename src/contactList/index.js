import React from 'react'
import { Row, Col, Container } from "react-bootstrap";

import {connect} from 'react-redux'
import UnifiedContactListing from './contact-list';



class ContactList extends React.Component {

    render() {
        return (
            <Container>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet"/>
                <Row>
                    <Col>
                        <UnifiedContactListing></UnifiedContactListing>                      
                    </Col>
                </Row>              
            </Container>
        );
    }
}

const mapStateToProps = () => {
  return { };
};

// const mapActionToProps = { toggleLeftSidePanel }
const mapActionToProps = { }

export default connect(
  mapStateToProps,
  mapActionToProps
)(ContactList);