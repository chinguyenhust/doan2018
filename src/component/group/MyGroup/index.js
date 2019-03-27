import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './MyGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";
import * as firebase from 'firebase';

let groups = Data.ref('/groups');

export default class MyGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      searchAttribute: "name",
      ignoreCase: true,
      items: [],
      user: null,

    }
  }

  _handleClickItem = (name, groupId) => {
    this.props.navigation.navigate('DetailGroup', { name: name, groupId: groupId })
  }

  componentWillMount() {
    var items = []
    groups.on('child_added', (snapshot) => {
      let data = snapshot.val();
      // if (data.createdByUserId === firebase.auth().currentUser.uid) {
        items.push({
          id: snapshot.key,
          name: data.name,
          chedule: data.schedule,
          userId: data.createdByUserId,
          created_at: data.created_at,
          avatar: data.avatar
        })
      // }
      this.setState({ items: items });
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { items, searchTerm, searchAttribute, ignoreCase } = this.state;

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={{ height: 39 }}>
            <Text style={{ fontSize: 20 }}>Nhóm của tôi</Text>
          </View>
          <View style={{ height: 1, backgroundColor: "#000", alignSelf: "stretch" }}></View>
        </View>

        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity style={styles.search}>
            <TextInput style={{ fontSize: 18, width: "84%", }} placeholder="Tìm kiếm"
              onChangeText={searchTerm => this.setState({ searchTerm })}
            ></TextInput>
            <Icon name="ios-search" style={{ fontSize: 24, color: "#a9a9a9", width: "6%", marginTop: 5, }} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{}}>
          <SearchableFlatList
            data={items}
            searchTerm={searchTerm}
            ignoreCase={ignoreCase}
            searchAttribute={searchAttribute}
            renderItem={
              ({ item }) => <View style={{ flexDirection: "column", paddingTop: 10 }}>
                <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name, item.id)} >
                  {(item.avatar === "") ?
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                  /> 
                  : 
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{uri: item.avatar}}
                  /> 
            }
                  <View style={{ paddingLeft: 20, paddingTop: 7 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14 }}>{item.created_at}</Text>
                  </View>
                </TouchableOpacity>
                <View ></View>
              </View>
            }
            keyExtractor={item => item.id}
          />
        </ScrollView>


        <TouchableOpacity style={{ zIndex: 1000, bottom: 60, justifyContent: 'flex-end', marginLeft: "80%", position: 'absolute' }} onPress={() => navigate("CreatGroup")}>
          <IconAdd name="add-circle" size={60} style={{ color: "green" }} />
        </TouchableOpacity>
      </View>
    );
  }
}


