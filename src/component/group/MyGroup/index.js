import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import styles from './MyGroupStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAdd from 'react-native-vector-icons/MaterialIcons';
import { SearchableFlatList } from "react-native-searchable-list";
import { Data } from "../../../api/Data";

let citys = Data.ref('/citys');

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

  _handleClickItem = (name) => {
    this.props.navigation.navigate('DetailGroup')
  }

  componentWillMount() {
    citys.on('value', (snapshot) => {
      let data = snapshot.val();
      let items = Object.values(data);
      this.setState({ items: items });
    });
  }

//   componentDidMount() {
//     const { user } = firebase.auth()
//     this.setState({ 
//       user:user
//      })
// }

  render() {
    const { navigate } = this.props.navigation;
    const { items, searchTerm, searchAttribute, ignoreCase } = this.state;

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={{ height: 39, paddingTop: 10 }}>
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
                <TouchableOpacity style={styles.item} onPress={() => this._handleClickItem(item.name)} >
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
                  />
                  <View style={{ paddingLeft: 20, paddingTop: 7 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14 }}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
                <View ></View>
              </View>
            }
            keyExtractor={item => item.id}
          />
        </ScrollView>


        <TouchableOpacity style={{ zIndex: 1000, bottom: 60, justifyContent: 'flex-end', marginLeft: "80%", position: 'absolute' }} onPress={()=>navigate("CreatGroup")}>
          <IconAdd name="add-circle" size={60} style={{ color: "green" }} />
        </TouchableOpacity>
      </View>
    );
  }
}


