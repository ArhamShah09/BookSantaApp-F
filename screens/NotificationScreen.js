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
import { ListItem, Icon } from 'react-native-elements';

export default class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userId : firebase.auth().currentUser.email,
            allNotifications : []
        }
        this.notificationRef = null
    }

    getNotifications = () => {
        this.notificationRef = db.collection("all_notifications").where("notification_status","==","unread")
        .where("trageted_user_id","==",this.state.userId).onSnapshot((snapshot) => {
            var allNotifications = [];
            snapshot.docs.map((doc) => {
                var notification = doc.data()
                notification["doc_id"] = doc.id
                allNotifications.push(notification)
            });
            this.setState({
                allNotifications : allNotifications
            });
        });
    }

    componentDidMount() {
        this.getNotifications();
    }

    componentWillUnmount() {
        this.notificationRef()
    }

    keyExtractor = (item,index) => index.toString();

    renderItem = ({item,index}) => {
        return(
            <ListItem
                key = { index }
                bottomDivider
            >

                <ListItem.Content>

                    <Icon name = "book" type = "font-awesome" color = "#696969" />

                    <ListItem.Title
                        style = {{ color : 'black', fontWeight : 'bold' }}
                    >

                        { item.book_name }

                    </ListItem.Title>

                    <ListItem.Subtitle style = {{ color : 'green' }} >

                        { item.message }

                    </ListItem.Subtitle>

                </ListItem.Content>

            </ListItem>
        );
    }

    render(){
        return(
          <View style={{flex : 1 }}>

            <View style={{flex:0.9}}>
              {
                this.state.allNotifications.length === 0
                ?(
                  <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:25}}>You have no notifications</Text>
                  </View>
                )
                :(
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.allNotifications}
                        renderItem={this.renderItem}
                    />
                )
              }
            </View>
            
          </View>
        )
      }
}