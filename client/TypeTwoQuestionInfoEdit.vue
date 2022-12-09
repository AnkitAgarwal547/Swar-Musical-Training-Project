<template>
    <v-container>
        <v-toolbar flat>
            <v-card-actions>
                <v-icon @click="backToQuestions" color="secondary"  style="margin-right: 10px">
                    mdi-arrow-left-thick
                </v-icon>
            </v-card-actions>
            <v-toolbar-title style=""><b>Edit Question {{question.questionId}}</b></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-form ref="form" @submit.prevent="saveQuestion" class="custom_form">
            <v-card>
                <v-row no-gutters>
                    <v-col cols="3">
                        <v-switch
                            v-model="question.questionStatus"
                            inset
                            dense
                            class="mt-2 ml-6" 
                            color="blue"
                            @change="putQuestionStatus()"
                            :label="question.questionStatus ? 'Active' : 'Inactive'"
                        >
                        </v-switch>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="3">
                        <v-card-actions style="justify-content:center;">
                            <v-btn
                                class="mx-5"
                                :disabled="disabled"
                                type="submit"
                                color="secondary"
                                width="200"
                                @click="saveQuestion"
                            >Save Changes</v-btn
                            >
                        </v-card-actions>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-container>
                    <v-dialog persistent v-model="editTextDialog" width="900" height="800">
                        <EditText :editedText="toBeEditedText" @changeEditedText="changeEditedText($event)"/>
                    </v-dialog> 

                       <v-row no-gutters>
                    <v-col cols="2" align="right" class="mr-3">
                        <v-card-text class="pr-5"> Question Type </v-card-text>
                    </v-col>
                    <v-col cols="1">
                         <v-text-field
                            outlined
                            dense 
                            value="2"
                            disabled
                        ></v-text-field>
                    </v-col>
                </v-row>
                
                <v-row no-gutters>
                    <v-col cols="2" align="right" class="mr-3">
                        <v-card-text class="pr-5"> Statement </v-card-text>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="question.questionStatement"
                            outlined
                            dense 
                            clearable
                            @click="editTextStatement($event)"
                            :rules="questionStatementRules"
                            :success="questionStatementSuccess"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row no-gutters>
                    <v-col cols="2" align="right" class="mr-3 mt-1">
                        <v-card-text class="pr-5">
                            Key Sequence
                        </v-card-text>
                    </v-col>
                    <v-col cols="6">
                        <div style="width:500">
                            <template  v-for="(itm, indx) in question.questionKeySequence">
                                <v-chip :key="indx" close @click:close="deleteKey(indx)">
                                    {{itm}}  
                                </v-chip>
                            </template>
                        </div>
                    </v-col> 
                </v-row>

                <v-row>    
                    <v-card style="width:150px" class="ml-15 mt-4">
                        <ul style="text-decoration:none" v-for="(key, i) in keySequenceMaster4" :key="i">
                            <v-row>
                                <v-col cols="5" style="font-size:15px" no-gutters class="ma-0 pa-0">
                                    {{key}}
                                </v-col>
                                <v-col cols="1" class="ml-0 pl-0 ma-0 pa-0"><v-icon style="font-size:15px" no-gutters @click="addKey4(i)">mdi-plus</v-icon>
                                </v-col>
                            </v-row>
                        </ul>
                    </v-card>
                </v-row>

                <v-row no-gutters>
                        <v-col cols="2" align="right" class="mr-3">
                            <v-card-text class="pr-5">Options </v-card-text>
                        </v-col>
                        <v-col cols="6">
                            <v-combobox
                                v-model="question.questionOptions"
                                :items="thaats"
                                :search-input.sync="searchOption"
                                hide-selected
                                hint="Maximum of 10 tags"
                                label="Add some tags"
                                multiple
                                persistent-hint
                                small-chips
                                deletable-chips
                                :success="questionOptionsSuccess"
                                :rules="questionOptionsRules"
                            >
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                No results matching "<strong>{{ searchOption }}</strong>". Press <kbd>enter</kbd> to create a new one
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                        </v-col>
                    </v-row>

                <v-row no-gutters  class="my-4">
                    <v-col cols="2" align="right" class="mr-3 mt-4">
                        <v-card-text class="pr-5"> Audio </v-card-text>
                    </v-col>
               </v-row>
        
                <v-row v-if="errorMessage || successMessage">
                    <v-col cols="6" offset-md="2">
                        <v-alert v-if="errorMessage" type="error">
                            {{errorMessage}}
                        </v-alert>
                        <v-alert v-if="successMessage" type="success">
                            {{successMessage}}
                        </v-alert>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-form>
  </v-container>
