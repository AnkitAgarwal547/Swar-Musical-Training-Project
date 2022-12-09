import axios from "axios";
import url1 from '../../config.js'
const url=`${url1.url}/api/discounts?type=Group`;

export default class GroupDiscount {
    constructor(discount = {}) {
        this.type = discount.type || 'Group';
        this.status = discount.status || 'ACTIVE';
        this._id = discount._id || "";
        this.personName = discount.personName || "";
        this.email = discount.email || "";
        this.name = discount.name || "";
        this.discountPercentage = discount.discountPercentage || "";
        this.couponCode = discount.couponCode || "";
        this.startDate = discount.startDate || "";
        this.endDate = discount.endDate || "";
        this.noofUsers = discount.noofUsers || ""
    }

    //api to get all discounts in SeasonalDiscounts.vue page
    static get = async (token)=>{//token) => {
        console.log('get all group discount client')
        return  axios.get(`${url}`, {headers:{"x-auth-token":token}})
    }

    //api to get course count in Dashboard.vue page
    static getCourseCount = async (token) => {//(token)
        console.log('get course client')
        return  axios.get(`${url}/coursecount`, {headers:{"x-auth-token":token}});
    }

    //get course info for a particular course id for courseinfoedit page
    static getCourseById = async (course_id, token) => {//(token)
        console.log('get course by id client', course_id);
        return  axios.get(`${url}/courseinfo/${course_id}`, {headers:{"x-auth-token":token}});
    }


     //used for updating course info title and description
    static saveDiscount(discount_id, discount, token) {
        //console.log('put admin user client',adminUserEmail,adminuser)
           return axios.put(`${url}/discounts/${discount_id}`, discount, {headers:{"x-auth-token":token}});
        }


    //to post new discount from add course page
    static postDiscount(discount, token) {//token
        console.log('post discount client', discount);
        return axios.post(`${url}`, discount, {headers:{"x-auth-token":token}});
    }

    static deleteDiscount(discount_id, token){
         console.log('model discount_id', discount_id);
        return (
            confirm("Are you sure you want to delete this discount?") &&
            axios.delete(`${url}&discount_id=${discount_id}`, {headers:{"x-auth-token":token}},{discount_id:discount_id})
            );
     }
}