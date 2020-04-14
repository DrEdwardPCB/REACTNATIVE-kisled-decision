import React from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label } from 'native-base';
import {Icon} from '../Manager/IconManager'
import { ScrollView, Flatlist } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
import PreferenceManager from '../Manager/PreferenceManager'
import { InterstitialAd, RewardedAd, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';
import { Dimensions, View } from 'react-native'
import { Divider } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import ProfileManager from '../Manager/ProfileManager';
import { useNavigation, CommonActions } from '@react-navigation/native';
import uuid from 'react-native-uuid'
import adid from '../Confidential/key'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class RandomScreen extends React.Component {
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
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Random</Title></Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={[getStyle(COLOR.BG, true, true)]} scrollEnabled={false}>
                    <BannerAd unitId={
                        //TestIds.BANNER
                        adid
                    } size={BannerAdSize.SMART_BANNER} />
                    <RandomArea style={{ marginTop: 90 }} />
                </Content>
            </Container>
        )
    }
}
class RandomArea extends React.Component {
    constructor() {
        super()
        this.state = {
            profile: ProfileManager.getInstance().getProfilesObject()[0],
            value: 0
        }
    }
    componentDidMount() {

        this.generateRandom()
    }
    /**
     * {type:"default",min:1,max:100,}
     * {type:"class",name:"xxx" class:[{displayname:"xxx",weight:number},...]}
     */
    changeProfile = (newProfile) => {
        this.setState({ profile: newProfile })
    }
    generateRandom = () => {
        console.log(this.state.profile)
        if (this.state.profile.type == "default") {
            var val = Math.round(Math.random() * (this.state.profile.max - this.state.profile.min) + this.state.profile.min)
            console.log(val)
            //console.log("hehe")
            this.setState({ value: val })
        }
        else {
            console.log("======================")
            console.log(this.state.profile.class)
            console.log("======================")
            var classificationArray = this.state.profile.class.map((e) => { return e.displayname })
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%")
            console.log(classificationArray)
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%")
            var weightArray = []
            var sum = 0;
            for (var i = 0; i < this.state.profile.class.length; i++) {
                sum += this.state.profile.class[i].weight
                weightArray.push(sum)
            }
            console.log("@@@@@@@@@@@@@@@@@@@@@@@")
            console.log(weightArray)
            console.log("@@@@@@@@@@@@@@@@@@@@@@@")
            var rand = Math.random() * sum
            for (var i = 0; i < weightArray.length; i++) {
                if (rand < weightArray[i]) {
                    this.setState({ value: classificationArray[i] })
                    break;

                }
            }
        }
    }

