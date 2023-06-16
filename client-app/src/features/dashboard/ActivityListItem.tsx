//import { SyntheticEvent, useState } from "react";
import { Button, Header, Icon, Item, Segment, Image } from "semantic-ui-react";
import { Activity } from "../../App/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Props {
  activity: Activity;
}

const activityImageStyle = {
  filter: "brightness(50%)",
  height: "150px",
  width: "100%",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const headerActivity = {
  padding: "10px",
  color: "white",
};

export default function ActivityListItem({ activity }: Props) {

  const uriActivities: string = '/activities/'

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Image
                size="tiny"
                circular
                src="/assets/user.png"
              ></Item.Image>
              <Item.Header
                as={Link}
                to={`${uriActivities}${activity.id}`}
                style={headerActivity}
              >
                {activity.title}
              </Item.Header>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>Attendees go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`${uriActivities}${activity.id}`}
          color="teal"
          floated="right"
          content="view"
        />
      </Segment>
    </Segment.Group>
  );
}
