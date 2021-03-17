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

export default class BookRequestScreen extends React.Component {

    constructor() {
        super();
        this.state={
            bookName : '',
            reasonToRequest : '',
            userId : firebase.auth().currentUser.email
        }
    }

    addRequest = (bookName, reason)=> {
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        db.collection('requested_books').add({
            user_id : userId,
            book_name : bookName,
            reason_to_request : reason,
            request_id : randomRequestId
        })
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7)
    }

    render() {
        return(
            <View style = {{ flex : 1}}>

                <KeyboardAvoidingView style = {styles.keyBoardStyle}>

                    <TextInput
                        style = {styles.formTextInput}
                        placeholder = 'Book Name'
                        onChangeText = {(text)=> {
                            this.setState({
                                bookName : text
                            });
                        }}
                        value = {this.state.bookName}
                    />

                    <TextInput
                        style = {[styles.formTextInput,{height : 300}]}
                        placeholder = 'Reason for the request'
                        multiline
                        numberOfLines = {8}
                        onChangeText = {(text)=> {
                            this.setState({
                                reasonToRequest : text
                            });
                        }}
                        value = {this.state.reasonToRequest}
                    />

                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = {()=>{this.addRequest(this.state.bookName, this.state.reasonToRequest)}}
                    >
                        <Text>Request</Text>
                    </TouchableOpacity>

                
                </KeyboardAvoidingView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
    },
    button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop:20
    },
});