    render() {
        return (
            <Grid style={{ height: height * 0.75 }}>
                <Row size={3}>
                    <RandomDisplay profile={this.state.profile} value={this.state.value} />
                </Row>
                <Row size={1} style={{ padding: 5 }}>
                    <Col style={{ justifyContent: 'center' }}>
                        <Button rounded style={[getStyle(COLOR.BLUE, true, true), { color: 'white', position: 'absolute', height: '100%', aspectRatio: 1, alignSelf: 'center', zIndex: 10, justifyContent: 'center', alignItems: 'center' }]}
                            onPress={() => {
                                this.setState({ value: " " }, () => {
                                    setTimeout(() => { this.generateRandom() }, 100)
                                })
                            }}
                        ><Icon type="FontAwesome5" name="dice" color='white' size={24} /></Button>
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
class RandomDisplay extends React.Component {
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
        console.log(val+"%^&*(")
        return { value: val }
    }

    render() {
        return (
            <Col style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={[{ borderWidth: 1, aspectRatio: 1, borderColor: getStyle(COLOR.GRAY, false, true).color, borderRadius: 10, height: height * 0.3, justifyContent: 'center' }, getStyle(COLOR.GRAY6, true, true)]}>
                    <CardItem style={[getStyle(COLOR.GRAY6, true, true), { alignContent: 'center', justifyContent: "center" }]}>
                        <Text style={[getStyle(COLOR.GRAY, false, true), { fontSize: isNaN(this.state.value)?30:100, textAlign: 'center' }, getStyle(COLOR.GRAY6, true, true)]}>{this.state.value}</Text>
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
        try{
            if (item.type == "default") {
                return (
                    <DefaultItem item={item} />
                )
            } else if (item.type=='class') {
                return <ClassItem item={item} />
            }
            else if (item.type == "newItem") {
                return (
                    <NewItem />
                )
            }
        }catch(err){
            return <View/>
        }
        
    }

    render() {
        return (
            <View onLayout={(e) => {
                this.setState({
                    height: e.nativeEvent.layout.height
                }, () => {
                    console.log("height: " + this.state.height)
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
class DefaultItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            min: props.item.min,
            max: props.item.max,
            minS: props.item.min.toString(),
            maxS: props.item.max.toString()
        }
    }
    static getDerivedStateFromProps(props, state) {
        console.log(props.item)
        return {
            min: props.item.min,
            max: props.item.max
        }
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
                        <ScrollView style={{ width: '100%', }} contentContainerStyle={{ alignContent: 'center', alignItems: 'center' }}>
                            <Form style={{ width: '90%', alignContent: 'center', alignItems: 'center', marginLeft: 20, marginRight: 10 }}>
                                <Item rounded style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, margin: 10, padding: 10, width: '100%', height: 55, marginBottom: 0 }]}>
                                    <Label style={getStyle(COLOR.GRAY, false, true)}>min: </Label>
                                    <Input style={getStyle(COLOR.ITEM, true, true)} value={this.state.minS} onChangeText={(val) => { this.setState({ minS: val }) }}
                                        onBlur={() => {
                                            if (isNaN(parseInt(this.state.minS))) {
                                                this.setState({ minS: this.state.min.toString() })
                                            } else {
                                                if (parseInt(this.state.maxS) < parseInt(this.state.minS)) {
                                                    this.setState({ minS: this.state.min.toString() })
                                                } else {
                                                    this.setState({ min: parseInt(this.state.minS) }, () => {
                                                        console.log(this.state.minS)
                                                        var newP = { ...this.props.item }
                                                        newP.min = parseInt(this.state.minS)
                                                        console.log(newP)
                                                        this.props.item.update(newP)
                                                    })
                                                }
                                            }
                                        }}
                                        returnKeyType='done'
                                    />
                                </Item>
                                <Item rounded style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, margin: 10, padding: 10, width: '100%', height: 55 }]}>
                                    <Label style={getStyle(COLOR.GRAY, false, true)}>max: </Label>
                                    <Input style={getStyle(COLOR.ITEM, true, true)} value={this.state.maxS} onChangeText={(val) => { this.setState({ maxS: val }) }}
                                        onBlur={() => {
                                            if (isNaN(parseInt(this.state.maxS))) {
                                                this.setState({ maxS: this.state.max.toString() })
                                            } else {
                                                if (parseInt(this.state.maxS) < parseInt(this.state.minS)) {
                                                    this.setState({ maxS: this.state.max.toString() })
                                                } else {
                                                    this.setState({ max: parseInt(this.state.maxS) }, () => {
                                                        var newP = { ...this.props.item }
                                                        newP.max = parseInt(this.state.maxS)
                                                        console.log(newP)
                                                        this.props.item.update(newP)
                                                    })
                                                }
                                            }
                                        }}
                                        returnKeyType='done'
                                    />
                                </Item>
                            </Form>
                        </ScrollView>
                    </Col>
                </Row>
            </Grid>
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
                            /*onChangeText={(val) => {
                                const index=i
                                const id = this.state.class.id
                                var xd = this.state.class.map(e => {
                                    if (e.id == id) {
                                        e.dn = val
                                    }
                                    return e
                                })
                                this.setState({ class: xd }, ()=>{console.log("========"+this.state.class[index].dn)})
                            }}
                            onBlur={() => {
                                this.setState({ max: parseInt(this.state.maxS) }, () => {
                                    const index=i
                                    var newP = { ...this.props.item }
                                    newP.class=this.props.item.class.map((e,ind)=>{
                                        if(index==ind){
                                            e.displayname=this.state.class[ind].dn
                                        }
                                    })
                                    console.log(newP)
                                    this.props.item.update(newP)
                                })
                            }}
                            returnKeyType='done'*/
                            />
                        </Item>
                    </Col>
                    <Col size={1} style={{ padding: 0 }}>
                        <Item key={uuid.v4()} rounded style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, margin: 10, padding: 10, width: '100%', height: 55, marginBottom: 0, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }]}>

                            <Label style={getStyle(COLOR.GRAY, false, true)}>w: </Label>
                            <Input style={getStyle(COLOR.ITEM, true, true)} value={this.state.class[i].weightS} /*onChangeText={(val) => { this.setState({ maxS: val }) }}
                                onBlur={() => {
                                    if (isNaN(parseInt(this.state.maxS))) {
                                        this.setState({ maxS: this.state.max.toString() })
                                    } else {
                                        if (parseInt(this.state.maxS) < parseInt(this.state.minS)) {
                                            this.setState({ maxS: this.state.max.toString() })
                                        } else {
                                            this.setState({ max: parseInt(this.state.maxS) }, () => {
                                                var newP = { ...this.props.item }
                                                newP.max = parseInt(this.state.maxS)
                                                console.log(newP)
                                                this.props.item.update(newP)
                                            })
                                        }
                                    }
                                }}*/
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

