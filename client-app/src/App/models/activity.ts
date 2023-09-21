import { Profile } from "./profilie";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees?: Profile[];
}

export class ActivityFormValues {
    id? : string = undefined;
    title: string = "";
    category: string = "";
    description: string = "";
    date: Date | null = null;
    city: string = "";
    venue: string = "";

    constructor(activity?: ActivityFormValues) {
        if (activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.date = activity.date;
            this.city = activity.city;
            this.venue = activity.venue;
            
        }
    }
    
}

export class Activity implements Activity {  // Activity is a class that implements Activity interface
    constructor(init: ActivityFormValues) { // constructor takes ActivityFormValues as parameter
        this.id = init.id! // assign init to this
        this.title = init.title;
        this.description = init.description;
        this.category = init.category;
        this.date = init.date;
        this.city = init.city;
        this.venue = init.venue;
        
    }

    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string = "";
    isCancelled: boolean = false;
    isGoing: boolean = false;
    isHost: boolean = false;
    host?: Profile;
    attendees?: Profile[];
}