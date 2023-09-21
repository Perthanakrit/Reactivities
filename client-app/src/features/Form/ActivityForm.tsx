import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../App/stores/store";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ActivityFormValues } from "../../App/models/activity";
import LoadingComponent from "../../App/layout/LoadingComponent";
import { v4 as uudi } from "uuid";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../App/common/form/MyTextInput";
import MyTextArea from "../../App/common/form/MyTextArea";
import MySelectInput from "../../App/common/form/MySelectInput";
import { categoryOptions } from "../../App/common/options/categoryOptions";
import MyDateInput from "../../App/common/form/MyDateInput";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    crateActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
    deleting,
  } = activityStore;

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [activity, setActivity] = useState<ActivityFormValues>(
    new ActivityFormValues()
  );

  const validationSchema = Yup.object({
    // Yup is a library for validation in forms
    title: Yup.string().required("The activity tittle is required"),
    description: Yup.string().required("The activity tittle is required"),
    category: Yup.string().required("The activity category is required"),
    date: Yup.string().required("Date is required"),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity: any) => {
        setActivity(new ActivityFormValues(activity));
        // console.log(activity);
      });
    }
  }, [id, loadActivity]);

  function handleFormSubmit(activity: ActivityFormValues) {
    if (activity.id) {
      let newActivity = {
        ...activity,
        id: uudi(),
      };
      crateActivity(newActivity).then(() =>
        navigate(`/activities/${activity.id}`)
      );
    } else {
      updateActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`);
      });
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />

            <MyTextArea rows={4} placeholder="Description" name="description" />
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />

            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />

            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
