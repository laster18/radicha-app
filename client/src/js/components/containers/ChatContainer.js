import React from 'react';
import { connect } from 'react-redux';
import { compose, pure, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import Index from '../presentators/MainContents';
import { sendMessage, joinRoom, removeRoom } from '../../actions';

const enhancer = compose(
  connect(
    state => ({
      app: state.app,
      chatRoom: state.chatRoom,
    }),
    {
      sendMessage,
      joinRoom,
      removeRoom,
    },
  ),
  lifecycle({
    componentWillMount() {
      const { joinRoom, match, app } = this.props;
      if (app.username === null || app.username === '') {
        this.props.showLoginModal();
        this.props.history.push('/');
      } else {
        // 直接URLを叩かれたときの暫定的な対応、socketがsetされるまで待つ
        // @TODO: REFACTOR
        if (!app.socket) {
          setTimeout(() => {
            joinRoom(match.params.roomId);
          }, 2000);
        }
        joinRoom(match.params.roomId);
      }
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        const { joinRoom, match } = nextProps;
        joinRoom(match.params.roomId);
      }
    },
  }),
  pure,
);

const ChatContainer = enhancer(({ app, chatRoom, sendMessage, removeRoom }) => (
  <Index {...{ app, chatRoom, sendMessage, removeRoom }} />
));

export default withRouter(ChatContainer);
