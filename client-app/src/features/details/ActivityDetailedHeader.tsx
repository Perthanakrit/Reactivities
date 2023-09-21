import { observer } from "mobx-react-lite";
import React from "react";
import {
  Button,
  Header,
  Item,
  Segment,
  Image,
  Confirm,
  Label,
} from "semantic-ui-react";
import { Activity } from "../../App/models/activity";
import { Link } from "react-router-dom";
import { format, set } from "date-fns";
import { useStore } from "../../App/stores/store";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const {
    activityStore: { updateAttendance, loading, cancelActivityToggle },
  } = useStore();

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {activity.isCancelled && (
          <Label
            style={{ position: "abosloute", zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date!, "dd MMM yyyy")}</p>
                <p>
                  Hosted by{" "}
                  <strong>
                    <Link
                      to={`/profiles/${activity.host?.username}`}
                      color="white"
                    >
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            <Button
              color={activity.isCancelled ? "green" : "red"}
              basic
              floated="left"
              content={
                activity.isCancelled ? "Re-activate Event" : "Cancel Event"
              }
              onClick={cancelActivityToggle}
              loading={loading}
            ></Button>
            <Button
              disabled={activity.isCancelled}
              as={Link}
              to={`/manage/${activity.id}`}
              color="orange"
              floated="right"
            >
              Manage Event
            </Button>
          </>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={() => setConfirmOpen(true)}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            disabled={activity.isCancelled}
            color="teal"
            onClick={updateAttendance}
            loading={loading}
            co
          >
            Join Activity
          </Button>
        )}
      </Segment>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          updateAttendance();
        }}
      />
    </Segment.Group>
  );
});
