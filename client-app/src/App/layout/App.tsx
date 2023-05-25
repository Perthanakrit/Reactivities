import React, { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import axios from "axios";
import { Activity } from "../../features/models/activity";
import NavBar from "./Navbar";
import ActivityDashboard from "../../features/dashboard/ActivityDashboard";
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities").then((response) => {
      //console.log(response);
      setActivities(response.data);
    });
  }, []);

  function handleSelectedActivity(id : string)
  {
    setSelectedActivity(activities.find(x=> x.id === id));
  }

  function handleCancelledActivity()
  {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id? : string)
  {
    id ? handleSelectedActivity(id) : handleCancelledActivity();
    setEditMode(true);
  }

  function handleFormClose()
  {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    activity.id 
    ? setActivities([...activities.filter(x=> x.id !== activity.id), activity]) 
    : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeteleActivity(id:string) {
    setActivities([...activities.filter(x => x.id !== id)])
  }

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7rem" }}>
        <ActivityDashboard
          activities={activities} /*activities=this.activities */
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectActivity={handleCancelledActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeteleActivity}
        />
      </Container>
    </>
  );
}

export default App;
