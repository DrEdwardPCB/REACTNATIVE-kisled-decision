import React from 'react';
import { Container, Header, Content, Button, Left, Right, Body, Title, Text, Grid, Row, Col, View } from 'native-base';
import { AsyncStorage, Alert } from 'react-native'
import { Switch, Divider, Menu, Provider } from 'react-native-paper'
import PreferenceManager from '../Manager/PreferenceManager'
import ProfileManager from '../Manager/ProfileManager'
import COLOR, {getStyle } from '../StyleSheets/Theme'
import { Dimensions, Linking } from 'react-native'
import { CommonActions } from '@react-navigation/native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class PreferenceScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            isSwitchOn: false,
            initialScreen: 'Random',
            visible: false
        }
    }
    _openMenu = () => this.setState({ visible: true });

    _closeMenu = () => this.setState({ visible: false });
    shouldComponentUpdate(props, state) {
        if (this.state.isSwitchOn !== state.isSwitchOn || this.state.initialScreen !== state.initialScreen || this.state.visible !== state.visible) {
            return true
        } else {
            return false
        }
    }
    componentDidMount() {
        var obj = PreferenceManager.getInstance().getPreferenceObject()
        console.log(obj)
        if (obj.theme == 'light') {
            this.setState({ isSwitchOn: false, initialScreen: obj.StartupPage }, () => { console.log(this.state) })
        } else {
            this.setState({ isSwitchOn: true, initialScreen: obj.StartupPage }, () => { console.log(this.state) })
        }
    }
    render() {
        return (
            <Container>
                <Header style={[getStyle(COLOR.GRAY6, true, true), {
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0, elevation: 0
                }, { borderBottomWidth: 0 }]}>
                    <Left >
                    </Left>
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Preference</Title></Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={getStyle(COLOR.BG, true, true)}>
                    <Grid>
                        <Row style={{ margin: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={getStyle(COLOR.ITEM, false, true)}>Toggle Dark Theme</Text>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: 20 }}>
                                <Switch
                                    value={this.state.isSwitchOn}
                                    color={getStyle(COLOR.GRAY2, false, true).color}
                                    onValueChange={async () => {
                                        if (PreferenceManager.getInstance().getPreferenceObject().theme == 'light') {
                                            await PreferenceManager.getInstance().setPreference({
                                                theme: 'dark',
                                                AutoSaveProfile: true,
                                                StartupPage: this.state.initialScreen
                                            })
                                            this.setState({ isSwitchOn: true }, () => {
                                                this.props.route.params.update(() => {
                                                    this.props.navigation.dispatch(CommonActions.reset({
                                                        index: 3,
                                                        routes: [
                                                            { name: 'Random' },
                                                            { name: 'Shuffle' },
                                                            { name: 'Profile' },
                                                            { name: 'Preference' },
                                                        ]
                                                    }))
                                                })
                                            })
                                        } else {
                                            await PreferenceManager.getInstance().setPreference({
                                                theme: 'light',
                                                AutoSaveProfile: true,
                                                StartupPage: this.state.initialScreen
                                            })
                                            this.setState({ isSwitchOn: false }, () => {
                                                this.props.route.params.update(() => {
                                                    this.props.navigation.dispatch(CommonActions.reset({
                                                        index: 3,
                                                        routes: [
                                                            { name: 'Random' },
                                                            { name: 'Shuffle' },
                                                            { name: 'Profile' },
                                                            { name: 'Preference' },
                                                        ]
                                                    }))
                                                })
                                            })
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                        <Divider style={getStyle(COLOR.GRAY4, true, true)} />
                        <Row style={{ margin: 10, zIndex: 100 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={getStyle(COLOR.ITEM, false, true)}>Initial Screen</Text>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: 20 }}>

                                {
                                        /*
                                    }
                                    <Picker
                                        mode="dropdown"
                                        iosHeader="Select start screen"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerStyle={getStyle(COLOR.GRAY6, true, true)}
                                        itemStyle={getStyle(COLOR.BG, true, true)}
                                        itemTextStyle={getStyle(COLOR.ITEM, false, true)}
                                        textStyle={getStyle(COLOR.ITEM, false, true)}
                                        selectedValue={this.state.initialScreen}
                                        onValueChange={async (val) => {

                                            console.log(val)
                                            await PreferenceManager.getInstance().setPreference({
                                                theme: this.state.isSwitchOn ? 'dark' : 'light',
                                                AutoSaveProfile: true,
                                                StartupPage: val
                                            })

                                            this.setState({initialScreen: val}, ()=>{
                                                console.log(this.state.initialScreen)
                                                this.props.route.params.update(() => {
                                                this.props.navigation.dispatch(CommonActions.reset({
                                                    index: 3,
                                                    routes: [
                                                        { name: 'Random' },
                                                        { name: 'Shuffle' },
                                                        { name: 'Profile' },
                                                        { name: 'Preference' },
                                                    ]
                                                }))}
                                            )})
                                            
                                            
                                        }}
                                    >
                                        <Picker.Item label="Random" value="Random" />
                                        <Picker.Item label="Shuffle" value="Shuffle" />
                                        <Picker.Item label="Profile" value="Profile" />
                                        <Picker.Item label="Preference" value="Preference" />
                                    </Picker>
                                    */}
                                <Provider>
                                    <View>
                                        <Menu
                                            visible={this.state.visible}
                                            onDismiss={this._closeMenu}
                                            anchor={
                                                <Button
                                                    rounded
                                                    onPress={() => { this._openMenu() }}
                                                >
                                                    <Text>{this.state.initialScreen}</Text>
                                                </Button>
                                            }
                                            style={{ left: 0, top: 0 }}
                                        >
                                            <Menu.Item onPress={async () => {
                                                var val="Random"
                                                console.log(val)
                                                await PreferenceManager.getInstance().setPreference({
                                                    theme: this.state.isSwitchOn ? 'dark' : 'light',
                                                    AutoSaveProfile: true,
                                                    StartupPage: val
                                                })

                                                this.setState({ initialScreen: val }, () => {
                                                    console.log(this.state.initialScreen)
                                                    this.props.route.params.update(() => {
                                                        this.props.navigation.dispatch(CommonActions.reset({
                                                            index: 3,
                                                            routes: [
                                                                { name: 'Random' },
                                                                { name: 'Shuffle' },
                                                                { name: 'Profile' },
                                                                { name: 'Preference' },
                                                            ]
                                                        }))
                                                    }
                                                    )
                                                })
                                            }} title="Random" />
                                            <Menu.Item onPress={async () => {
                                                var val="Shuffle"
                                                console.log(val)
                                                await PreferenceManager.getInstance().setPreference({
                                                    theme: this.state.isSwitchOn ? 'dark' : 'light',
                                                    AutoSaveProfile: true,
                                                    StartupPage: val
                                                })

                                                this.setState({ initialScreen: val }, () => {
                                                    console.log(this.state.initialScreen)
                                                    this.props.route.params.update(() => {
                                                        this.props.navigation.dispatch(CommonActions.reset({
                                                            index: 3,
                                                            routes: [
                                                                { name: 'Random' },
                                                                { name: 'Shuffle' },
                                                                { name: 'Profile' },
                                                                { name: 'Preference' },
                                                            ]
                                                        }))
                                                    }
                                                    )
                                                })
                                            }} title="Shuffle" />
                                            <Menu.Item onPress={async () => {
                                                var val="Profile"
                                                console.log(val)
                                                await PreferenceManager.getInstance().setPreference({
                                                    theme: this.state.isSwitchOn ? 'dark' : 'light',
                                                    AutoSaveProfile: true,
                                                    StartupPage: val
                                                })

                                                this.setState({ initialScreen: val }, () => {
                                                    console.log(this.state.initialScreen)
                                                    this.props.route.params.update(() => {
                                                        this.props.navigation.dispatch(CommonActions.reset({
                                                            index: 3,
                                                            routes: [
                                                                { name: 'Random' },
                                                                { name: 'Shuffle' },
                                                                { name: 'Profile' },
                                                                { name: 'Preference' },
                                                            ]
                                                        }))
                                                    }
                                                    )
                                                })
                                            }} title="Profile" />
                                             <Menu.Item onPress={async () => {
                                                 var val='Preference'
                                                console.log(val)
                                                await PreferenceManager.getInstance().setPreference({
                                                    theme: this.state.isSwitchOn ? 'dark' : 'light',
                                                    AutoSaveProfile: true,
                                                    StartupPage: val
                                                })

                                                this.setState({ initialScreen: val }, () => {
                                                    console.log(this.state.initialScreen)
                                                    this.props.route.params.update(() => {
                                                        this.props.navigation.dispatch(CommonActions.reset({
                                                            index: 3,
                                                            routes: [
                                                                { name: 'Random' },
                                                                { name: 'Shuffle' },
                                                                { name: 'Profile' },
                                                                { name: 'Preference' },
                                                            ]
                                                        }))
                                                    }
                                                    )
                                                })
                                            }} title="Preference" />

                                        </Menu>
                                    </View>
                                </Provider>

                            </Col>
                        </Row>
                        <Divider style={getStyle(COLOR.GRAY4, true, true)} />
                        <Row style={{ margin: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={getStyle(COLOR.ITEM, false, true)}>Factory Reset</Text>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: 20 }}>
                                <Button
                                    style={getStyle(COLOR.RED, true, true)}
                                    onPress={() => {
                                        Alert.alert(
                                            'Confirm Reset',
                                            'All profiles and theme setted will be reset',
                                            [
                                                {
                                                    text: 'Reset', onPress: async () => {
                                                        try {
                                                            await AsyncStorage.multiRemove(['Preference', 'Profile'], async (err) => {
                                                                if (err) {
                                                                    alert('Internal Error')
                                                                } else {
                                                                    await ProfileManager.getInstance().resetProfiles()
                                                                    await ProfileManager.getInstance().saveProfiles()
                                                                    await PreferenceManager.getInstance().resetPreference()
                                                                    await PreferenceManager.getInstance().savePreference()
                                                                    this.props.route.params.update(() => {
                                                                        this.props.navigation.dispatch(CommonActions.reset({
                                                                            index: 3,
                                                                            routes: [
                                                                                { name: 'Random' },
                                                                                { name: 'Shuffle' },
                                                                                { name: 'Profile' },
                                                                                { name: 'Preference' },
                                                                            ]
                                                                        }))
                                                                    })
                                                                }
                                                            })
                                                        } catch (e) {

                                                        }
                                                        //alert('resetted')

                                                    }
                                                },
                                                { text: 'Cancel', style: 'cancel', onPress: () => { } }
                                            ],
                                            { cancelable: false }
                                        )
                                    }}
                                >
                                    <Text>RESET</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Divider style={getStyle(COLOR.GRAY4, true, true)} />
                        <Row style={{ margin: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={getStyle(COLOR.ITEM, false, true)}>Help & Support</Text>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: 20 }}>
                                <Button
                                    style={getStyle(COLOR.BLUE, true, true)}
                                    onPress={async () => {
                                        await Linking.openURL('https://github.com/DrEdwardPCB/REACTNATIVE-kisled-decision');
                                    }}
                                >
                                    <Text>GO</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Divider style={getStyle(COLOR.GRAY4, true, true)} />
                        <Row style={{ margin: 10 }}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Text style={getStyle(COLOR.ITEM, false, true)}>Privacy Statement</Text>
                            </Col>
                            <Col style={{ alignItems: 'flex-end', justifyContent: 'center', marginRight: 20 }}>
                                <Button
                                    style={getStyle(COLOR.BLUE, true, true)}
                                    onPress={async () => {
                                        await Linking.openURL('http://ekhome.life/Apps/kisled-decision_privacy_policy/privacy.html');
                                    }}
                                >
                                    <Text>GO</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container >
        )
    }
} 