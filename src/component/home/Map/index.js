
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, PermissionsAndroid } from 'react-native';
import MapView from "react-native-maps";
import { Marker, Callout } from 'react-native-maps';
import { Data } from "../../../api/Data";
import Icon from 'react-native-vector-icons/Ionicons';
import MapViewDirections from 'react-native-maps-directions';


const { width, height } = Dimensions.get('window')
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DETA = 0.0922;
const LONGTITUDE_DETA = LATTITUDE_DETA * ASPECT_RATIO;

let groups = Data.ref('/groups');
let group_user = Data.ref('/group_users');
let users = Data.ref('users');

const GOOGLE_MAPS_APIKEY = 'AIzaSyDXwSjZX3_R1Pib3q0-XMXz76XgWhiMSS4';

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
      origin: {},
      km: 0,
      phut: 0,
      
    }
  }

  watchID: ?number = null;



  async componentDidMount() {
    await this.requestLocationPermission();

    const groupId = this.props.groupId;
    const uid = this.props.uid;

    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);


      var initalRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATTITUDE_DETA,
        longitudeDelta: LONGTITUDE_DETA,
      }

      this.setState({ initialPosition: initalRegion });
      this.setState({ markerPosition: initalRegion });
    },
      (error) => console.log(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    )

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var long = parseFloat(position.coords.longitude);
      alert("chi");
      const newCoordinate = {
        lat,
        long
      };

      users.child(uid).update({
        latitude: lat,
        longitude: long
      })
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            newCoordinate,
            500
          );
        }
      } else {
        coordinate.timing(newCoordinate).start();
      }

      var lastRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATTITUDE_DETA,
        longitudeDelta: LONGTITUDE_DETA
      }
      this.setState({ initialPosition: lastRegion });
      this.setState({ markerPosition: lastRegion });
    },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    )

    users.orderByKey().equalTo(uid).on("child_added", (snap) => {
      this.setState({
        origin: {
          latitude: snap.val().latitude,
          longitude: snap.val().longitude
        }
      })
    })


    groups.orderByKey().equalTo(groupId).on("child_added", (snapshot) => {
      this.setState({
        isOnPosition: snapshot.val().isOnMap,
        leaderId: snapshot.val().createdByUserId,
      })
    })

    const listMember = [];
    group_user.orderByChild("group_id").equalTo(groupId).on("child_added", (snapshot) => {
      users.orderByKey().equalTo(snapshot.val().user_id).on("value", (snapshot1) => {
        snapshot1.forEach(snapshot2 => {
          var data = snapshot2.val();
          listMember.push({
            userId: snapshot2.key,
            userName: data.userName,
            phone: data.phone,
            position: {
              latitude: data.latitude,
              longitude: data.longitude
            },
            privarteLocation: data.privarteLocation
          })
          
          users.orderByKey().equalTo(snapshot2.key).on("child_changed", snap3 => {
            objIndex = listMember.findIndex((obj => obj.userId === snapshot2.key));
            this.setState({indexUpdate:objIndex})

            listMember[objIndex].position = {
              latitude: snap3.val().latitude,
              longitude: snap3.val().longitude
            }
          })

          this.setState({
            listMember: listMember
          })
        })
      })
    })
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Access Permission",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    var { listMember, isOnPosition, leaderId, origin, markerPosition ,} = this.state;
    const uid = this.props.uid;
    const dataEvent = (this.props.dataEvent) ? this.props.dataEvent : {};
    var size = this.props.size;
    if(listMember.length > size){
      listMember.length = size
    }
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
                <Marker.Animated
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
                </Marker.Animated>
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
          {(dataEvent.location) &&

            <Marker
              coordinate={dataEvent.location}
              pinColor="#66245e"
            >
              <Callout>
                <View style={{ padding: 10 }}>
                  <Text style={styles.textColor}>Kế hoạch: {dataEvent.name}</Text>
                  <Text style={styles.textColor} numberOfLines={2}>Địa điểm: {dataEvent.address}</Text>
                  <Text style={styles.textColor}>Bắt đầu lúc: {dataEvent.time}</Text>
                  <Text style={styles.textColor}>Khoảng cách: {this.state.km} km</Text>
                  <Text style={styles.textColor}>Thời gian di chuyển: {Math.round(this.state.phut)} phút</Text>
                </View>
              </Callout>
            </Marker>
          }
          {(dataEvent.location) &&
            <MapViewDirections
              origin={origin}
              destination={dataEvent.location}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="hotpink"
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                console.log(`Distance "${result.distance}" km`);
                console.log(`duration "${result.duration}" phut`);

                this.setState({
                  km: result.distance,
                  phut: result.duration
                })
              }}
              onError={(errorMessage) => {
                console.log(errorMessage);
              }}
            />
          }

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
    color: "#000000",
    justifyContent: "flex-start"
  }

});
