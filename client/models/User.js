import axios from "axios";
import url1 from '../../config.js'
const url=`${url1.url}/api/adminuser`;

export default class User {
    constructor(user ={}) {
        this._id = user._id|| "",
        this.username = user.username|| "",
        this.email = user.email || "";
        this.phone = user.phone || "";
        this.countryCode = user.countryCode || "NA";
        this.createdOn = user.createdOn || "NA";
        this.isSubscribed = user.isSubscribed || "NA";
        this.package = user.package || "NA";
        this.nextDueDate = user.nextDueDate || "NA";
        this.totalAmtPaid = user.totalAmtPaid || "0.00";
        this.status = user.status || 'ACTIVE';
    }

    static get = async (token) => {
        return axios.get(`${url}/users`, {headers:{"x-auth-token":token}});
    }

    static putUserStatus = async ( user_id, userstatus, token)=> {
        console.log('put user status', user_id,  userstatus);

        return axios.put(`${url}/users/${user_id}`,  {status:userstatus}, {headers:{"x-auth-token":token}});
    }

    static deleteUser(user_id, token){
       console.log('del user', user_id);
       return (
           confirm("Are you sure you want to delete this User? \n This action cannot be revereted.") &&
           axios.delete(`${url}/users/${user_id}`, {headers:{"x-auth-token":token}})
        );
    }

    static getQuestionInfo = async ( question_id, token) => {
        console.log('questioninfo question_id', question_id);
        return  axios.get(`${url}/questioninfo/${question_id}`, {headers:{"x-auth-token":token}});
    }
}
