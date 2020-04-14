import React from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label } from 'native-base';
import {Icon} from '../Manager/IconManager'
import { ScrollView, FlatList } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
import PreferenceManager from '../Manager/PreferenceManager'
import { InterstitialAd, RewardedAd, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';
import { Dimensions, View } from 'react-native'
import { Divider, TextInput } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import ProfileManager from '../Manager/ProfileManager';
import { useNavigation, CommonActions} from '@react-navigation/native';
import uuid from 'react-native-uuid'
import adid from '../Confidential/key'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const adUnitId = 'ca-app-pub-8656675425768497/2635507986';
export default class ShuffleScreen extends React.Component {
    constructor() {
        super()
        //console.log(BannerAdSize)
    }
    useEffect() {
        () => navigation.addListener('focus', () => { this.setState({ dummy: "" }) }), []
    }
    render() {
        return (
            <Container>
                <Header style={[getStyle(COLOR.GRAY6, true, true), {
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0, elevation: 0
                }, { borderBottomWidth: 0 }]}>
                    <Left />
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Shuffle</Title></Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={[getStyle(COLOR.BG, true, true)]} scrollEnabled={false}>
                    <BannerAd unitId={
                        //TestIds.BANNER
                        adid
                    } size={BannerAdSize.SMART_BANNER} />
                    <ShuffleArea style={{ marginTop: 90 }} />
                </Content>
            </Container>
        )
    }
}
class ShuffleArea extends React.Component {
    constructor() {
        super()
        this.state = {
            profile: ProfileManager.getInstance().getProfilesObject().filter(e => e.type === 'class')[0],
            value: [{ id: 'RTYUJ', displayname: 'xd' }],
            repeats: '10'
        }
    }
    componentDidMount() {

        this.generateShuffle()
    }
    /**
     * {type:"default",min:1,max:100,}
     * {type:"class",name:"xxx" class:[{displayname:"xxx",weight:number},...]}
     */
    changeProfile = (newProfile) => {
        this.setState({ profile: newProfile })
    }
    generateShuffle = (repeats, number) => {
        //console.log(this.state.profile)
        try{
            var localclass = JSON.parse(JSON.stringify(this.state.profile.class))
        shuffledArray = []
        if (!repeats) {
            var classificationArray = this.state.profile.class.map((e) => { return e.displayname })
            var realWeightArr = this.state.profile.class.map((e) => { return e.weight })
            var weightArray = []
            var sum = 0;
            for (var i = 0; i < realWeightArr.length; i++) {
                sum += realWeightArr[i]
                weightArray.push(sum)
            }

            for (var j = 0; j < this.state.profile.class.length; j++) {
                var rand = Math.random() * sum
                for (var i = 0; i < weightArray.length; i++) {
                    if (rand < weightArray[i]) {
                        shuffledArray.push({ id: uuid.v4(), displayname: classificationArray[i], index: j })
                        classificationArray = classificationArray.filter((e, index) => index != i)
                        realWeightArr = realWeightArr.filter((e, index) => index != i)
                        weightArray = []
                        for (var i = 0; i < realWeightArr.length; i++) {
                            sum += realWeightArr[i]
                            weightArray.push(sum)
                        }
                        break;

                    }
                }
            }

        }
        else {
            var classificationArray = this.state.profile.class.map((e) => { return e.displayname })
            var realWeightArr = this.state.profile.class.map((e) => { return e.weight })
            var weightArray = []
            var sum = 0;
            for (var i = 0; i < realWeightArr.length; i++) {
                sum += realWeightArr[i]
                weightArray.push(sum)
            }
            number = isNaN(number) ? 10 : parseInt(number)
            for (var j = 0; j < number; j++) {
                var rand = Math.random() * sum
                for (var i = 0; i < weightArray.length; i++) {
                    if (rand < weightArray[i]) {
                        shuffledArray.push({ id: uuid.v4(), displayname: classificationArray[i], index: j })
                        break;

                    }
                }
            }

        }
        this.setState({ value: shuffledArray })
        }catch(e){
            this.setState({ value: [{ id: uuid.v4(), displayname: 'No class profile' , index: 0 }] })
        }
        
    }

    render() {
        return (
            <Grid style={{ height: height * 0.75 }}>
                <Row size={3}>
                    <ShuffleDisplay profile={this.state.profile} value={this.state.value} />
                </Row>
                <Row size={1} style={{ padding: 5 }}>
                    <Col style={{ justifyContent: 'center' }}>
                        <View style={[getStyle(COLOR.BG, true, true), { position: 'absolute', height: '100%', aspectRatio: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', zIndex: 10, flexDirection: 'row' },]}>
                            <Button rounded style={[getStyle(COLOR.BLUE, true, true), { color: 'white', height: '100%', aspectRatio: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }]}
                                onPress={() => {
                                    this.setState({ value: " " }, () => {
                                        setTimeout(() => { this.generateShuffle(false) }, 100)
                                    })
                                }}
                            ><Icon type="Ionicons" name="ios-shuffle" color='white' size={24}/></Button>
                            <Form style={{ padding: 0 }}>
                                <Item rounded style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, minWidth: 100, height: '100%', flexDirection: 'row', marginLeft: 5, marginRight: 5, paddingHorizontal: 5 },getStyle(COLOR.BG,true,true)]}>
                                    <Label style={getStyle(COLOR.GRAY, false, true)}>#Rep</Label>
                                    <Input
                                        style={getStyle(COLOR.ITEM, true, true)}
                                        value={this.state.repeats}
                                        //editable={false}
                                        onChangeText={(val) => {
                                            this.setState({ repeats: val })
                                        }}
                                    />

                                </Item>
                            </Form>

                            <Button rounded style={[getStyle(COLOR.BLUE, true, true), { color: 'white', height: '100%', aspectRatio: 1, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }]}
                                onPress={() => {
                                    this.setState({ value: " " }, () => {
                                        setTimeout(() => { this.generateShuffle(true, this.state.repeats) }, 100)
                                    })
                                }}
                            ><Icon type="Ionicons" name="ios-repeat" color='white' size={24}/></Button>
                        </View>
                        <Divider style={getStyle(COLOR.GRAY4, true, true)} />
                    </Col>
                </Row>
                <Row size={3}>
                    <Col>
                        <ProfileSection changeProfile={this.changeProfile} />
                    </Col>
                </Row>
            </Grid>
        )
    }
}
class ShuffleDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value
        }
    }
    static getDerivedStateFromProps(props, state) {
        //props.value
        var val = props.value
        if (typeof value == "number") {
            val = val.toString()
        }
        //console.log(val + "%^&*(")
        return { value: val }
    }

    render() {
        return (
            <Col style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={[{ borderWidth: 1, width: '90%', borderColor: getStyle(COLOR.GRAY, false, true).color, borderRadius: 10, height: height * 0.3, justifyContent: 'center', paddingVertical:5 }, getStyle(COLOR.GRAY6, true, true)]}>
                    <CardItem style={[getStyle(COLOR.GRAY6, true, true), { alignContent: 'center', justifyContent: "center", height: '90%', width: '100%', flexDirection:'column' }]}>
                        <View style={[{ flex:1,maxHeight:40,height: 30, width: '100%', padding: 10, marginBottom: 10 }, getStyle(COLOR.GRAY5, true, true), { flexDirection: 'row' }]}>
                            <View style={{ flex: 1, borderRightWidth: 1, borderColor: getStyle(COLOR.GRAY4, false, true).color, alignContent: 'center', alignItems: 'center' }}>
                                <Text style={[getStyle(COLOR.GRAY2, false, true), { fontSize: 17 }]}>{'id'}</Text>
                            </View>
                            <View style={{ flex: 4, paddingHorizontal: 15 }}>
                                <Text style={[getStyle(COLOR.GRAY2, false, true), { fontSize: 17 }]}>{'Item name'}</Text>
                            </View>
                        </View>
                        <View style={{flex:5, width:'100%'}}>
                        <FlatList
                            style={{height: '100%', width: '100%', padding: 0 }}
                            contentContainerStyle={{ padding: 0 }}
                            data={this.state.value}
                            renderItem={({ item }) => {
                                return (
                                    <View style={[{ height: 50, width: '100%', padding: 10, marginVertical: 10 }, getStyle(COLOR.SHADOW, true, true), getStyle(COLOR.GRAY5, true, true), { flexDirection: 'row' }]}>
                                        <View style={{ flex: 1, borderRightWidth: 1, borderColor: getStyle(COLOR.GRAY4, false, true).color, alignContent: 'center', alignItems: 'center' }}>
                                            <Text style={[getStyle(COLOR.ITEM, false, true), { fontSize: 20 }]}>{item.index + 1}</Text>
                                        </View>
                                        <View style={{ flex: 4, paddingHorizontal: 15 }}>
                                            <Text style={[getStyle(COLOR.ITEM, false, true), { fontSize: 20 }]}>{item.displayname}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />
                        </View>
                    </CardItem>
                </Card>
            </Col>
        )
    }
}
class ProfileSection extends React.Component {
    constructor(props) {
        //console.log("++++++++++++++++++++++++++++++constructing")
        super(props)
        var entries = ProfileManager.getInstance().getProfilesObject()
        entries = entries.filter(e => { return e.type == "class" })
        //console.log(entries)
        if (entries.filter(e => { return e.id == -1 }).length == 0) {
            entries.push({ id: -1, type: "newItem" })
        }
        //console.log(entries)
        this.state = {
            entries: entries,
            height: 100,
            currentProfile: entries[0]
        }
    }
    componentDidMount() {
        var entries = ProfileManager.getInstance().getProfilesObject().map(e => { e.update = this.updateCurrentProfile; return e })
        entries = entries.filter(e => { return e.type == "class" })
        if (entries.filter(e => { return e.id == -1 }).length == 0) {
            entries.push({ id: -1, type: "newItem" })
        }
        //console.log(entries)
        this.setState({
            entries: entries,
        })
    }
    updateCurrentProfile = (profile) => {
        var entries = this.state.entries.map(e => {
            if (profile.id == e.id) {
                return profile
            } else {
                return e
            }
        })
        this.setState({
            entries: entries,
            currentProfile: profile
        }, () => {
            this.props.changeProfile(this.state.currentProfile)
            ProfileManager.getInstance().setProfiles(this.state.entries.filter(e => { return e.id !== -1 }))
        })
    }
    _renderItem = ({ item, index }) => {
        if (item.type == 'class') {
            return <ClassItem item={item} />
        }
        else if (item.type == "newItem") {
            return (
                <NewItem />
            )
        }
    }

    render() {
        return (
            <View onLayout={(e) => {
                this.setState({
                    height: e.nativeEvent.layout.height
                })
            }} style={[getStyle(COLOR.BG, true, true), { height: '100%', marginVertical: 10 }]}>
                <Carousel
                    contentContainerCustomStyle={{ height: this.state.height * 0.9 }}
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    sliderWidth={width}
                    itemWidth={width * 0.7}
                    itemHieght={this.state.height * 0.8}
                    onSnapToItem={(index) => {
                        if (this.state.entries[index].type !== 'newItem') {
                            this.setState({ currentProfile: this.state.entries[index] }, () => {
                                console.log(this.state.currentProfile)
                                this.props.changeProfile(this.state.currentProfile)
                            })
                        }
                    }}
                />
            </View>
        )
    }
}

class ClassItem extends React.Component {
    constructor(props) {
        super(props)
        var clas = props.item.class.map(e => {
            var haha = e
            haha.dn = e.displayname
            haha.weightS = e.weight.toString()
            haha.id = uuid.v4()
            return haha
        })
        this.state = {
            class: clas,
            ScrollViewHeight: clas.length * (55 + 10)
        }
    }
    static getDerivedStateFromProps(props, state) {
        console.log(props.item)
        var clas = props.item.class.map((e, i) => {
            var haha = e
            haha.dn = state.class[i].dn
            haha.weightS = state.class[i].weight.toString()
            return haha
        })
        return { class: clas, ScrollViewHeight: clas.length * (55 + 10) }
    }
    renderClasses = () => {
        var itemlist = [];
        for (var i = 0; i < this.state.class.length; i++) {
            itemlist.push(
                <Row key={this.state.class[i].id} style={{ margin: 10, marginBottom: 0, padding: 0, maxHeight: 55 }} >
                    <Col size={2} style={{ padding: 0 }}>
                        <Item key={uuid.v4()} style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, padding: 10, width: '100%', height: 55, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }]}>

                            <Label style={getStyle(COLOR.GRAY, false, true)}>class: </Label>
                            <Input style={getStyle(COLOR.ITEM, true, true)} value={this.state.class[i].dn}
                                editable={false}

                            />
                        </Item>
                    </Col>
                    <Col size={1} style={{ padding: 0 }}>
                        <Item key={uuid.v4()} rounded style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, margin: 10, padding: 10, width: '100%', height: 55, marginBottom: 0, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }]}>

                            <Label style={getStyle(COLOR.GRAY, false, true)}>w: </Label>
                            <Input style={getStyle(COLOR.ITEM, true, true)} value={this.state.class[i].weightS}
                                editable={false}
                                returnKeyType='done'
                            />
                        </Item>
                    </Col>
                </Row>

            )
        }
        return itemlist
    }
    render() {
        return (
            <Grid style={[getStyle(COLOR.SHADOW, true, true), getStyle(COLOR.BG, true, true), { borderColor: getStyle(COLOR.GRAY4, false, true).color, borderWidth: 1, }]}>
                <Row size={1}>
                    <Col style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={getStyle(COLOR.ITEM, false, true)}>{this.props.item.name}</Title>
                    </Col>
                </Row>
                <Row size={3} style={{ alignContent: 'center', alignItems: 'center' }}>
                    <Col style={{ alignContent: 'center', alignItems: 'center' }}>
                        <ScrollView style={{ width: '100%', }} contentContainerStyle={{ alignContent: 'center', alignItems: 'center', height: this.state.ScrollViewHeight }}>
                            <Grid style={{ width: '90%', alignContent: 'center', alignItems: 'center', marginLeft: 20, marginRight: 10, flexDirection: 'column' }}>
                                {this.renderClasses()}
                            </Grid>
                        </ScrollView>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

function NewItem(props) {
    const navigation = useNavigation();

    return <NewItemC {...props} navigation={navigation} />;
}
class NewItemC extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Grid style={[getStyle(COLOR.SHADOW, true, true), getStyle(COLOR.BG, true, true), { borderColor: getStyle(COLOR.GRAY4, false, true).color, borderWidth: 1, }]}>
                <Row>
                    <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            transparent
                            style={{ height: '40%' }}
                            onPress={() => {
                                this.props.navigation.dispatch(CommonActions.navigate({
                                    name: "Profile",
                                    params: {
                                        showModal: true,
                                    }
                                }))
                            }}
                        >
                            <Grid>
                                <Row>
                                    <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon type='AntDesign' name='plus' color='#007bff' size={24} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text>Add New Profile</Text>
                                    </Col>
                                </Row>
                            </Grid>
                        </Button>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

