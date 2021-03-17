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
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class MyDonationScreen extends React.Component {

    constructor() {
        super();
        this.state={
            userId : firebase.auth().currentUser.email,
            allDonations : [],
            donorName : ""
        }
        this.requestRef = null
    }

    getDonorDetails=(donorId)=>{
        db.collection("users").where("email_id","==", donorId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              "donorName" : doc.data().first_name + " " + doc.data().last_name
            })
          });
        })
    }

    getAllDonations = () => {
        this.requestRef = db.collection("all_donations").where("donor_id","==",this.state.userId).onSnapshot(
            (snapshot) => {
                var allDonations = [];
                snapshot.docs.map((doc) => {
                    var donation = doc.data();
                    donation["doc_id"] = doc.id
                    allDonations.push(donation);
                });
                this.setState({
                    allDonations : allDonations
                });
            }
        );
        //console.log
    }

    keyExtractor = (item,index) => index.toString()

    renderItem = ({item,i}) => {
        return(
            <ListItem
                key = {i}
                bottomDivider
            >
                <ListItem.Content>
                    <ListItem.Title style = {{ color : 'black', fontWeight : 'bold' }}>
                        {item.book_name}
                    </ListItem.Title>

                    <ListItem.Subtitle style = {{ color : 'green' }}>
                        {"Requested by : " + item.requested_by + '\nstatus : ' + item.request_status}
                    </ListItem.Subtitle>
                    
                    <Icon
                        name = "book"
                        type = "font-awesome"
                        color = "#696969"
                    />

                    <TouchableOpacity 
                        style = { styles.button }
                        onPress = {() => {
                            this.sendBook(item);
                        }}
                    >
                        <Text style = {{ color : 'white' }}>Send Book</Text>
                    </TouchableOpacity>

                </ListItem.Content>
            </ListItem>
        );
    }

    componentDidMount() {
        this.getDonorDetails(this.state.userId);
        this.getAllDonations();
    }

    sendNotification = (bookDetails, request_status) => {
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donor_id
        db.collection("all_notifications").where("request_id","==",requestId).where("donor_id","==",donorId).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                var message = ""
                if(request_status === "Book Sent") {
                    message = this.state.donorName + " sent you a book"
                } else {
                    this.state.donorName + " has show interest in donating the book"
                }
                db.collection("all_notifications").doc(doc.id).update({
                    message : message,
                    notification_status : "unread",
                    date : firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        });
    }

    sendBook = (bookDetails) => {
        if(bookDetails.request_status === "Book Sent") {
            var request_status = "Donor Interested"
            db.collection("allDonations").doc(bookDetails.doc_id).update({
                request_status : "Donor Interested"
            });
            this.sendNotification(bookDetails,request_status);
        } else {
            request_status = "Book Sent"
            db.collection("allDonations").doc(bookDetails.doc_id).update({
                request_status : "Book Sent"
            });
            this.sendNotification(bookDetails,request_status);
        }
    }

    render() {
        return(
            <View style = {{ flex : 1 }}>
                <View style = {{ flex : 1 }}>

                {this.state.allDonations.length === 0
                    ? (
                        <View>
                            <Text>No books to donate</Text>
                        </View>
                    ) : (
                        <FlatList
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.allDonations}
                            renderItem = {this.renderItem}
                        />
                    )
                }

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation : 16
    },
    subtitle :{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})