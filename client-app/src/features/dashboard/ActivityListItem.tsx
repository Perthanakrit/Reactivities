//import { SyntheticEvent, useState } from "react";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Activity } from "../../App/models/activity";
import { Link } from "react-router-dom";

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {

  const uriActivities: string = '/activities/'

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src="/assets/user.png"
            ></Item.Image>
            <Item.Header as={Link} to={`${uriActivities}${activity.id}`}>
              {activity.title}
            </Item.Header>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {activity.date}
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
