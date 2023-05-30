import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import {Link} from "react-router-dom";

export default function HomePage () {
    return (
        <Segment inverted={true} textAlign='center' vertical className="masthead">
            <Container text>
                        <Header>
                            <Image size="massive" src="/assets/logo.png" alt="logo" style={{marginButtom: 12}}/>
                        </Header>
                        <Header as="h2" inverted content="Welcome to Reactivities"/>
                        <Button as={Link} to="/activities" size="huge" inverted>
                            Take me to the Activities!
                        </Button>
            </Container>
        </Segment>
    );
}

