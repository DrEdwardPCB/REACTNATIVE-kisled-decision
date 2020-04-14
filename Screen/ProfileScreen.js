import React from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label } from 'native-base';
import {Icon} from '../Manager/IconManager'
import { ScrollView, Flatlist } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
import { Divider, RadioButton } from 'react-native-paper'
import ProfileManager from '../Manager/ProfileManager';
import { Dimensions, View, TouchableOpacity } from 'react-native'
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist'
import {  CommonActions } from '@react-navigation/native';
import Modal, {
   
    ModalContent,
} from 'react-native-modals';
import uuid from 'react-native-uuid'



const width = Dimensions.get('window').width
const height = Dimensions.get('window').height



export default class ProfileScreen extends React.Component {
    constructor() {
        super()
        //console.log(BannerAdSize)
        var entries = ProfileManager.getInstance().getProfilesObject().filter(e => e.id != -1)
        this.state = {
            data: entries,
            showModal: false,
            edit: false,
            height: 700,
            newItem: {
                id: uuid.v4(),
                type: 'default',
                name: '',
                min: '1',
                max: '100',
                class: [{ displayname: 'A', weight: '1' }]
            },
            pressConfirm: false,
            scrollviewHeight: height * 0.8
        }
    }
    addEntry = async (callback) => {
        var reallyNewItem = {
            id: this.state.newItem.id,
            type: this.state.newItem.type,
            name: this.state.newItem.name,
        }
        if (this.state.newItem.type == 'default') {
            reallyNewItem.min = parseInt(this.state.newItem.min)
            reallyNewItem.max = parseInt(this.state.newItem.max)
        } else {
            var temp = JSON.parse(JSON.stringify(this.state.newItem.class))
            var temp1 = temp.map(e => {
                if (isNaN(parseFloat(e.weight))) {
                    e.weight = 1
                } else {
                    e.weight = parseFloat(e.weight)
                }
                return e
            })
            reallyNewItem.class=temp1
        }
        var newEntries = this.state.data.map(e => { return e })
        newEntries.push(reallyNewItem)
        await ProfileManager.getInstance().setProfiles(newEntries)
        callback()
    }
    shouldComponentUpdate(props, state) {
        if (JSON.stringify(this.state.data) === JSON.stringify(state.data) &&
            this.state.showModal == state.showModal &&
            this.state.edit == state.edit &&
            this.state.scrollviewHeight == state.scrollviewHeight &&
            JSON.stringify(this.state.newItem) === JSON.stringify(state.newItem) &&
            this.state.height == state.height &&
            this.state.pressConfirm == state.pressConfirm
        ) { return false } else { return true }
    }
    componentDidMount() {
        console.log(this.props.route)
        if (this.props.route.params != undefined) {
            console.log(this.props.route.params)
            if (this.props.route.params.showModal) {
                this.setState({ showModal: true })
                //this.props.navigation.navigate("Add")
            }
        }
    }
    deleteItem = async (index) => {
        var newEntries = this.state.data.filter((e, i) => { return i !== index })
        //newEntries.push(reallyNewItem)
        await ProfileManager.getInstance().setProfiles(newEntries)
        var entries = await ProfileManager.getInstance().getProfilesObject().filter(e => e.id != -1)
        this.setState({ data: entries })
    }

    renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
            <TouchableOpacity
                onLongPress={move}
                onPressOut={moveEnd}>
                <Grid style={[getStyle(COLOR.GRAY6, true, true), getStyle(COLOR.SHADOW, true, true), { margin: 10 }]}>
                    <Row style={{ height: 70, paddingVertical: 10 }}>
                        <Col size={1} style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <RenderDeleteOrNumber deletefnc={this.deleteItem} edit={this.state.edit} index={index} length={this.state.data.length}/>
                        </Col>
                        <Col size={2} style={{ padding: 5, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: getStyle(COLOR.GRAY5, false, true).color, borderRightWidth: 1 }}>
                            <Title style={getStyle(COLOR.ITEM, true, true)}>{item.name}</Title>
                        </Col>
                        <Col size={2}>
                            <Row>
                                <Col style={{ padding: 5, justifyContent: "center", alignItems: 'center' }}>
                                    <Text style={getStyle(COLOR.ITEM, true, true)}>{item.type}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Grid>
            </TouchableOpacity>
        )
    }
    updateNewProfile = (haha) => {
        this.setState({ newItem: haha })
    }
    render() {
        return (
            <Container>
                <Header style={[getStyle(COLOR.GRAY6, true, true), {
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0, elevation: 0
                }, { borderBottomWidth: 0 }]}>
                    <Left>
                        <Button
                            transparent
                            onPress={() => { this.setState({ edit: !this.state.edit }) }}
                        >
                            <Text>{this.state.edit ? "Done" : "Edit"}</Text>
                        </Button>
                    </Left>
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Profile</Title></Body>
                    <Right>
                        <Button
                            transparent
                            disabled={this.state.edit}
                            onPress={
                                () => { this.setState({ showModal: true }) }
                            }
                        >
                            <Icon type='MaterialCommunityIcons' name='plus' color='#007bff' size={24} />
                        </Button>
                    </Right>
                </Header>
                <Content style={[getStyle(COLOR.BG, true, true)]} scrollEnabled={false} onLayout={(e) => { this.setState({ height: e.nativeEvent.layout.height }) }}>
                    <DraggableFlatList
                        ListHeaderComponent={() => {
                            return (
                                <Grid style={[getStyle(COLOR.GRAY6, true, true), getStyle(COLOR.SHADOW, true, true), { margin: 10 }]}>
                                    <Row style={{ height: 40, paddingVertical: 10 }}>
                                        <Col size={1} style={{ padding: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={getStyle(COLOR.GRAY2, false, true)}>{this.state.edit?'delete':'index'}</Text>
                                        </Col>
                                        <Col size={2} style={{ padding: 0, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: getStyle(COLOR.GRAY5, false, true).color, borderRightWidth: 1 }}>
                                            <Text style={getStyle(COLOR.GRAY2, false, true)}>name</Text>
                                        </Col>
                                        <Col size={2}>
                                            <Row>
                                                <Col style={{ padding: 0, justifyContent: "center", alignItems: 'center' }}>
                                                    <Text style={getStyle(COLOR.GRAY2, false, true)}>type</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Grid>
                            )
                        }}
                        extraData={this.state}
                        style={{ height: this.state.height, marginTop: 15 }}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        scrollPercent={5}
                        onMoveEnd={({ data }) => this.setState({ data }, async () => {
                            await ProfileManager.getInstance().setProfiles(this.state.data)
                        })}
                    />
                </Content>
                <Modal.BottomModal
                    visible={this.state.showModal}
                    avoidKeyboard={true}
                    scrollOffset={1}
                    height={0.8}
                    width={1}
                    onDismiss={() => {
                        if (this.state.pressConfirm) {
                            this.addEntry(() => {
                                this.props.navigation.dispatch(CommonActions.reset({
                                    index: 2,
                                    routes: [
                                        { name: 'Random' },
                                        { name: 'Shuffle' },
                                        { name: 'Profile' },
                                        { name: 'Preference' },
                                    ]
                                }))
                            })
                        } else {
                            this.props.navigation.dispatch(CommonActions.reset({
                                index: 2,
                                routes: [
                                    { name: 'Random' },
                                    { name: 'Shuffle' },
                                    { name: 'Profile' },
                                    { name: 'Preference' },
                                ]
                            }))
                        }

                    }}
                >
                    <ModalContent

                        style={[, getStyle(COLOR.BG, true, true), {
                            flex: 1,
                            padding: 0
                        }]}
                    >
                        <View style={[
                            { width: '100%', height: 60, flexDirection: 'row', justifyContent: 'center' }]}>
                            <View style={{ flex: 1, alignContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Button
                                    danger
                                    style={{ maxWidth: 100, width: 100, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                                    onPress={() => { this.setState({ showModal: false, pressConfirm: false }) }}
                                >
                                    <Text>Cancel</Text>
                                </Button>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}><Title style={[getStyle(COLOR.ITEM, true, true)]}>Add Profile</Title></View>
                            <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-end' }}>
                                <Button
                                    primary
                                    style={{ maxWidth: 100, width: 100, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}
                                    onPress={
                                        () => { this.setState({ showModal: false, pressConfirm: true }) }
                                    }
                                >
                                    <Text>Add</Text>
                                </Button>
                            </View>
                        </View>
                        <Divider style={getStyle(COLOR.GRAY4, true, true), { margin: 5 }} />
                        <ScrollView style={{ height: height * .8 - 60 - 10 }} contentContainerStyle={{ height: this.state.scrollviewHeight }}>
                            <Form>
                                <Text style={[getStyle(COLOR.ITEM, false, true), { margin: 10, marginTop: 20 }]}>Name:</Text>
                                <Item rounded style={{ padding: 10 }}>
                                    <Input
                                        style={getStyle(COLOR.ITEM, false, true)}
                                        value={this.state.newItem.name}
                                        onChangeText={text => {
                                            var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                            copy.name = text;
                                            this.setState({ newItem: copy })
                                        }}
                                    />
                                </Item>
                                <Text style={[getStyle(COLOR.ITEM, false, true), { margin: 10, marginTop: 20 }]}>Type:</Text>
                                <Item rounded style={[{ padding: 10 }, getStyle(COLOR.GRAY6, true, true)]} >
                                    <RadioButton.Group
                                        value={this.state.newItem.type}
                                        onValueChange={value => {
                                            var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                            copy.type = value;
                                            this.setState({ newItem: copy })
                                        }}
                                    >
                                        <RadioButton.Item label="Default" value="default" />
                                        <RadioButton.Item label="Classes" value="class" />
                                    </RadioButton.Group>
                                </Item>
                                {this.renderTypeSpecific()
                                }
                            </Form>
                        </ScrollView>
                    </ModalContent>
                </Modal.BottomModal>
            </Container>
        )
    }
    renderTypeSpecific = () => {
        if (this.state.newItem.type == "default") {
            this.setState({ scrollviewHeight: height * 0.8 })
            return (
                <View>
                    <Text style={[getStyle(COLOR.ITEM, false, true), { margin: 10, marginTop: 20 }]}>Max:</Text>
                    <Item rounded style={{ padding: 10 }}>
                        <Input
                            style={getStyle(COLOR.ITEM, false, true)}
                            value={this.state.newItem.max}
                            onChangeText={text => {
                                var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                copy.max = text;
                                this.setState({ newItem: copy })
                            }}
                        />
                    </Item>
                    <Text style={[getStyle(COLOR.ITEM, false, true), { margin: 10, marginTop: 20 }]}>Min:</Text>
                    <Item rounded style={{ padding: 10 }}>
                        <Input
                            style={getStyle(COLOR.ITEM, false, true)}
                            value={this.state.newItem.min}
                            onChangeText={text => {
                                var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                copy.min = text;
                                this.setState({ newItem: copy })
                            }}
                        />
                    </Item>
                </View>
            )
        } else {
            var lsit = []
            this.setState({ scrollviewHeight: height * 0.8 + this.state.newItem.class.length * 60 })
            for (var i = 0; i < this.state.newItem.class.length; i++) {
                lsit.push(
                    <NewClass newItem={this.state.newItem} update={this.updateNewProfile} index={i} />
                )
            }
            lsit.push(
                <View>
                    <Col style={{ alignContent: 'flex-end' }}>
                        <Button
                            style={{ width: 150, justifyContent: 'center', margin: 10 }}
                            onPress={() => {
                                var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                copy.class.push({ displayname: 'A', weight: '1' })
                                this.setState({ newItem: copy })
                            }}>
                            <Text>Add class</Text>
                        </Button>
                    </Col>
                </View>
            )
            return (
                
                <Grid style={{ minHeight: this.state.newItem.class.length * 60, flex: 1, flexDirection: 'column' }} >
                    {lsit}
                </Grid>
                
            )
        }
    }

}
class NewClass extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newItem: props.newItem,
            index: props.index
        }
    }
    static getDerivedStateFromProps(props,state){
        return {
            newItem: props.newItem,
            index: props.index
        }
    }
    render() {
        return (
            <Row style={{ margin: 10, marginBottom: 0, padding: 0, maxHeight: 55 }} >

                <Col size={2} style={{ paddingRight: 20 }}>
                    <Form>
                    <Item style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, padding: 10, width: '100%', height: 55, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }]}>

                        <Label style={getStyle(COLOR.GRAY, false, true)}>class: </Label>
                        <Input style={getStyle(COLOR.ITEM, true, true)}
                            
                            value={this.state.newItem.class[this.props.index].displayname}
                            //editable={false}
                            onChangeText={(val) => {
                                var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                copy.class[this.props.index].displayname = val;
                                this.props.update(copy)
                                this.setState({newItem:copy})
                            
                                
                            }}
                            returnKeyType='done'
                        />
                        
                    </Item>
                    </Form>
                </Col>
                <Col size={1} style={{ padding: 0 }}>
                    <Form>
                    <Item rounded style={[{ borderColor: getStyle(COLOR.GRAY4, false, true).color, margin: 10, padding: 10, width: '100%', height: 55, marginBottom: 0, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }]}>

                        <Label style={getStyle(COLOR.GRAY, false, true)}>w: </Label>
                        <Input style={getStyle(COLOR.ITEM, true, true)}
                            value={this.state.newItem.class[this.props.index].weight}
                            onChangeText={(val) => {
                                var copy = JSON.parse(JSON.stringify(this.state.newItem))
                                copy.class[this.props.index].weight = val;
                                this.props.update(copy)
                                this.setState({newItem:copy})
                            }}
                            returnKeyType='done'
                        />
                    </Item>
                    </Form>
                </Col>
            </Row>
        )
    }
}
class RenderDeleteOrNumber extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: props.edit,
            index: props.index,
            length: props.length
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { edit: props.edit, index: props.index, length:props.length }
    }
    render() {
        if (this.state.edit&&this.state.length>1) {
            return (
                <Button
                    rounded
                    small
                    style={[getStyle(COLOR.RED, true, true),]}
                    onPress={() => {
                        this.props.deletefnc(this.props.index)
                    }}
                >
                    <Text>-</Text>
                </Button>
            )
        } else {
            return (
                <Title style={getStyle(COLOR.ITEM, true, true)}>{(this.props.index + 1) + "."}</Title>
            )
        }
    }
}
