
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import MapView from "react-native-maps";
import { Marker, Callout } from 'react-native-maps';
import { Data } from "../../../api/Data";
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/Ionicons';
import IconClock from 'react-native-vector-icons/Entypo';
import IconLocation from 'react-native-vector-icons/Entypo';
import IconDistance from "react-native-vector-icons/MaterialCommunityIcons"

const { width, height } = Dimensions.get('window')
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DETA = 0.0922;
const LONGTITUDE_DETA = LATTITUDE_DETA * ASPECT_RATIO;

let groups = Data.ref('/groups');
let group_user = Data.ref('/group_users');
let users = Data.ref('users');

export default class Direction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {
        latitude: this.props.navigation.state.params.userLocation.latitude,
        longitude: this.props.navigation.state.params.userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markerPosition: {
        latitude: 0,
        longtitude: 0
      },
      destination: {
        latitude: 0,
        longtitude: 0
      },
      origin: {
        latitude: 0,
        longtitude: 0
      },
      km:0,
      phut:0
    }
  }

  componentDidMount() {
    var location = this.props.navigation.state.params.location;
    var destination = {
      latitude: location.lat,
      longitude: location.lng,
    }

    this.setState({ destination: destination });

  }

  getRating = (rating) => {
    var i = 0;
    var arr = [];
    for (i = 0; i < rating; i++) {
      arr.push(
        <IconClock name="star" size={14} style={{ marginRight: 5, color: "#006805" }} />
      )
    }
    return arr;
  }

  render() {
    const uid = this.props.uid;
    const origin = this.props.navigation.state.params.userLocation;
    const item = this.props.navigation.state.params.data;
    const source = this.props.navigation.state.params.source;
    
    const destination = this.state.destination;
    const GOOGLE_MAPS_APIKEY = 'AIzaSyDXwSjZX3_R1Pib3q0-XMXz76XgWhiMSS4';
    return (
      <View style={styles.container}>
        <View style={{ top: 0, zIndex: 10000, paddingLeft: 20, position: "absolute" }}>
          <Icon name="ios-arrow-round-back" size={40}
            style={{ color: "#006805" }} onPress={() => { this.props.navigation.goBack() }} />
        </View>

        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}

          initialRegion={this.state.initialPosition}
        >

          <Marker
            coordinate={destination}>
          </Marker>

          <MapViewDirections
            origin={origin}
            destination={destination}
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
                phut:result.duration
              })
            }}
            onError={(errorMessage) => {
              console.log(errorMessage);
            }}
          />
        </MapView>

        <View style={styles.info}>
          <View style={{height:110, justifyContent:"center",}}>
            {(item.photos) ?
              <Image
                style={{ height: 110, borderRadius: 3, width:"100%" }}
                resizeMode="cover"
                source={{
                  uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1500&photoreference=' + item.photos[0].photo_reference + '&key=' + GOOGLE_MAPS_APIKEY
                }}
              />
              :
              <Image
                style={{ height: 110, borderRadius: 3 }}
                source={source}
              />
            }
          </View>

          <View style={{ flexDirection: "column", marginLeft: 10, height:140, }}>
            <Text numberOfLines={2} style={{ fontSize: 18, fontWeight: "500", color: "#000" }}>{item.name}</Text>
            {(item.rating) &&
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                {this.getRating(Math.round(item.rating))}
                <Text  >({Math.round(item.rating)} sao / {item.user_ratings_total} đánh giá)</Text>
              </View>
            }
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconLocation name="location-pin" size={14} style={{ marginRight: 10 }} />
              <Text numberOfLines={1}>{item.vicinity}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconDistance name="map-marker-distance" size={14} style={{ marginRight: 10 }} />
              <Text numberOfLines={1}>{this.state.km} km</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconClock name="clock" size={14} style={{ marginRight: 10 }} />
              <Text numberOfLines={1}>{Math.round(this.state.phut)} phút</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 10 }} >Trạng thái:</Text>
              {(item.opening_hours) ?
                <Text numberOfLines={1} style={{ color: "green" }}>Mở cửa</Text> :
                <Text numberOfLines={1} style={{ color: "red" }}>Đóng cửa</Text>
              }
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "flex-end"
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
  },
  info: {
    bottom: 10,
    zIndex: 10000,
    marginLeft: 25,
    marginRight: 25,
    height: 250,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    flexDirection: "column"
  }

});

