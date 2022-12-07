<template>
    <v-container>
        <v-form ref="form" @submit.prevent="saveQuestion" class="custom_form">
            <v-card>
                <v-dialog
                    persistent
                    v-model="editTextDialog"
                    width="900"
                    height="800"
                >
                    <EditText
                        :editedText="toBeEditedText"
                        @changeEditedText="changeEditedText($event)"
                    />
                </v-dialog>
                <v-container>
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
                        <v-col cols="2" align="right" class="mr-3">
                            <v-card-text class="pr-5">
                                Key Sequence
                            </v-card-text>
                        </v-col>
                        <v-col cols="6">
                            <div style="width:500">
                                <template
                                    v-for="(itm,
                                    indx) in question.questionKeySequence"
                                >
                                    <v-chip
                                        :key="indx"
                                        close
                                        @click:close="deleteKey(indx)"
                                    >
                                        {{ itm }}
                                    </v-chip>
                                </template>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row no-gutters>
                        <v-col cols="2" align="right" class="mr-3">
                            <v-card-text class="pr-5">
                                Select Options
                            </v-card-text>
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
                                append-outer-button
                                :success="questionOptionsSuccess"
                                :rules="questionOptionsRules"
                            >
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                No results matching "<strong>{{
                                                    searchOption
                                                }}</strong
                                                >". Press <kbd>enter</kbd> to
                                                create a new one
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                        </v-col>
                    </v-row>

                    <v-row no-gutters>
                        <v-col cols="2" align="right" class="mr-3">
                            <v-card-text class="pr-5">
                                Select Answers
                            </v-card-text>
                        </v-col>
                        <v-col cols="6">
                            <v-combobox
                                v-model="questionAns"
                                :items="question.questionOptions"
                                :search-input.sync="searchAnswer"
                                hide-selected
                                hint="Maximum of 10 tags"
                                label="Add some tags"
                                multiple
                                persistent-hint
                                small-chips
                                deletable-chips
                                :success="questionAnswersSuccess"
                                :rules="questionAnswersRules"
                            >
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                No results matching "<strong>{{
                                                    searchAnswer
                                                }}</strong
                                                >". Press <kbd>enter</kbd> to
                                                create a new one
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="my-4">
                        <v-col cols="2" align="right" class="mr-3 mt-2">
                            <v-card-text class="pr-5"> Audio </v-card-text>
                        </v-col>
                    </v-row>

                    <v-row v-if="errorMessage || successMessage">
                        <v-col cols="6" offset-md="2">
                            <v-alert v-if="errorMessage" type="error">
                                {{ errorMessage }}
                            </v-alert>
                            <v-alert v-if="successMessage" type="success">
                                {{ successMessage }}
                            </v-alert>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                        <v-col cols="10">
                            <v-card-actions style="justify-content:center;">
                                <v-btn class="mx-5" text @click="$router.go(-1)"
                                    >cancel</v-btn
                                >
                                <v-btn
                                    class="mx-5"
                                    :disabled="disabled"
                                    type="submit"
                                    color="secondary"
                                    width="90"
                                    @click="saveQuestion"
                                    >Submit</v-btn
                                >
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-form>
    </v-container>
</template>

