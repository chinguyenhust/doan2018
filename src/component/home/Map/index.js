
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from "react-native-maps";
import { Marker, Callout } from 'react-native-maps';
import { Data } from "../../../api/Data";
import Icon from 'react-native-vector-icons/Ionicons';


const { width, height } = Dimensions.get('window')
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DETA = 0.0922;
const LONGTITUDE_DETA = LATTITUDE_DETA * ASPECT_RATIO;

let groups = Data.ref('/groups');
let group_user = Data.ref('/group_users');
let users = Data.ref('users');

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {
        latitude: 21.026339,
        longitude: 105.832758,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markerPosition: {
        latitude: 0,
        longtitude: 0
      },
      listMember: [],
      isOnPosition: false,
      leaderId: "",
    }
  }

  componentDidMount() {

    const groupId = this.props.groupId;
    const uid = this.props.uid;
    const listMember = this.state.listMember;
    groups.orderByKey().equalTo(groupId).on("child_added", (snapshot) => {
      this.setState({
        isOnPosition: snapshot.val().isOnMap,
        leaderId: snapshot.val().createdByUserId,
      })
    })
    group_user.orderByChild("group_id").equalTo(groupId).on("child_added", (snapshot) => {
      users.orderByKey().equalTo(snapshot.val().user_id).on("child_added", (snapshot) => {
        var data = snapshot.val();
        listMember.push({
          userId: snapshot.key,
          userName: data.userName,
          phone: data.phone,
          position: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          privarteLocation: data.privarteLocation
        })
        this.setState({
          listMember: listMember
        })
      })
    })

  }

  render() {
    var { listMember, isOnPosition, leaderId } = this.state;
    const uid = this.props.uid;

    return (
      <View style={styles.container}>

        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}

          initialRegion={this.state.initialPosition}
        >
          {(listMember && isOnPosition) &&
            listMember.map((option) =>
              (leaderId === option.userId && leaderId !== uid) ?
                <Marker
                  // title={option.userName}
                  coordinate={option.position}
                  pinColor="#008605"
                >
                  <Callout>
                    <View>
                      <Text style={styles.textColor}>Nhóm trưởng: {option.userName}</Text>
                      <Text style={styles.textColor}>{option.phone}</Text>
                    </View>
                  </Callout>
                </Marker>
                :
                (uid !== option.userId) ?

                  <Marker
                    title={option.userName}
                    coordinate={option.position}>
                    <Callout>
                      <View>
                        <Text style={styles.textColor}>{option.userName}</Text>
                        <Text style={styles.textColor}>{option.phone}</Text>
                      </View>
                    </Callout>
                  </Marker>
                  :
                  <View></View>
            )}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderColor: "rgba(0,122,255,0.3)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#008605"
  },
  textColor: {
    color: "#000000"
  }

});

