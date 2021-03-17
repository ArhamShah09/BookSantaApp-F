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
    KeyboardAvoidingView, 
    FlatList, 
    SnapshotViewIOS 
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { Card } from 'react-native-elements'

export default class ReceiverDetailsScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            userId : firebase.auth().currentUser.email,
            receiverId : this.props.navigation.getParam('details')['user_id'],
            requestId : this.props.navigation.getParam('details')['request_id'],
            bookName : this.props.navigation.getParam('details')['book_name'],
            reason : this.props.navigation.getParam('details')['reason_to_request'],
            receiverName : '',
            receiverContact : '',
            receiverAddress : '',
            receiverRequestDocId : ''
        }
    }

    getReceiverDetails() {
        db.collection('users').where('email_id','==',this.state.receiverId).get().then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    receiverName : doc.data().first_name,
                    receiverContact : doc.data().contact,
                    receiverAddress : doc.data().address,
                });
            });
        });
        //Explanation not done
        db.collection('requested_books').where('request_id','==',this.state.requestId).get().then(snapshot => {
            snapshot.forEach(doc => {
                this.setState({
                    receiverRequestDocId : doc.id
                });
            });
        });
    }

    componentDidMount() {
        this.getReceiverDetails();
    }

    updateBookStatus = () => {
        db.collection('all_donations').add({
            book_name : this.state.bookName,
            request_id : this.state.requestId,
            requested_by : this.state.receiverName,
            donor_id : this.state.userId,
            request_status : "Donor Interested"
        });
    }

    addNotification = () => {
        var message = this.state.userId + " has shown interest in donating this book."
        db.collection('all_notifications').add({
            targeted_user_id : this.state.receiverId,
            donor_id : this.state.userId,
            request_id : this.state.requestId,
            book_name : this.state.bookName,
            date : firebase.firestore.FieldValue.serverTimestamp(),
            notification_status : "unread",
            message : message
        });
    }

    render() {
        return(
            <View style = { styles.container }>

                <View style = {{ flex : 0.3 }}>
                    <Card title = {'Book Information'} titleStyle = {{ fontSize : 20 }}>

                        <Card>
                            <Text style = {{ fontWeight : 'bold' }}>Name : { this.state.bookName }</Text>
                        </Card>

                        <Card>
                            <Text style = {{ fontWeight : 'bold' }}>Reason : { this.state.reason }</Text>
                        </Card>
                        
                    </Card>
                </View>

                <View style = {{ flex : 0.3 }}>
                    <Card title = {'Receiver Information'} titleStyle = {{ fontSize : 20 }}>

                        <Card>
                            <Text style = {{ fontWeight : 'bold' }}>Name : { this.state.receiverName }</Text>
                        </Card>

                        <Card>
                            <Text style = {{ fontWeight : 'bold' }}>Contact : { this.state.receiverContact }</Text>
                        </Card>

                        <Card>
                            <Text style = {{ fontWeight : 'bold' }}>Address : { this.state.receiverAddress }</Text>
                        </Card>
                        
                    </Card>
                </View>

                <View style = { styles.buttonContainer }>
                    { this.state.receiverId !== this.state.userId 
                        ? (
                            <TouchableOpacity 
                                style = { styles.button }
                                onPress = {() => {
                                    this.updateBookStatus();
                                    this.addNotification();
                                    this.props.navigation.navigate('MyDonations');
                                }}
                            >
                                <Text>I want to donate</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    buttonContainer : {
        flex:0.3,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:200,
        height:50,
        justifyContent:'center',
        alignItems : 'center',
        borderRadius: 10,
        backgroundColor: 'orange',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation : 16
    }
});