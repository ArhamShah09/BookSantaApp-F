import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    Image, 
    Modal, 
    ScrollView, 
    KeyboardAvoidingView
} from 'react-native';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends React.Component{
    constructor() {
        super();
        this.state={
            emailId : '',
            password : '',
            firstName : '',
            lastName : '',
            address : '',
            contact : '',
            confirmPassword : '',
            isModalVisible : false
        }
    }

    userLogIn =(emailId,password) => {
        firebase.auth().signInWithEmailAndPassword(emailId,password).then(()=>{
            console.log("LogIn Successful");
            //return Alert.alert("LogIn Successful");
            this.props.navigation.navigate('DonateBooks');
        }).catch((error)=>{
            var code = error.code;
            var message = error.message;
            console.log(message);
            return Alert.alert(message);
        });
    }

    userSignUp =(emailId,password,confirmPassword) => {
        if(password !== confirmPassword) {
            console.log("Passwords don't match");
            return Alert.alert("Passwords don't match");
        } else {
            firebase.auth().createUserWithEmailAndPassword(emailId,password).then(()=>{
                db.collection('users').add({
                    email_id : this.state.emailId,
                    first_name : this.state.firstName,
                    last_name : this.state.lastName,
                    contact : this.state.contact,
                    address : this.state.address,
                });
                console.log("User added successfully");
                return Alert.alert("User added successfully", '', [{text : 'okay', onPress : ()=>{this.setState({
                    isModalVisible : false
                })}}]);
            })
        
        .catch((error)=>{
            var code = error.code;
            var message = error.message;
            console.log(message);
            return Alert.alert(message);
        });
    }
}

    showModal =() => {
        return(
            <Modal 
                animationType = "fade"
                transparent = {true}
                visible = {this.state.isModalVisible}
            >
                <View style = {styles.modalContainer}>
                    <ScrollView style = {{width : '100%'}}>
                        <KeyboardAvoidingView style = {styles.KeyboardAvoidingView}>
                            <Text style = {styles.modalTitle}>Registration</Text>

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "First Name"
                                maxLength = {15}
                                onChangeText ={(text)=>{
                                    this.setState({
                                        firstName : text
                                    });
                                }}
                            />

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "Last Name"
                                maxLength = {15}
                                onChangeText ={(text)=>{
                                    this.setState({
                                        lastName : text
                                    });
                                }}
                            />

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "Contact"
                                maxLength = {11}
                                keyboardType = 'numeric'
                                onChangeText ={(text)=>{
                                    this.setState({
                                        contact : text
                                    });
                                }}
                            />

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "Address"
                                multiline = {true}
                                onChangeText ={(text)=>{
                                    this.setState({
                                        address : text
                                    });
                                }}
                            />

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "Email Id"
                                keyboardType = 'email-address'
                                onChangeText ={(text)=>{
                                    this.setState({
                                        emailId : text
                                    });
                                }}
                            />

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "Password"
                                secureTextEntry = {true}
                                onChangeText ={(text)=>{
                                    this.setState({
                                        password : text
                                    });
                                }}
                            />

                            <TextInput
                                style = {styles.formTextInput}
                                placeholder = "Confirm Password"
                                secureTextEntry = {true}
                                onChangeText ={(text)=>{
                                    this.setState({
                                        confirmPassword : text
                                    });
                                }}
                            />

                            <View>
                                <TouchableOpacity 
                                    style = {styles.registerButton}
                                    onPress ={()=>{this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)}}
                                >
                                    <Text style = {styles.registerButtonText}>Register</Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <TouchableOpacity 
                                    style = {styles.cancelButton}
                                    onPress ={()=>{this.setState({
                                        isModalVisible : false
                                    })}}
                                >
                                    <Text style = {{color : '#ff5722'}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </Modal>
        ) 
    }

    render() {
        return(
            <View style ={styles.container}> 

                <View>
                    {this.showModal()}
                </View>

                <View style = {styles.profileContainer}>
                    <Image 
                        style = {{width : 250, height : 300}}
                        source = {require('../assets/SantaClaus.png')}
                    />
                    <Text style = {styles.title}>Book Santa App</Text>
                </View>
                
                <View style = {styles.buttonContainer}>
                    <TextInput 
                        style = {styles.loginBox}
                        placeholder = "xyz@abc.com"
                        keyboardType = 'email-address'
                        onChangeText = {(text)=>{
                            this.setState({
                                emailId : text
                            })
                        }}
                    />

                    <TextInput 
                        style = {styles.loginBox}
                        placeholder = "Enter Password"
                        secureTextEntry = {true}
                        onChangeText = {(text)=>{
                            this.setState({
                                password : text
                            })
                        }}
                    />

                    <TouchableOpacity 
                        style = {[styles.button, {marginBottom : 20, marginTop : 20}]}
                        onPress = {()=>{this.userLogIn(this.state.emailId, this.state.password)}}>
                            <Text style = {styles.buttonText}>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = {()=>{this.setState({
                            isModalVisible : true
                        })}}>
                            <Text style = {styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
            
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F8BE85',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    title :{
        fontSize:65,
        fontWeight:'300',
        paddingBottom:30,
        color : '#ff3d00'
    },
    loginBox:{
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor : '#ff8a65',
        fontSize: 20,
        margin:10,
        paddingLeft:10
    },
    KeyboardAvoidingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalTitle :{
        justifyContent:'center',
        alignSelf:'center',
        fontSize:30,
        color:'#ff5722',
        margin:50
    },
    modalContainer:{
        flex:1,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ffff",
        marginRight:30,
        marginLeft : 30,
        marginTop:80,
        marginBottom:80,
    },
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    registerButton:{
        width:200,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:10,
        marginTop:30
    },
    registerButtonText:{
        color:'#ff5722',
        fontSize:15,
        fontWeight:'bold'
    },
    cancelButton:{
        width:200,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
    },
    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff9800",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        padding: 10
    },
    buttonText:{
        color:'#ffff',
        fontWeight:'200',
        fontSize:20
    }
});