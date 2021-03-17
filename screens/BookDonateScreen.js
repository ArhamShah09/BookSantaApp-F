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
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class BookDonateScreen extends React.Component {

    constructor() {
        super();
        this.state={
            requestedBookList : []
        }
    }

    componentDidMount() {
        this.getRequestedBookList()
    }

    getRequestedBookList = ()=> {
        var requestRef = db.collection('requested_books').onSnapshot((snapshot)=> {
            var requestedBooks = snapshot.docs.map(document=>document.data())
            this.setState({
                requestedBookList : requestedBooks
            })
        })
    }

    keyExtractor = (item, index)=> index.toString()

    renderItem = ({item, i})=> {
        return(
            <ListItem key = {i} bottomDivider>
                <ListItem.Content>
                    <ListItem.Title style = {{ color : 'black', fontWeight : 'bold'}}>
                        { item.book_name }
                    </ListItem.Title>
                    <ListItem.Subtitle style = {{ color : 'green'}}>
                        { item.reason_to_request }
                    </ListItem.Subtitle>
                    
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress = {() => {this.props.navigation.navigate("receiverDetails",{"details" : item})}}
                    >
                        <Text>View</Text>
                    </TouchableOpacity>

                </ListItem.Content>
            </ListItem>
        )
    }
    render() {
        return(
            <View style = {{ flex : 1 }}>

                <View style = {{ flex : 1 }}>

                    {
                        this.state.requestedBookList.length === 0 
                        ? (
                            <View style = {styles.subContainer}>
                                <Text>No Books were requested</Text>
                            </View>
                        ) : (
                            <FlatList
                                keyExtractor = { this.keyExtractor }
                                data = { this.state.requestedBookList }
                                renderItem = {this.renderItem}
                            />
                        )
                    }

                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    subContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
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
        }
    }
});