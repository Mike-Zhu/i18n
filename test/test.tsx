import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import TopModal from './TopModal';

const { Header } = Layout;

export default class MainSider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalTips: false,
      showTopModal: false,
      inputValue: '中文',
    };
  }

  onCreate = () => {
    const { env } = this.props.state;
    const domain = {
      fat: 'http://membersint.members.fat47.qa.nt.ctripcorp.com',
      uat: 'http://membersint.members.uat.qa.nt.ctripcorp.com',
      prod: 'http://membersint.members.ctripcorp.com',
    };
    const baseUrl = domain[env];
    const isValid = /^\d+$/.test(this.state.inputValue);
    if (isValid) {
      window.location = `${baseUrl}/modulejump/tNetv.aspx?module=${
        this.state.inputValue
      }`;
    }
  };

  onCancel = () => {
    this.setState({
      showTopModal: false,
    });
  };

  onUpdate = (event) => {
    const currentValue = event.target.value;
    this.setState({ inputValue: currentValue });
    const isValid = /^\d+$/.test(currentValue);
    if (isValid) {
      this.setState({ showModalTips: false });
    } else {
      this.setState({ showModalTips: true });
    }
  };

  toggleModal = () => {
    const show = this.state.showTopModal;
    this.setState({ showTopModal: !show });
  };

  render() {
    return (
      <div style={{ height: '70px', flexShrink: '0' }}>
        <Header id="mainheader" className="mainheader">
          <div className="mainheader-left">
            <img
              alt={"中文alt"}
              src={`${
                this.props.state.publicPath
              }/pages/shared/images/user_icon.png`}
              className="mainheader-left-img"
            />
            <div className="mainheader-left-text">
              <div className="mainheader-left-texttop">
                {this.props.userInfo.name}
              </div>
              <div className="mainheader-left-textbottom">
                {this.props.userInfo.Eid
                  ? `我似中文ID: ${this.props.userInfo.Eid}`
                  : ''}
              </div>
            </div>
          </div>
          <div className="mainheader-right">
            <Button
              className="mainheader-right-btn"
              onClick={this.props.onClickSignOut}
            >
              退出系统
            </Button>
            <Button
              className="mainheader-right-btn"
              type="primary"
              onClick={this.toggleModal}
            >
              快速切换
            </Button>
          </div>
        </Header>
        <TopModal
          showTopModal={this.state.showTopModal}
          showModalTips={this.state.showModalTips}
          onCreate={this.onCreate}
          onCancel={this.onCancel}
          onUpdate={this.onUpdate}
        />
      </div>
    );
  }
}
