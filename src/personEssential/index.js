import React, { useEffect, useState } from 'react'
import { Row, Col, Container } from "react-bootstrap";
import { connect } from 'react-redux'
import EssentialPage from './person-essential';
import DockPrototype from '../personEssential2/DockPrototype';

const Essential = (props) => {
    const [discussions, setDiscussions] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const jsonUrl = `${process.env.PUBLIC_URL}/data/dockingItems.json`;
            const initialData = await fetch(jsonUrl);
            const data = await initialData.json();
            console.log(data);
            setDiscussions(data.person_essential);
        }

        fetchData();
    }, []);

    return (
        // <Container>
        //     <link rel="preconnect" href="https://fonts.gstatic.com" />
        //     <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
        //     <Row>
        //         <Col>
        //             <DockPrototype discussions={discussions} setDiscussions={setDiscussions}>
        //                 <div className="relative bg-emerald-600 min-w-full min-h-screen">
        //                     <EssentialPage></EssentialPage>
        //                 </div>
        //             </DockPrototype>
        //         </Col>
        //     </Row>
        // </Container>

        
        <DockPrototype discussions={discussions} setDiscussions={setDiscussions}>
            <div className="relative min-w-full min-h-screen">
                <EssentialPage></EssentialPage>
            </div>
        </DockPrototype>
    );
}

const mapStateToProps = () => {
    return {};
};

// const mapActionToProps = { toggleLeftSidePanel }
const mapActionToProps = {}

export default connect(
    mapStateToProps,
    mapActionToProps
)(Essential);