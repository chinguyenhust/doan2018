
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from "react-native-maps";
import { Marker, Callout } from 'react-native-maps';
import { Data } from "../../../api/Data";
import MapViewDirections from 'react-native-maps-directions';
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

export default class Direction extends Component {
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
      destination:{
        latitude: 0,
        longtitude: 0
      },
      origin:{
        latitude: 0,
        longtitude: 0
      }
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

  render() {
    const uid = this.props.uid;
    const origin = this.props.navigation.state.params.userLocation;
    const destination = this.state.destination;
    const GOOGLE_MAPS_APIKEY = 'AIzaSyDXwSjZX3_R1Pib3q0-XMXz76XgWhiMSS4';
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: 10, zIndex:10000 , paddingLeft:20}}>
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
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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

