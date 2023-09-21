import { Activity, ActivityFormValues } from './../models/activity';
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from 'date-fns';
import { store } from './store';
import { Profile } from '../models/profilie';

export default class ActivityStore {
    
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    deleting = false;
    
    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime());
        
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>{
                const date = format(activity.date!, 'dd MMMM yyyy')
                activities[date] = activities[date] ?  [...activities[date], activity] : [activity];
                return activities;
            },{} as {[key: string] : Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitital(true);
        try
        {
            const activities = await agent.Activities.list();

            activities.forEach(activity => {
                this.setActivity(activity);
            })

            this.setLoadingInitital(false);

        }
        catch (error)
        {
            console.error(error);
            this.setLoadingInitital(false);
            

        }
    }

    //loadActivity when click View 
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitital(true);
            try
            {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);

                runInAction(() => { this.selectedActivity = activity; })

                this.setLoadingInitital(false);
                return activity;
            }
            catch (error)
            {
                console.error(error);
                this.setLoadingInitital(false);
            }
        }
    }

    private setActivity = async (activity: Activity) => {
        const user = store.userStore.user; // get user from userStore in store.ts
        
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.userName
            ) // check if user is in attendees list of activity 

            activity.isHost = activity.hostUsername === user.userName; // check if user is host of activity 
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername); // get host of activity 
        }
        
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitital = (state: boolean) => {
        this.loadingInitial = state;
    }

    crateActivity = async (activity : ActivityFormValues) => {
        const user = store.userStore.user; // get user from userStore in store.ts 
        const attendee = new Profile(user!); // create new Profile from user
        try
        {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.userName;
            newActivity.attendees = [attendee]; // add attendee to attendees array of activity
            this.setActivity(newActivity);
            
            runInAction (() => {
                this.selectedActivity = newActivity;
                
            });
        }
        catch (error)
        {
            console.log(error);
        }
    }

    updateActivity = async (activity : ActivityFormValues) => {
        this.loading = true;

        try{
            await agent.Activities.update(activity);

            if (activity.id) { // if activity exist in activityRegistry
                const updateActivity = { ...this.getActivity(activity.id), ...activity }; // update activity with activityFormValues 
                this.activityRegistry.set(activity.id, updateActivity as Activity); // set activityRegistry with updated activity
                this.selectedActivity = updateActivity as Activity;
                console.log(updateActivity);
            }

        }
        catch (error)
        {
            console.log(error);
            // runInAction (() => {
            //     this.loading = false;
            // });
        }
        
    }

    deleteActivity =async (id:string) => {
        this.loading = true;
        this.deleting = true;
        try
        {
            await agent.Activities.delete(id);
            runInAction (() => {
                this.activityRegistry.delete(id);
                this.loading = false;
                this.deleting = false;
            });
        }
        catch (error)
        {
            console.log(error);
            runInAction (() => {
                this.loading = false;
            });
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.userName);
                    this.selectedActivity.isGoing = false;
                }else{
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        }catch (error){
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true; // set loading = true
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        }catch (error){
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }
    

}