</template>

<script>

import TypeTwoQuestion from "../../models/TypeTwoQuestion";
import LessonQuestionMapping from "../../models/LessonQuestionMapping";
import {mapMutations } from "vuex";
import url1 from '../../../config.js';
import EditText from "../../components/admin/EditText";
import Thaat from "../../models/Thaat";
export default {
     beforeRouteEnter(to, from, next) {
        next(vm => {
            setTimeout(() => {
                if (!vm.$store.state.auth.adminUser._id)
                   {
                       vm.$router.push("/");
                   }
            }, 0);
        });
    },
    name: "TypeTwoQuestionInfoEdit",
    components:{
        EditText
    },
    data() {
        return {
                items:[],
                url:url1.url,
                question_id:'',
                thaats:[
                    // "Bilawal","Khamaaj","Kaafi","Asavari","Bahiravi",
                    // "Kalyan","Marwa","Purvi","Todi","Bhairav"
                ],
                successMessage:'',
                search:'',
                searchOption:null,
                searchAnswer:null,
                errorMessage:'',
                disabled:false,
                question:new TypeTwoQuestion(),
                questionType:'', 
                questionAud:'',
                questionOptions:'',
                questionAnswers:'',
                questionAns:[],
                file:'', 
                toBeEditedText:'',
                inputType: '',
                textField:null,
                editTextDialog:false,
                keySequenceMaster4:[
                 "4C", "4C#", "4D", "4D#", "4E", "4F", "4F#", "4G", "4G#", "4A","4A#", "4B"
                 ], 

                keySequenceMaster5:[
                 "5C", "5C#", "5D", "5D#", "5E", "5F", "5F#", "5G", "5G#",  "5A","5A#", "5B"
                 ], 

                keySequenceMaster6:[
                 "6C", "6C#", "6D", "6D#", "6E", "6F", "6F#", "6G", "6G#", "6A","6A#", "6B"
                 ], 
            
            questionStatementSuccess:false,
            questionStatementRules: [
                v => {
                    if (v) {
                        this.questionStatementSuccess = true;
                        return true;
                    } else {
                        this.questionStatementSuccess = false;
                        return "Statement is required";
                    }
                },
                v =>
                    (v || "").length >= 2 ||
                    "Statement be at least 2 characters long",
                v =>
                    (v || "").length <= 255 ||
                    "Statement must be less than 255 characters"
            ],
            
            questionAudioSuccess: false,
            questionAudioRules: [        
                v =>
                    (!v || v.size<1000000) ||"Question audio size should be less than 1MB",
                ],

            questionOptionsSuccess:false,

                questionAnswersSuccess:false,
                questionAnswersRules: [
                    v =>
                        (v || []).length >= 1 ||
                        "Question options must contain at least one value",
                    v =>
                        (v || []).length <= 10 ||
                        "Question options must contain at most ten values"
                    ],
        }
    },
    computed: {
        auth() {
            return this.$store.state.auth;
        }
    },

    methods:{
        ...mapMutations(["removeQuestion"]),
        getQuestion()  {
            TypeTwoQuestion.getQuestionInfo(this.question_id, this.questionType, this.auth.token).then((res)=>{
            console.log('Get question Client res.data client type 2', res.data);
            this.question=res.data;
            this.question.questionType=2;
            this.questionAns=this.question.questionAnswers;
            this.questionAud=`${this.url}/uploads/`+res.data.questionAudio;
            console.log('Get questions.question', this.question);
            })
        },
        saveQuestion() {
            this.disabled = true;

            if (this.question.questionStatement.length<2 || this.question.questionStatement.length>255)
                {
                    this.errorMessage = 'Statement should be valid';
                    setTimeout(() => (this.errorMessage = ""), 5000);
                    this.disabled = false;
                    return;
                }

             if(!this.question.questionAnswers.every(val => this.question.questionOptions.includes(val)))
                {
                    this.errorMessage = 'Question Answers should be within question options';
                    setTimeout(() => (this.errorMessage = ""), 5000);
                    this.disabled = false;
                    return;
                }    

            if(!this.question.questionStatus)
                {
                    this.question.questionStatus=false;
                }

            if (!(this.question.questionStatus===true) && !(this.question.questionStatus===false))
                {
                    this.errorMessage = 'Status should be valid';
                    setTimeout(() => (this.errorMessage = ""), 5000);
                    this.disabled = false;
                    return;
                }

                const formData={
                    questionAudio:this.question.questionAudio,
                    questionStatement:this.question.questionStatement,
                    questionKeySequence:this.question.questionKeySequence,
                    questionOptions:this.question.questionOptions,
                    questionAnswers:this.question.questionAnswers,
                    questionStatus:this.question.questionStatus,
                }
        },
               
        putQuestionStatus()
            {
                LessonQuestionMapping.putQuestionStatusonMasterStatusChange(this.question._id, this.question.questionStatus,this.question.questionType, this.auth.token).then(res=>{
                    console.log('put status change lesson', res.data);
                }).catch(err=>{
                    console.log(err.response.data);
              });
            },

            backToQuestions(){
                this.removeQuestion();
                this.$router.replace('/admin/questions');
            },

             addKey4(index)
        {
            this.question.questionKeySequence.push(this.keySequenceMaster4[index]);
        },

        addKey5(index)
        {
            this.question.questionKeySequence.push(this.keySequenceMaster5[index]);
        },

        addKey6(index)
        {
            this.question.questionKeySequence.push(this.keySequenceMaster6[index]);
        },

        deleteKey(index)
        {
            this.question.questionKeySequence.splice(index, 1);
        },

        clearForm(){
            this.$refs.form.resetValidation();
        },

        editTextStatement(e){
            this.textField=e.target;
            this.textField.blur();
            this.inputType="statement";
            this.toBeEditedText=this.question.questionStatement;
            this.editTextDialog=true;
        },

        changeEditedText(editedText) {
            if(editedText===null)
            {
                this.editTextDialog=false;
            }
            else
            {
                this.toBeEditedText=editedText;
                if(this.inputType == 'statement') 
                {
                    this.question.questionStatement = editedText;
                }
            }
            this.editTextDialog = false;
        },
        getThaats(){
            Thaat.getThaats(this.auth.token).then(res=>{
                this.thaats=res.data.thaatMaster;
                console.log('this.thaatmaster' , this.thaat.thaatMaster);
            }).catch(err=>console.error(err));
        },
    }, 
    watch:{
        questionAns(value)
        { 
            console.log('value watch', value);
            if(!value.every(el=>this.question.questionOptions.includes(el)))
            {
                this.questionAns.pop();
            }
       }
    },
    mounted(){
        this.question_id=this.$store.state.question.question_id;
        this.questionType=this.$store.state.question.questionType;
        this.getQuestion(this.question_id);
        this.getThaats();
        console.log('inside type one info edit', this.question);
       }
}
</script>

<style scoped>
.custom_form {
    margin: 10px 0 0;
    border-top: 3px solid #1b73ba;
}
.custom_form >>> .v-card {
    padding-top: 20px;
}
.custom_form >>> .v-card__text {
    padding: 10px 16px;
}
</style>