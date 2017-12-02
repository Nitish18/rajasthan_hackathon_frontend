import React from 'react';
import styled from 'styled-components';
import { Loader } from 'react-loaders';
// config
import { API_URL } from './../../config';

const MenuContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 0;
  z-index: 1000;
  margin-left: 20px;
  zoom: 1.25;
  background-color: rgba(108,154,173,0);
  border-radius: 50%;
  height: 35px;
  width: 36px;
  line-height: 49px;
  .menu-button {
    border: 0;
    background-color: rgba(108,154,173,0);
    .material-icons {
      color: #fff;
      cursor: pointer;
    }
  }
  .overlay-container {
    background-color: rgba(108,154,173,0.6);
    width: 80vw;
    height: 72vh;
    position: absolute;
    top: 43px;
    left: -20px;
    .buttons-container {
      position: absolute;
      top: 0px;
      bottom: 0;
      right: 0;
      left: 0;
      width: 14vw;
      height: 20vh;
      margin: auto;
      .button {
        width: 100%;
        border: 0;
        padding: 5px 10px;
        cursor: pointer;
      }
    }
  }
`;
const Button = styled.div`
  background: none;
  color: #fff;
  font-family: 'roboto';
  font-size: 24px;
  width: 300px;
  cursor: pointer;
`;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      isTraining: false
    }
  }
  triggerPolling() {
    const year = 2016;
    const url = `${API_URL}/trainSystem?year=${year}`;
    return new Promise((resolve, reject) => {
      this.setState({ isTraining: true }, () => {
        fetch(url)
          .then(response => response.json())
        // this.simulateAPI()
          .then(data => {
              resolve(data);
          })
          .catch(err => {
            reject(err)
          });
      });
    });
  }
  trainData() {
      console.log('Training data');
      this.triggerPolling()
      .then(response => {
        const id = response.processId;
        const url = `${API_URL}/getStatus?objId=${id}`;
        const pollBackend = () => {
          fetch(url)
          .then(response => response.json())
          // this.simulateAPI()
          .then(response => {
            if (response.status === 'completed') {
              this.setState({ isTraining: false }, () => {
                clearInterval(pollingId);
                this.props.onTrainingComplete();
              });
            }
            console.log(response);
          })
          .catch(err => {
            this.setState({ isTraining: false }, () => {
              clearInterval(pollingId);
              this.props.onTrainingComplete();
              console.error(err);
            });
          });
        }
        const pollingId = setInterval(pollBackend, 2000);
      })
      .catch(err => {
        console.log(err);
      });
  }
  returnToMap() {
      this.props.toggleMenu();
  }
  render() {
    let loader = <Loader type="line-scale-pulse-out" />;

    return (
      <MenuContainer>
        <button className="menu-button" onClick={this.props.toggleMenu}>
          <i className="material-icons">&#xE5D2;</i>
        </button>
        {
          this.state.isTraining && loader
        }
        {
          (this.props.isMenuOpen ? (
            <div className="overlay-container">
              <div className="buttons-container">
                <Button name="trainData" onClick={this.trainData.bind(this)}>Train Data</Button>
                <Button name="returnToMap" onClick={this.returnToMap.bind(this)}>Return to Map</Button>
              </div>
            </div>
          ) : null)
        }
      </MenuContainer>
    );
  }
}

export default Menu;
