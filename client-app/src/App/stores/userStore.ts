import { runInAction } from 'mobx';
import { makeAutoObservable } from 'mobx';
import { User, UserFormValues } from "../models/user";
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';

export default class UserStore {
    user: User | null = null;
    
    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn()  {
        return !!this.user; 
    }

    login = async (creds:UserFormValues) => {
        try {
            const user = await agent.Account.login(creds); //loop
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities');
            store.modalStore.closeModal();
        }
        catch (err) {
            throw err;
        }
    };

    register = async (creds:UserFormValues) => {
        try {
            const user = await agent.Account.register(creds); // looop
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities');
            store.modalStore.closeModal();
        }
        catch (err) {
            throw err;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    };



    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (err) {
            console.log(err);
        }
    }
}