<script>
import TypeTwoQuestion from "../../models/TypeTwoQuestion";
import EditText from "../../components/admin/EditText";
import Thaat from "../../models/Thaat";
export default {
    beforeRouteEnter(to, from, next) {
        next(vm => {
            setTimeout(() => {
                if (!vm.$store.state.auth.adminUser._id) {
                    vm.$router.push("/");
                }
            }, 0);
        });
    },
    name: "AddTypeTwoQuestion",
    components: {
        EditText
    },
    data() {
        return {
            question: new TypeTwoQuestion(),
            items: [],
            thaats: [
            ],
            successMessage: "",
            search: "",
            searchOption: null,
            searchAnswer: null,
            keySequenceMaster4: [
                "4C",
                "4C#",
                "4D",
                "4D#",
                "4E",
                "4F",
                "4F#",
                "4G",
                "4G#",
                "4A",
                "4A#",
                "4B"
            ],

            keySequenceMaster5: [
                "5C",
                "5C#",
                "5D",
                "5D#",
                "5E",
                "5F",
                "5F#",
                "5G",
                "5G#",
                "5A",
                "5A#",
                "5B"
            ],

            keySequenceMaster6: [
                "6C",
                "6C#",
                "6D",
                "6D#",
                "6E",
                "6F",
                "6F#",
                "6G",
                "6G#",
                "6A",
                "6A#",
                "6B"
            ],
            questionKeySequence: [],
            questionStatementSuccess: false,
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

            questionOptionsSuccess: false,
            questionOptionsRules: [
                v =>
                    (v || []).length >= 1 ||
                    "Question options must contain at least one value",
                v =>
                    (v || []).length <= 10 ||
                    "Question options must contain at most ten values"
            ],

            questionAnswersSuccess: false,
            questionAnswersRules: [
                v =>
                    (v || []).length >= 1 ||
                    "Question options must contain at least one value",
                v =>
                    (v || []).length <= 10 ||
                    "Question options must contain at most ten values"
            ],

            questionAudioSuccess: false,
            questionAudioRules: [
             ]
        };
    },
    computed: {
        auth() {
            return this.$store.state.auth;
        }
    },

    methods: {
        onAudioFileSelected() {
            {
                this.file = event.target.files[0];
                var reader = new FileReader();
                var vm = this;
                reader.onload = e => {
                    vm.questionAud = e.target.result;
                };
                reader.readAsDataURL(this.file);
                this.question.questionAudio = this.file;
                }
        },

        saveQuestion() {
            this.disabled = true;
            if (
                this.question.questionStatement.length < 2 ||
                this.question.questionStatement.length > 255
            ) {
                this.errorMessage = "Statement should be valid";
                setTimeout(() => (this.errorMessage = ""), 5000);
                this.disabled = false;
                return;
            }

            if (
                this.question.questionOptions.length < 1 ||
                this.question.questionOptions.length > 10
            ) {
                this.errorMessage = "Question options should be valid";
                setTimeout(() => (this.errorMessage = ""), 5000);
                this.disabled = false;
                return;
            }

            this.question.questionAnswers = this.questionAns;
            if (
                this.question.questionAnswers.length < 1 ||
                this.question.questionAnswers.length > 10
            ) {
                this.errorMessage = "Question Answers should be valid";
                setTimeout(() => (this.errorMessage = ""), 5000);
                this.disabled = false;
                return;
            }

            const formData = {
                questionAudio: this.question.questionAudio,
                questionStatement: this.question.questionStatement,
                questionKeySequence: this.question.questionKeySequence,
                questionStatus: this.question.questionStatus,
                questionOptions: this.question.questionOptions,
                questionAnswers: this.question.questionAnswers
            };

            TypeTwoQuestion.postQuestion(this.auth.token, formData)
                .then(res => {
                    this.disabled = false;
                    console.log("res", res);
                    this.successMessage = "Question added successfully";
                    setTimeout(() => (this.successMessage = ""), 5000);
                    this.$refs.form.reset();
                    this.questionAud = "";
                    this.question.questionKeySequence = [];
                    this.question.questionStatus = false;
                })
                .catch(err => {
                    this.errorMessage = err.response.data;
                    this.question.questionStatus = false;
                    this.questionAud = "";
                    this.question.questionKeySequence = [];
                    setTimeout(() => (this.errorMessage = ""), 5000);
                    this.disabled = false;
                });
        },

        addKey4(index) {
            this.question.questionKeySequence.push(
                this.keySequenceMaster4[index]
            );
        },

        deleteKey(index) {
            this.question.questionKeySequence.splice(index, 1);
        },
        clearForm() {
            this.$refs.form.resetValidation();
        },

        editTextStatement(e) {
            this.textField = e.target;
            this.textField.blur();
            this.inputType = "statement";
            this.toBeEditedText = this.question.questionStatement;
            this.editTextDialog = true;
        },

        changeEditedText(editedText) {
            if (editedText === null) {
                this.editTextDialog = false;
            } else {
                this.toBeEditedText = editedText;
                if (this.inputType == "statement") {
                    this.question.questionStatement = editedText;
                }
            }
            this.editTextDialog = false;
        },

        getThaats() {
            Thaat.getThaats(this.auth.token)
                .then(res => {
                    this.thaats = res.data.thaatMaster;
                    console.log("this.thaatmaster", this.thaat.thaatMaster);
                })
                .catch(err => console.error(err));
        }
    },
    watch: {
        questionAns(value) {
            console.log("value watch", value);
            if (
                !value.every(el => this.question.questionOptions.includes(el))
            ) {
                this.questionAns.pop();
            }
        }
    },
    mounted() {
        this.getThaats();
    }
};
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
