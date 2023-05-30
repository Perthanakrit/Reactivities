import { makeAutoObservable } from 'mobx';
import { ServerError } from "../models/severError";

export default class CommonStore {
    error : ServerError | null = null;

    constructor() {
        makeAutoObservable(this);
        
    }

    setServerError(err: ServerError) {
        this.error = err;
    }
}
