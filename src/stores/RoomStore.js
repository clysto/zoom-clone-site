import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import { TrackModeSession, deviceManager } from 'pili-rtc-web';
import { getCurrentUser, getRoomAndToken } from '../api';

export default class RoomStore {
  allTracks = {};
  localTracks = {};
  roomName = '';
  roomSession = new TrackModeSession();
  cameraOn = true;
  micOn = true;
  users = {};
  messages = [];
  screenTrack = null;

  constructor() {
    makeObservable(this, {
      allTracks: observable.deep,
      localTracks: observable.deep,
      screenTrack: observable,
      roomName: observable,
      messages: observable,
      joinRoom: action.bound,
      subscribeOthersTracks: action.bound,
      muteLocalTrack: action,
      allVidTracks: computed,
      allMicTracks: computed,
      addTrack: action.bound,
      removeTrack: action.bound,
      leaveRoom: action.bound,
      cameraOn: observable,
      micOn: observable,
      joinUser: action.bound,
      leaveUser: action.bound,
      addMesssage: action.bound,
      users: observable,
      toggleScreenShare: action.bound,
    });
  }

  async init() {
    await this.initLocalTracks();
    await this.subscribeOthersTracks();
    this.roomSession.on('track-add', this.addTrack);
    this.roomSession.on('user-join', this.joinUser);
    this.roomSession.on('user-leave', this.leaveUser);
    this.roomSession.on('messages-received', this.addMesssage);
    // 获取初始用户列表
    this.roomSession.users.forEach((user) => {
      this.joinUser(user);
    });
  }

  async joinRoom(roomId) {
    const currentUser = await getCurrentUser();
    const roomInfo = await getRoomAndToken(roomId);
    if (roomInfo === null) {
      throw new Error('房间不存在');
    }
    if (!roomInfo.token) {
      throw new Error('会议已结束');
    }
    await this.roomSession.joinRoomWithToken(
      roomInfo.token,
      currentUser.username
    );
    runInAction(() => {
      const userId = this.roomSession.userId;
      this.roomName = roomInfo.subject;
      this.users[userId] = currentUser.username;
    });
  }

  joinUser(user) {
    this.users[user.userId] = user.userData;
  }

  leaveUser(user) {
    delete this.users[user.userId];
  }

  async leaveRoom() {
    Object.values(this.localTracks).forEach((track) => {
      track.release();
    });
    if (this.screenTrack) {
      this.screenTrack.release();
    }
    this.roomSession.leaveRoom();
  }

  async subscribeOthersTracks() {
    const subscribedTracks = await this.roomSession.subscribe(
      this.roomSession.trackInfoList
        .filter(
          (trackInfo) =>
            trackInfo.tag === 'camera' ||
            trackInfo.tag === 'audio' ||
            trackInfo.tag === 'screen'
        )
        .map((trackInfo) => trackInfo.trackId)
    );

    // 订阅其他用户的track
    subscribedTracks.forEach((track) => {
      this.addUserTrack(track);
    });
  }

  async initLocalTracks() {
    // 获取本地track
    const localTracks = await deviceManager.getLocalTracks({
      video: { enabled: true, width: 1280, height: 720, tag: 'camera' },
      audio: { enabled: true, tag: 'audio' },
    });
    await this.roomSession.publish(localTracks);
    localTracks.forEach((track) => {
      this.localTracks[track.info.trackId] = track;
    });
  }

  async toggleScreenShare() {
    if (!this.screenTrack) {
      try {
        const localTracks = await deviceManager.getLocalTracks({
          screen: { enabled: true, tag: 'screen' },
        });
        await this.roomSession.publish(localTracks);
        runInAction(() => {
          this.screenTrack = localTracks[0];
          this.screenTrack.once(
            'ended',
            action(() => {
              this.roomSession.unpublish([this.screenTrack.info.trackId]);
              this.screenTrack.release();
              this.screenTrack = null;
            })
          );
        });
      } catch (_) {
        throw new Error('您的浏览器不支持屏幕共享');
      }
    } else {
      this.roomSession.unpublish([this.screenTrack.info.trackId]);
      this.screenTrack.release();
      this.screenTrack = null;
    }
  }

  addMesssage(msgDatas) {
    msgDatas.forEach((msgData) => {
      msgData.username = this.users[msgData.userId];
      msgData.me = msgData.userId === this.roomSession.userId;
      this.messages.push(msgData);
    });
  }

  addUserTrack(track) {
    track.once(
      'release',
      action(() => {
        delete this.allTracks[track.info.trackId];
      })
    );
    this.allTracks[track.info.trackId] = track;
  }

  async addTrack(trackInfoList) {
    // 订阅新的tracks
    const subscribedTracks = await this.roomSession.subscribe(
      trackInfoList
        .filter(
          (trackInfo) =>
            trackInfo.tag === 'camera' ||
            trackInfo.tag === 'audio' ||
            trackInfo.tag === 'screen'
        )
        .map((trackInfo) => trackInfo.trackId)
    );
    // 追加进allTracks
    subscribedTracks.forEach((track) => {
      this.addUserTrack(track);
    });
  }

  async removeTrack(trackInfoList) {
    trackInfoList.forEach((info) => {
      delete this.allTracks[info.trackId];
    });
  }

  muteLocalTrack(tag) {
    for (const track of Object.values(this.localTracks)) {
      if (track.info.tag === tag) {
        this.roomSession.muteTracks([
          { trackId: track.info.trackId, muted: !track.info.muted },
        ]);
        if (tag === 'camera') {
          this.cameraOn = !track.info.muted;
        } else if (tag === 'audio') {
          this.micOn = !track.info.muted;
        }
      }
    }
  }

  sendMessage(msg) {
    this.roomSession.sendCustomMessage(msg);
    this.addMesssage([
      {
        data: msg,
        userId: this.roomSession.userId,
        type: 'normal',
        timestamp: Date.now(),
      },
    ]);
  }

  get allVidTracks() {
    return (this.screenTrack
      ? [
          this.screenTrack,
          ...Object.values(this.localTracks),
          ...Object.values(this.allTracks),
        ]
      : [...Object.values(this.localTracks), ...Object.values(this.allTracks)]
    ).filter(
      (track) => track.info.tag === 'camera' || track.info.tag === 'screen'
    );
  }

  get allMicTracks() {
    return [...Object.values(this.allTracks)].filter(
      (track) => track.info.tag === 'audio'
    );
  }
}
