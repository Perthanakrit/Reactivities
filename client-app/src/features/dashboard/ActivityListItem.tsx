//import { SyntheticEvent, useState } from "react";
import {
  Button,
  Header,
  Icon,
  Item,
  Segment,
  Image,
  Label,
} from "semantic-ui-react";
import { Activity } from "../../App/models/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

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
  const uriActivities: string = "/activities/";

  return (
    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="canceled"
            style={{ textAligh: "center" }}
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              style={{ maginBottom: 3 }}
              size="tiny"
              circular
              src="/assets/user.png"
            />
            <Item.Content>
              <Item.Header as={Link} to={`${uriActivities}${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by {activity.host?.displayName}
              </Item.Description>

              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You are hosting this activity
                  </Label>
                </Item.Description>
              )}

              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green">
                    You are going to this activity
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy h:mm aa")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
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
