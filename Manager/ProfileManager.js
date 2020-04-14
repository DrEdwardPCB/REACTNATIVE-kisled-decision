import { AsyncStorage } from 'react-native';

const defaultProfiles = [
    {id:'0', type: "default", name:"Random#", min: 1, max: 100},
    {id:'1', type:"class", name:'3-Classes', class:[{displayname:'A', weight:1},{displayname:'B', weight:1},{displayname:'C', weight:1}]}
]
export default class ProfileManager {
    static instance = null
    static getInstance() {
        if (ProfileManager.instance == null) {
            ProfileManager.instance = new ProfileManager()
        }
        return ProfileManager.instance
    }
    constructor() {
        
        this.Profile = null;
        this.ready = false;
        this.getProfiles()
    }

    getProfiles = async () => {
        
        try {
            var data = await AsyncStorage.getItem("Profile")
            
            if (data == null || data == "null" || data == undefined) {
                this.ready = false
                await this.resetProfiles()
                await this.getProfiles()
                
            } else {
                this.Profile = JSON.parse(data)
            }
        } catch (error) {
            this.ready = false
            await this.resetProfiles()
            await this.getProfiles()
            
        }
        this.ready = true
    }
    setProfiles = async(newProfile)=>{
        this.Profile=newProfile;
        await this.saveProfiles()
    }
    resetProfiles = async () => {
        try {
            await AsyncStorage.setItem("Profile", JSON.stringify(defaultProfiles))
            //console.log(defaultProfiles+"$%^&*(")
            this.Profile=JSON.parse(JSON.stringify(defaultProfiles))
        } catch (error) {
            //console.log("error occur")
        }
    }
    saveProfiles = async () => {
        try {
            await AsyncStorage.setItem("Profile", JSON.stringify(this.Profile))
        } catch (error) {

        }
    }
    getProfilesObject = () => {
        //console.log(this.Profile)
        //console.log(this.ready)
        if(this.ready){
            return this.Profile
        }else{
            return null
        }

    }
} 